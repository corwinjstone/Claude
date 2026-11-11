// Address lookups for the browser.
// Server build: calls the API routes (which can use a private Google key).
// Static build (GitHub Pages, NEXT_PUBLIC_STATIC_EXPORT=1): no server, so it runs the same logic here,
// with OpenStreetMap + the sample addresses. Google is never used from the browser, so no key is exposed.
import { estimateFor } from './estimate';
import { localSuggestions } from './localPlaces';
import { osmSuggestions } from './osm';
import type { AddressSuggestion, HomeEstimate } from './types';

export type Provider = 'google' | 'osm' | 'housa';
export const isStatic = process.env.NEXT_PUBLIC_STATIC_EXPORT === '1';

export async function suggest(q: string, signal?: AbortSignal): Promise<{ suggestions: AddressSuggestion[]; provider: Provider }> {
  if (!isStatic) {
    const res = await fetch(`/api/places?q=${encodeURIComponent(q)}`, { signal });
    return res.json();
  }
  const local = localSuggestions(q, 3);
  if (q.trim().length < 4) return { suggestions: local, provider: 'housa' };
  try {
    return { suggestions: [...local, ...(await osmSuggestions(q, { signal }))].slice(0, 6), provider: 'osm' };
  } catch (e) {
    if (signal?.aborted) throw e;
    return { suggestions: localSuggestions(q, 6), provider: 'housa' };
  }
}

export async function estimate(s: AddressSuggestion): Promise<HomeEstimate> {
  const label = [s.label, s.secondary].filter(Boolean).join(', ');
  if (isStatic) {
    return estimateFor({ propertyId: s.id.startsWith('housa:') ? s.id.slice(6) : undefined, label, zip: s.zip });
  }
  const qs = new URLSearchParams({ id: s.id, label });
  if (s.zip) qs.set('zip', s.zip);
  const res = await fetch(`/api/estimate?${qs}`);
  if (!res.ok) throw new Error('estimate failed');
  return res.json();
}
