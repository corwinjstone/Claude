import { useState } from 'react';
import { CheckCircle, XCircle, Loader } from 'lucide-react';
import type { ConnectionStatus } from '../types';
import { api } from '../lib/api';

interface Props {
  status: ConnectionStatus;
  onStatusChange: (s: ConnectionStatus) => void;
}

const PROVIDERS = [
  {
    id: 'google' as const,
    label: 'Google Calendar',
    color: 'bg-red-500',
    textColor: 'text-red-600',
    borderColor: 'border-red-200',
    bgLight: 'bg-red-50',
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none">
        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
      </svg>
    ),
  },
  {
    id: 'outlook' as const,
    label: 'Outlook Calendar',
    color: 'bg-blue-600',
    textColor: 'text-blue-600',
    borderColor: 'border-blue-200',
    bgLight: 'bg-blue-50',
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none">
        <rect width="24" height="24" rx="4" fill="#0078D4"/>
        <path d="M4 7h9v10H4z" fill="#fff" fillOpacity=".9"/>
        <path d="M13 7h7v4h-7zM13 13h7v4h-7z" fill="#50E6FF" fillOpacity=".8"/>
        <circle cx="8.5" cy="12" r="2.5" fill="#0078D4"/>
      </svg>
    ),
  },
  {
    id: 'apple' as const,
    label: 'Apple Calendar',
    color: 'bg-slate-800',
    textColor: 'text-slate-700',
    borderColor: 'border-slate-200',
    bgLight: 'bg-slate-50',
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
        <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
      </svg>
    ),
  },
];

export function CalendarConnect({ status, onStatusChange }: Props) {
  const [loading, setLoading] = useState<string | null>(null);
  const [appleForm, setAppleForm] = useState(false);
  const [appleId, setAppleId] = useState('');
  const [applePass, setApplePass] = useState('');
  const [error, setError] = useState('');

  const handleConnect = (id: 'google' | 'outlook' | 'apple') => {
    if (id === 'apple') { setAppleForm(true); return; }
    window.location.href = `/auth/${id}`;
  };

  const handleAppleSubmit = async () => {
    setLoading('apple');
    setError('');
    try {
      await api.connectApple(appleId, applePass);
      onStatusChange({ ...status, apple: true });
      setAppleForm(false);
    } catch {
      setError('Could not connect. Check your Apple ID and app-specific password.');
    } finally {
      setLoading(null);
    }
  };

  const handleDisconnect = async (id: 'google' | 'outlook' | 'apple') => {
    setLoading(id);
    try {
      await api.disconnect(id);
      onStatusChange({ ...status, [id]: false });
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="card">
      <h2 className="text-base font-semibold mb-4 text-slate-800">Connected Calendars</h2>
      <div className="space-y-3">
        {PROVIDERS.map((p) => {
          const connected = status[p.id];
          const busy = loading === p.id;
          return (
            <div
              key={p.id}
              className={`flex items-center justify-between rounded-xl border p-3 transition-colors ${
                connected ? `${p.bgLight} ${p.borderColor}` : 'bg-white border-slate-200'
              }`}
            >
              <div className="flex items-center gap-3">
                {p.icon}
                <span className="text-sm font-medium text-slate-700">{p.label}</span>
              </div>
              <div className="flex items-center gap-2">
                {connected ? (
                  <>
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <button
                      onClick={() => handleDisconnect(p.id)}
                      disabled={busy}
                      className="text-xs text-slate-400 hover:text-red-500 transition-colors"
                    >
                      {busy ? <Loader className="w-3 h-3 animate-spin" /> : 'Disconnect'}
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => handleConnect(p.id)}
                    disabled={busy}
                    className={`btn text-white text-xs py-1.5 px-3 rounded-lg ${p.color} hover:opacity-90 active:scale-95`}
                  >
                    {busy ? <Loader className="w-3 h-3 animate-spin" /> : 'Connect'}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Apple modal */}
      {appleForm && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="card w-full max-w-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-slate-800">Connect Apple Calendar</h3>
              <button onClick={() => setAppleForm(false)} className="btn-ghost p-1 rounded-lg">
                <XCircle className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-slate-500 mb-4">
              Use an{' '}
              <a
                href="https://appleid.apple.com/account/manage"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-500 underline"
              >
                app-specific password
              </a>{' '}
              — not your regular Apple ID password.
            </p>
            <div className="space-y-3">
              <input
                className="input"
                type="email"
                placeholder="Apple ID (email)"
                value={appleId}
                onChange={e => setAppleId(e.target.value)}
              />
              <input
                className="input"
                type="password"
                placeholder="App-specific password"
                value={applePass}
                onChange={e => setApplePass(e.target.value)}
              />
              {error && <p className="text-xs text-red-500">{error}</p>}
              <button
                className="btn-primary w-full justify-center"
                onClick={handleAppleSubmit}
                disabled={!appleId || !applePass || !!loading}
              >
                {loading === 'apple' ? <Loader className="w-4 h-4 animate-spin" /> : 'Connect'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
