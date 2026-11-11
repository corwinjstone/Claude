// Sample-address search over the dummy records. Runs on the server or in the browser.
import properties from '@data/properties.json';
import type { AddressSuggestion, Property } from './types';

const homes = properties as Property[];
const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9 ]/g, '');

export function localSuggestions(q: string, limit = 5): AddressSuggestion[] {
  const n = norm(q);
  if (n.length < 2) return [];
  const words = n.split(/\s+/).filter(Boolean);
  return homes
    .filter((p) => {
      const hay = norm(`${p.address.street} ${p.address.city} TX ${p.address.zip} ${p.neighborhood}`);
      return words.every((w) => hay.includes(w));
    })
    .slice(0, limit)
    .map((p) => ({ id: `housa:${p.id}`, label: p.address.street, secondary: `${p.address.city}, TX ${p.address.zip} · ${p.neighborhood}`, source: 'housa', zip: p.address.zip }));
}
