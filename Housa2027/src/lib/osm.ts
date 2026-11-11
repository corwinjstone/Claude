// OpenStreetMap address suggestions via Photon (built for type-ahead; allows browser CORS).
import type { AddressSuggestion } from './types';

export const DFW = { lat: 32.85, lng: -96.95 };

interface PhotonFeature { properties: { osm_id: number; housenumber?: string; street?: string; name?: string; city?: string; postcode?: string; state?: string } }

export async function osmSuggestions(q: string, init: RequestInit = {}): Promise<AddressSuggestion[]> {
  const url = new URL('https://photon.komoot.io/api/');
  url.search = new URLSearchParams({ q, limit: '5', lat: String(DFW.lat), lon: String(DFW.lng), bbox: '-97.7,32.4,-96.3,33.5', lang: 'en' }).toString();
  const res = await fetch(url, { signal: AbortSignal.timeout(2500), cache: 'no-store', ...init });
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
