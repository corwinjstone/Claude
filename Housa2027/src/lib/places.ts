// Address autocomplete and lookup. Server-only: the Google key never reaches the browser.
// Order: Google Places (New) if GOOGLE_MAPS_API_KEY is set → OpenStreetMap (Photon) → Housa's dummy records.
import 'server-only';
import { db } from './data';
import type { AddressSuggestion } from './types';

const DFW = { lat: 32.85, lng: -96.95 };
const TIMEOUT_MS = 2500;
const key = () => process.env.GOOGLE_MAPS_API_KEY?.trim() || '';

const fullAddress = (p: (typeof db.properties)[number]) =>
  `${p.address.street}, ${p.address.city}, TX ${p.address.zip}`;

export function localSuggestions(q: string, limit = 5): AddressSuggestion[] {
  const n = q.toLowerCase().replace(/[^a-z0-9 ]/g, '');
  if (n.length < 2) return [];
  const words = n.split(/\s+/).filter(Boolean);
  return db.properties
    .filter((p) => {
      const hay = `${fullAddress(p)} ${p.neighborhood}`.toLowerCase().replace(/[^a-z0-9 ]/g, '');
      return words.every((w) => hay.includes(w));
    })
    .slice(0, limit)
    .map((p) => ({ id: `housa:${p.id}`, label: p.address.street, secondary: `${p.address.city}, TX ${p.address.zip} · ${p.neighborhood}`, source: 'housa', zip: p.address.zip }));
}

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

interface PhotonFeature { properties: { osm_id: number; housenumber?: string; street?: string; name?: string; city?: string; postcode?: string; state?: string } }
async function osmSuggestions(q: string): Promise<AddressSuggestion[]> {
  const url = new URL('https://photon.komoot.io/api/');
  url.search = new URLSearchParams({ q, limit: '5', lat: String(DFW.lat), lon: String(DFW.lng), bbox: '-97.7,32.4,-96.3,33.5', lang: 'en' }).toString();
  const res = await fetch(url, { headers: { 'User-Agent': 'housa-prototype/0.1' }, signal: AbortSignal.timeout(TIMEOUT_MS), cache: 'no-store' });
  if (!res.ok) throw new Error(`osm ${res.status}`);
  const json = (await res.json()) as { features: PhotonFeature[] };
  return json.features
    .filter((f) => f.properties.state === 'Texas')
    .map((f) => {
      const p = f.properties;
      const line1 = [p.housenumber, p.street ?? p.name].filter(Boolean).join(' ');
      return { id: `osm:${p.osm_id}`, label: line1 || p.name || q, secondary: [p.city, p.postcode && `TX ${p.postcode}`].filter(Boolean).join(', '), source: 'osm' as const, zip: p.postcode };
    });
}

export async function suggestAddresses(q: string): Promise<{ suggestions: AddressSuggestion[]; provider: 'google' | 'osm' | 'housa' }> {
  const local = localSuggestions(q, 3);
  if (q.trim().length < 4) return { suggestions: local, provider: 'housa' };
  try {
    if (key()) return { suggestions: [...local, ...(await googleSuggestions(q))].slice(0, 6), provider: 'google' };
  } catch { /* fall through to OSM */ }
  try {
    return { suggestions: [...local, ...(await osmSuggestions(q))].slice(0, 6), provider: 'osm' };
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
