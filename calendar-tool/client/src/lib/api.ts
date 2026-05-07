const BASE = '';

async function get<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE}${path}`, { credentials: 'include' });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

async function post<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export const api = {
  authStatus: () => get<{ google: boolean; outlook: boolean; apple: boolean }>('/auth/status'),
  connectApple: (appleId: string, appPassword: string) =>
    post('/auth/apple', { appleId, appPassword }),
  disconnect: (provider: string) => post(`/auth/disconnect/${provider}`, {}),

  listCalendars: () => get<{ calendars: import('../types').CalendarEntry[]; errors: unknown[] }>('/calendar/list'),
  createEvent: (payload: import('../types').EventDraft) => post('/calendar/event', payload),

  availability: (start: string, end: string, emails: string[]) =>
    get<import('../types').AvailabilityResult>(
      `/availability?start=${encodeURIComponent(start)}&end=${encodeURIComponent(end)}&emails=${emails.join(',')}`
    ),
};
