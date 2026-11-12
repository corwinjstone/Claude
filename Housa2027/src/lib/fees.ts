// The one place that knows Housa's fee rules.
import type { Fee } from './types';

/** Platform Technology & Transaction Coordination Fee: flat, paid by the seller at closing. */
export const PLATFORM_FEE = 995;
export const PLATFORM_FEE_NAME = 'Platform Technology & Transaction Coordination Fee';
/** Short form for tight spots (the PRD also says "platform fee"). Use the full name wherever there is room. */
export const PLATFORM_FEE_SHORT = 'Platform fee';

export const feeDollars = (fee: Fee, salePrice: number) =>
  fee.kind === 'percent' ? (salePrice * fee.value) / 100 : fee.value;

export const describeFee = (fee: Fee) =>
  fee.kind === 'percent' ? `${Number(fee.value.toFixed(2))}% of the sale price` : `$${fee.value.toLocaleString('en-US')} flat`;

export interface NetSheetInput {
  salePrice: number;
  payoff: number;
  listingFee: Fee;
  buyerAgent: Fee;
  platformFee: number; // 0 for the traditional scenario
  otherClosingPct: number; // title policy, escrow, taxes and other seller costs
}

export interface NetSheetLine { key: string; label: string; amount: number; help?: string }
export interface NetSheet { youKeep: number; totalCosts: number; lines: NetSheetLine[] }

export function netSheet(i: NetSheetInput): NetSheet {
  const lines: NetSheetLine[] = [
    { key: 'payoff', label: 'Mortgage payoff', amount: i.payoff, help: 'payoff' },
    { key: 'listing', label: 'Your listing agent', amount: feeDollars(i.listingFee, i.salePrice), help: 'listingFee' },
    { key: 'buyerAgent', label: "Buyer's agent (your offer)", amount: feeDollars(i.buyerAgent, i.salePrice), help: 'buyerAgent' },
  ];
  if (i.platformFee > 0) lines.push({ key: 'platform', label: PLATFORM_FEE_NAME, amount: i.platformFee, help: 'platformFee' });
  lines.push({ key: 'other', label: 'Estimated closing costs', amount: (i.salePrice * i.otherClosingPct) / 100, help: 'closingCosts' });
  const totalCosts = lines.reduce((s, l) => s + l.amount, 0);
  return { youKeep: i.salePrice - totalCosts, totalCosts, lines };
}
