// Address autocomplete and lookup. Server-only: the Google key never reaches the browser.
// Order: Google Places (New) if GOOGLE_MAPS_API_KEY is set → OpenStreetMap (Photon) → Housa's dummy records.
import 'server-only';
import { localSuggestions } from './localPlaces';
import { DFW, osmSuggestions } from './osm';
import type { AddressSuggestion } from './types';

const TIMEOUT_MS = 2500;
const key = () => process.env.GOOGLE_MAPS_API_KEY?.trim() || '';

async function googleSuggestions(q: string): Promise<AddressSuggestion[]> {
  const res = await fetch('https://places.googleapis.com/v1/places:autocomplete', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-Goog-Api-Key': key() },
    body: JSON.stringify({
      input: q,
      includedRegionCodes: ['us'],
      locationBias: { circle: { center: { latitude: DFW.lat, longitude: DFW.lng }, radius: 50000 } },
    }),
    signal: AbortSignal.timeout(TIMEOUT_MS),
    cache: 'no-store',
  });
  if (!res.ok) throw new Error(`google ${res.status}`);
  const json = (await res.json()) as {
    suggestions?: { placePrediction?: { placeId: string; text: { text: string }; structuredFormat?: { mainText: { text: string }; secondaryText?: { text: string } } } }[];
  };
  return (json.suggestions ?? [])
    .flatMap((s) => (s.placePrediction ? [s.placePrediction] : []))
    .map((p) => ({ id: `google:${p.placeId}`, label: p.structuredFormat?.mainText.text ?? p.text.text, secondary: p.structuredFormat?.secondaryText?.text, source: 'google' as const }));
}

export async function suggestAddresses(q: string): Promise<{ suggestions: AddressSuggestion[]; provider: 'google' | 'osm' | 'housa' }> {
  const local = localSuggestions(q, 3);
  if (q.trim().length < 4) return { suggestions: local, provider: 'housa' };
  try {
    if (key()) return { suggestions: [...local, ...(await googleSuggestions(q))].slice(0, 6), provider: 'google' };
  } catch { /* fall through to OSM */ }
  try {
    return { suggestions: [...local, ...(await osmSuggestions(q, { headers: { 'User-Agent': 'housa-prototype/0.1' } }))].slice(0, 6), provider: 'osm' };
  } catch {
    return { suggestions: localSuggestions(q, 6), provider: 'housa' };
  }
}

/** Find the zip for a Google place (needs Place Details). */
export async function googlePlaceZip(placeId: string): Promise<string | null> {
  if (!key()) return null;
  try {
    const res = await fetch(`https://places.googleapis.com/v1/places/${encodeURIComponent(placeId)}`, {
      headers: { 'X-Goog-Api-Key': key(), 'X-Goog-FieldMask': 'addressComponents' },
      signal: AbortSignal.timeout(TIMEOUT_MS),
      cache: 'no-store',
    });
    if (!res.ok) return null;
    const j = (await res.json()) as { addressComponents?: { types: string[]; shortText: string }[] };
    return j.addressComponents?.find((c) => c.types.includes('postal_code'))?.shortText ?? null;
  } catch {
    return null;
  }
}
