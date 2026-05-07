import { useState, useEffect } from 'react';
import { RefreshCw, UserPlus, X, Clock } from 'lucide-react';
import { api } from '../lib/api';
import type { BusySlot, AvailabilityResult } from '../types';

interface Props {
  isConnected: boolean;
}

const HOUR_HEIGHT = 48; // px per hour
const START_HOUR = 7;
const END_HOUR = 22;

function toMinutes(iso: string) {
  const d = new Date(iso);
  return d.getHours() * 60 + d.getMinutes();
}

function busyToGrid(slots: BusySlot[], dayStart: Date) {
  return slots
    .map(s => {
      const start = new Date(s.start);
      const end = new Date(s.end);
      if (start.toDateString() !== dayStart.toDateString()) return null;
      const startMin = start.getHours() * 60 + start.getMinutes();
      const endMin = end.getHours() * 60 + end.getMinutes();
      return {
        top: ((startMin - START_HOUR * 60) / 60) * HOUR_HEIGHT,
        height: Math.max(((endMin - startMin) / 60) * HOUR_HEIGHT, 8),
      };
    })
    .filter(Boolean) as { top: number; height: number }[];
}

function isoDate(d: Date) {
  return d.toISOString().split('T')[0];
}

const COLORS = [
  'bg-purple-200 border-purple-400',
  'bg-orange-200 border-orange-400',
  'bg-teal-200 border-teal-400',
  'bg-pink-200 border-pink-400',
];

export function AvailabilityView({ isConnected }: Props) {
  const [emails, setEmails] = useState<string[]>([]);
  const [input, setInput] = useState('');
  const [days] = useState(5);
  const [result, setResult] = useState<AvailabilityResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const baseDate = (() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  })();

  const fetchAvailability = async () => {
    if (!isConnected) return;
    setLoading(true);
    setError('');
    try {
      const start = new Date(baseDate).toISOString();
      const end = new Date(baseDate.getTime() + days * 24 * 60 * 60 * 1000).toISOString();
      const data = await api.availability(start, end, emails);
      setResult(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load availability');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isConnected) fetchAvailability();
  }, [isConnected, emails]);

  const addEmail = () => {
    const e = input.trim();
    if (!e || emails.includes(e)) return;
    setEmails(prev => [...prev, e]);
    setInput('');
  };

  const removeEmail = (e: string) => setEmails(prev => prev.filter(x => x !== e));

  const hours = Array.from({ length: END_HOUR - START_HOUR }, (_, i) => START_HOUR + i);
  const dayDates = Array.from({ length: days }, (_, i) => {
    const d = new Date(baseDate);
    d.setDate(d.getDate() + i);
    return d;
  });

  const totalHeight = (END_HOUR - START_HOUR) * HOUR_HEIGHT;

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-semibold text-slate-800">Availability</h2>
        <button
          onClick={fetchAvailability}
          disabled={loading || !isConnected}
          className="btn-ghost p-1.5 rounded-lg"
          title="Refresh"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-primary-500' : 'text-slate-400'}`} />
        </button>
      </div>

      {!isConnected ? (
        <div className="text-center py-8 text-slate-400">
          <Clock className="w-8 h-8 mx-auto mb-2 opacity-40" />
          <p className="text-sm">Connect a calendar to see availability</p>
        </div>
      ) : (
        <>
          {/* Guest emails */}
          <div className="mb-4">
            <div className="flex gap-2 mb-2">
              <input
                className="input flex-1 text-sm"
                type="email"
                placeholder="Add guest email to check availability"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && addEmail()}
              />
              <button onClick={addEmail} className="btn-ghost px-3">
                <UserPlus className="w-4 h-4" />
              </button>
            </div>
            {emails.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {emails.map((e, i) => (
                  <span
                    key={e}
                    className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded-lg border ${COLORS[i % COLORS.length]}`}
                  >
                    {e}
                    <button onClick={() => removeEmail(e)}>
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {error && <p className="text-xs text-red-500 mb-3">{error}</p>}

          {/* Grid */}
          <div className="overflow-x-auto">
            <div className="min-w-[500px]">
              {/* Day headers */}
              <div className="flex pl-10 mb-1">
                {dayDates.map(d => (
                  <div key={d.toISOString()} className="flex-1 text-center">
                    <div className="text-xs font-medium text-slate-500">
                      {d.toLocaleDateString('en-US', { weekday: 'short' })}
                    </div>
                    <div className={`text-lg font-semibold leading-tight ${
                      isoDate(d) === isoDate(new Date()) ? 'text-primary-500' : 'text-slate-800'
                    }`}>
                      {d.getDate()}
                    </div>
                  </div>
                ))}
              </div>

              {/* Time grid */}
              <div className="flex">
                {/* Hour labels */}
                <div className="w-10 flex-shrink-0 relative" style={{ height: totalHeight }}>
                  {hours.map(h => (
                    <div
                      key={h}
                      className="absolute text-xs text-slate-400 -translate-y-2"
                      style={{ top: (h - START_HOUR) * HOUR_HEIGHT }}
                    >
                      {h === 12 ? '12p' : h > 12 ? `${h - 12}p` : `${h}a`}
                    </div>
                  ))}
                </div>

                {/* Day columns */}
                {dayDates.map((d, di) => {
                  const selfBusy = result ? busyToGrid(result.self, d) : [];
                  const guestBusy = emails.map((email, i) => ({
                    email,
                    color: COLORS[i % COLORS.length],
                    slots: result ? busyToGrid(result.guests[email] || [], d) : [],
                  }));

                  return (
                    <div
                      key={d.toISOString()}
                      className="flex-1 relative border-l border-slate-100"
                      style={{ height: totalHeight }}
                    >
                      {/* Hour lines */}
                      {hours.map(h => (
                        <div
                          key={h}
                          className="absolute w-full border-t border-slate-100"
                          style={{ top: (h - START_HOUR) * HOUR_HEIGHT }}
                        />
                      ))}

                      {/* Current time line */}
                      {isoDate(d) === isoDate(new Date()) && (() => {
                        const now = new Date();
                        const nowMin = now.getHours() * 60 + now.getMinutes();
                        const top = ((nowMin - START_HOUR * 60) / 60) * HOUR_HEIGHT;
                        if (top < 0 || top > totalHeight) return null;
                        return (
                          <div
                            className="absolute left-0 right-0 border-t-2 border-primary-500 z-10"
                            style={{ top }}
                          >
                            <div className="w-2 h-2 rounded-full bg-primary-500 -mt-1 -ml-1" />
                          </div>
                        );
                      })()}

                      {/* Self busy */}
                      {selfBusy.map((b, i) => (
                        <div
                          key={i}
                          className="absolute left-0.5 right-0.5 bg-slate-200 border border-slate-300 rounded opacity-80"
                          style={{ top: b.top, height: b.height }}
                          title="You are busy"
                        />
                      ))}

                      {/* Guest busy */}
                      {guestBusy.map(({ email, color, slots }) =>
                        slots.map((b, i) => (
                          <div
                            key={`${email}-${i}`}
                            className={`absolute left-0.5 right-0.5 border rounded opacity-70 ${color}`}
                            style={{ top: b.top, height: b.height, left: '25%', right: '0.5' }}
                            title={`${email} is busy`}
                          />
                        ))
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Legend */}
              <div className="flex items-center gap-4 mt-3 pl-10 flex-wrap">
                <div className="flex items-center gap-1.5 text-xs text-slate-500">
                  <div className="w-3 h-3 bg-slate-200 border border-slate-300 rounded" />
                  You
                </div>
                {emails.map((email, i) => (
                  <div key={email} className="flex items-center gap-1.5 text-xs text-slate-500">
                    <div className={`w-3 h-3 border rounded ${COLORS[i % COLORS.length]}`} />
                    {email.split('@')[0]}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
