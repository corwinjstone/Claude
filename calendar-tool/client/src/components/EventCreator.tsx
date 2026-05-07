import { useState, useCallback } from 'react';
import { Mic, MicOff, Plus, Loader, X, UserPlus, Calendar } from 'lucide-react';
import { useVoice } from '../hooks/useVoice';
import { api } from '../lib/api';
import type { EventDraft, Provider, CalendarEntry } from '../types';

interface Props {
  calendars: CalendarEntry[];
  connectedProviders: Provider[];
  onCreated: () => void;
}

function parseVoiceCommand(text: string, draft: EventDraft): Partial<EventDraft> {
  const lower = text.toLowerCase();
  const updates: Partial<EventDraft> = {};

  // Extract title: "meeting with John" → title = "meeting with John"
  if (!draft.title) updates.title = text;

  // Extract time patterns: "at 3pm", "from 2 to 4", "tomorrow at noon"
  const timeMatch = text.match(/at (\d{1,2}(?::\d{2})?\s*(?:am|pm)?)/i);
  if (timeMatch) {
    const now = new Date();
    const tomorrow = lower.includes('tomorrow');
    if (tomorrow) now.setDate(now.getDate() + 1);
    // Parse simple time
    const t = timeMatch[1].replace(/\s/g, '').toLowerCase();
    const h12 = t.match(/^(\d{1,2})(?::(\d{2}))?(am|pm)?$/);
    if (h12) {
      let h = parseInt(h12[1]);
      const m = h12[2] ? parseInt(h12[2]) : 0;
      if (h12[3] === 'pm' && h < 12) h += 12;
      if (h12[3] === 'am' && h === 12) h = 0;
      now.setHours(h, m, 0, 0);
      updates.start = now.toISOString().slice(0, 16);
      const endDate = new Date(now.getTime() + 60 * 60000);
      updates.end = endDate.toISOString().slice(0, 16);
    }
  }

  return updates;
}

const localNow = () => {
  const d = new Date();
  d.setMinutes(Math.ceil(d.getMinutes() / 15) * 15, 0, 0);
  return d.toISOString().slice(0, 16);
};

const localHourLater = () => {
  const d = new Date();
  d.setMinutes(Math.ceil(d.getMinutes() / 15) * 15, 0, 0);
  d.setHours(d.getHours() + 1);
  return d.toISOString().slice(0, 16);
};

export function EventCreator({ calendars, connectedProviders, onCreated }: Props) {
  const [draft, setDraft] = useState<EventDraft>({
    title: '',
    description: '',
    start: localNow(),
    end: localHourLater(),
    attendees: [],
    provider: connectedProviders[0] ?? '',
    calendarId: '',
  });
  const [guestInput, setGuestInput] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleTranscript = useCallback((text: string) => {
    const updates = parseVoiceCommand(text, draft);
    setDraft(d => ({ ...d, ...updates }));
  }, [draft]);

  const { state: voiceState, start: startListening, stop: stopListening } = useVoice(handleTranscript);

  const addGuest = () => {
    const email = guestInput.trim();
    if (!email || draft.attendees.includes(email)) return;
    setDraft(d => ({ ...d, attendees: [...d.attendees, email] }));
    setGuestInput('');
  };

  const removeGuest = (email: string) =>
    setDraft(d => ({ ...d, attendees: d.attendees.filter(a => a !== email) }));

  const handleSubmit = async () => {
    if (!draft.title || !draft.start || !draft.end || !draft.provider) return;
    setSubmitting(true);
    setError('');
    try {
      await api.createEvent(draft);
      setSuccess(true);
      onCreated();
      setTimeout(() => {
        setSuccess(false);
        setDraft({
          title: '', description: '', start: localNow(), end: localHourLater(),
          attendees: [], provider: connectedProviders[0] ?? '', calendarId: '',
        });
      }, 2000);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to create event');
    } finally {
      setSubmitting(false);
    }
  };

  const providerCalendars = calendars.filter(c => c.provider === draft.provider);

  return (
    <div className="card space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold text-slate-800">New Event</h2>
        {/* Voice button */}
        <button
          onClick={voiceState === 'listening' ? stopListening : startListening}
          disabled={voiceState === 'unsupported'}
          title={voiceState === 'unsupported' ? 'Voice not supported in this browser' : 'Speak to fill fields'}
          className={`relative p-2.5 rounded-xl transition-all ${
            voiceState === 'listening'
              ? 'bg-red-500 text-white shadow-lg shadow-red-200 animate-pulse'
              : voiceState === 'unsupported'
              ? 'bg-slate-100 text-slate-300 cursor-not-allowed'
              : 'bg-primary-50 text-primary-600 hover:bg-primary-100'
          }`}
        >
          {voiceState === 'listening' ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
          {voiceState === 'listening' && (
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-400 rounded-full animate-ping" />
          )}
        </button>
      </div>

      {voiceState === 'listening' && (
        <p className="text-xs text-red-500 text-center animate-pulse">
          Listening… say something like "Team standup at 9am tomorrow"
        </p>
      )}

      {/* Title */}
      <input
        className="input text-base font-medium"
        placeholder="Event title"
        value={draft.title}
        onChange={e => setDraft(d => ({ ...d, title: e.target.value }))}
      />

      {/* Date / Time */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs font-medium text-slate-500 mb-1 block">Start</label>
          <input
            className="input"
            type="datetime-local"
            value={draft.start}
            onChange={e => setDraft(d => ({ ...d, start: e.target.value }))}
          />
        </div>
        <div>
          <label className="text-xs font-medium text-slate-500 mb-1 block">End</label>
          <input
            className="input"
            type="datetime-local"
            value={draft.end}
            onChange={e => setDraft(d => ({ ...d, end: e.target.value }))}
          />
        </div>
      </div>

      {/* Description */}
      <textarea
        className="input resize-none"
        rows={2}
        placeholder="Description (optional)"
        value={draft.description}
        onChange={e => setDraft(d => ({ ...d, description: e.target.value }))}
      />

      {/* Guests */}
      <div>
        <label className="text-xs font-medium text-slate-500 mb-2 block">Guests</label>
        <div className="flex gap-2">
          <input
            className="input flex-1"
            type="email"
            placeholder="guest@email.com"
            value={guestInput}
            onChange={e => setGuestInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && addGuest()}
          />
          <button onClick={addGuest} className="btn-ghost px-3">
            <UserPlus className="w-4 h-4" />
          </button>
        </div>
        {draft.attendees.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-2">
            {draft.attendees.map(email => (
              <span key={email} className="inline-flex items-center gap-1 bg-primary-50 text-primary-700 text-xs px-2 py-1 rounded-lg">
                {email}
                <button onClick={() => removeGuest(email)} className="hover:text-red-500">
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Provider + Calendar selector */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs font-medium text-slate-500 mb-1 block">Save to</label>
          <select
            className="input"
            value={draft.provider}
            onChange={e => setDraft(d => ({ ...d, provider: e.target.value as Provider, calendarId: '' }))}
          >
            <option value="">Select calendar…</option>
            {connectedProviders.map(p => (
              <option key={p} value={p}>
                {p === 'google' ? 'Google' : p === 'outlook' ? 'Outlook' : 'Apple'}
              </option>
            ))}
          </select>
        </div>
        {providerCalendars.length > 1 && (
          <div>
            <label className="text-xs font-medium text-slate-500 mb-1 block">Calendar</label>
            <select
              className="input"
              value={draft.calendarId}
              onChange={e => setDraft(d => ({ ...d, calendarId: e.target.value }))}
            >
              <option value="">Primary</option>
              {providerCalendars.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
        )}
      </div>

      {error && <p className="text-xs text-red-500">{error}</p>}

      <button
        className={`btn w-full justify-center ${success ? 'bg-green-500 text-white' : 'btn-primary'}`}
        onClick={handleSubmit}
        disabled={submitting || !draft.title || !draft.provider}
      >
        {submitting ? (
          <Loader className="w-4 h-4 animate-spin" />
        ) : success ? (
          'Event created!'
        ) : (
          <>
            <Calendar className="w-4 h-4" />
            Create Event
          </>
        )}
      </button>
    </div>
  );
}
