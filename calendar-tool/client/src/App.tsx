import { useEffect, useState, useCallback } from 'react';
import { CalendarDays } from 'lucide-react';
import { CalendarConnect } from './components/CalendarConnect';
import { EventCreator } from './components/EventCreator';
import { AvailabilityView } from './components/AvailabilityView';
import { api } from './lib/api';
import type { ConnectionStatus, CalendarEntry, Provider } from './types';

type Tab = 'create' | 'availability';

export default function App() {
  const [status, setStatus] = useState<ConnectionStatus>({ google: false, outlook: false, apple: false });
  const [calendars, setCalendars] = useState<CalendarEntry[]>([]);
  const [tab, setTab] = useState<Tab>('create');
  const [loading, setLoading] = useState(true);

  const connectedProviders = Object.entries(status)
    .filter(([, v]) => v)
    .map(([k]) => k as Provider);

  const loadStatus = useCallback(async () => {
    try {
      const s = await api.authStatus();
      setStatus(s);
    } catch { /* no-op */ }
  }, []);

  const loadCalendars = useCallback(async () => {
    try {
      const { calendars: cals } = await api.listCalendars();
      setCalendars(cals);
    } catch { /* no-op */ }
  }, []);

  useEffect(() => {
    (async () => {
      await loadStatus();
      setLoading(false);
    })();
  }, [loadStatus]);

  useEffect(() => {
    if (connectedProviders.length > 0) loadCalendars();
  }, [status]);

  // Handle OAuth redirect callbacks (?connected=google)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const connected = params.get('connected');
    const err = params.get('error');
    if (connected || err) {
      window.history.replaceState({}, '', window.location.pathname);
      loadStatus();
    }
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const anyConnected = connectedProviders.length > 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-primary-50/30">
      {/* Header */}
      <header className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary-500 rounded-xl flex items-center justify-center">
              <CalendarDays className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-slate-800 tracking-tight">Cal</span>
          </div>

          {/* Tab switcher */}
          {anyConnected && (
            <div className="flex bg-slate-100 rounded-xl p-1 gap-1">
              {(['create', 'availability'] as Tab[]).map(t => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
                    tab === t
                      ? 'bg-white shadow-sm text-slate-800'
                      : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  {t === 'create' ? 'New Event' : 'Availability'}
                </button>
              ))}
            </div>
          )}

          <div className="w-[72px]" /> {/* spacer to center tabs */}
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-6">
        {!anyConnected ? (
          /* Onboarding state */
          <div className="max-w-md mx-auto">
            <div className="text-center mb-8 mt-8">
              <div className="w-16 h-16 bg-primary-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-primary-200">
                <CalendarDays className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-slate-800 mb-2">Welcome to Cal</h1>
              <p className="text-slate-500 text-sm">
                Connect your calendars to create events, invite guests, and check everyone's availability — all in one place.
              </p>
            </div>
            <CalendarConnect status={status} onStatusChange={s => { setStatus(s); loadCalendars(); }} />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-6 items-start">
            {/* Sidebar */}
            <div className="space-y-4">
              <CalendarConnect status={status} onStatusChange={s => { setStatus(s); loadCalendars(); }} />
            </div>

            {/* Main content */}
            <div>
              {tab === 'create' ? (
                <EventCreator
                  calendars={calendars}
                  connectedProviders={connectedProviders}
                  onCreated={loadCalendars}
                />
              ) : (
                <AvailabilityView isConnected={anyConnected} />
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
