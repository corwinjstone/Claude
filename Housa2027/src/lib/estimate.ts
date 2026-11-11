// Home value estimate for the calculator. Dummy data only: a real build would call a value vendor (ATTOM, Cotality).
import 'server-only';
import { db } from './data';
import type { HomeEstimate } from './types';

const r5k = (n: number) => Math.round(n / 5000) * 5000;
const TYPICAL_SQFT = 2100;
const DFW_PPSF = 230;

// Stable pseudo-random 0..1 from a string, so the same address always gets the same guess.
const hash01 = (s: string) => {
  let h = 2166136261;
  for (const c of s) h = Math.imul(h ^ c.charCodeAt(0), 16777619);
  return ((h >>> 0) % 10000) / 10000;
};

export function estimateFor(opts: { propertyId?: string; label: string; zip?: string | null }): HomeEstimate {
  const p = opts.propertyId ? db.properties.find((x) => x.id === opts.propertyId) : undefined;
  if (p) {
    return {
      label: `${p.address.street}, ${p.address.city}, TX ${p.address.zip}`,
      zip: p.address.zip,
      source: 'housa-record',
      ...p.estValue,
      payoffGuess: p.mortgagePayoff,
      payoffKnown: true,
      details: { beds: p.beds, baths: p.baths, sqft: p.sqft, neighborhood: p.neighborhood },
      propertyId: p.id,
    };
  }
  const zip = opts.zip ?? opts.label.match(/\b(7[5-6]\d{3})\b/)?.[1] ?? null;
  const z = zip ? db.zips.find((x) => x.zip === zip) : undefined;
  const wobble = 0.85 + hash01(opts.label) * 0.3;
  const mid = r5k((z ? z.ppsf * 0.8 : DFW_PPSF) * TYPICAL_SQFT * wobble);
  return {
    label: opts.label,
    zip,
    source: z ? 'zip-estimate' : 'dfw-estimate',
    low: r5k(mid * 0.9),
    mid,
    high: r5k(mid * 1.1),
    payoffGuess: r5k(mid * 0.45),
    payoffKnown: false,
    details: z ? { beds: 0, baths: 0, sqft: 0, neighborhood: z.neighborhood } : undefined,
  };
}
