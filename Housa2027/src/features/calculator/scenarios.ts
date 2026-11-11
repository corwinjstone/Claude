// One shape for every fee option, so the headline, the chart and the table all read the same numbers.
import { feeDollars, netSheet, PLATFORM_FEE } from '@/lib/fees';
import type { Fee } from '@/lib/types';

export type ScenarioKey = 'traditional' | 'housa' | 'custom';
export const OTHER_CLOSING_PCT = 1;

export interface Scenario {
  key: ScenarioKey;
  name: string;
  shortName: string;
  agentFee: Fee;
  agent: number;
  buyerAgentPct: number;
  buyerAgent: number;
  platform: number;
  /** Agent fees as a share of the sale price (your agent + buyer's agent), not counting the flat Housa fee. */
  agentPctTotal: number;
  agentDollarsTotal: number;
  feesTotal: number;
  otherClosing: number;
  payoff: number;
  /** Sale price minus mortgage payoff: the money that is yours before any selling costs. */
  equity: number;
  youKeep: number;
  vsTraditional: number;
}

export function buildScenarios(o: {
  price: number; payoff: number; buyerPct: number; /** A flat dollar offer to the buyer's agent. Wins over buyerPct when set. */ buyerFlat?: number; typicalPct: number; customFee: Fee;
}): Record<ScenarioKey, Scenario> {
  const make = (key: ScenarioKey, name: string, shortName: string, agentFee: Fee, buyerAgentPct: number, platform: number) => {
    const sheet = netSheet({
      salePrice: o.price, payoff: o.payoff, listingFee: agentFee,
      buyerAgent: { kind: 'percent', value: buyerAgentPct }, platformFee: platform, otherClosingPct: OTHER_CLOSING_PCT,
    });
    const agent = feeDollars(agentFee, o.price);
    const buyerAgent = (o.price * buyerAgentPct) / 100;
    const agentPct = agentFee.kind === 'percent' ? agentFee.value : (agent / o.price) * 100;
    return {
      key, name, shortName, agentFee, agent, buyerAgentPct, buyerAgent, platform,
      agentPctTotal: agentPct + buyerAgentPct,
      agentDollarsTotal: agent + buyerAgent,
      feesTotal: agent + buyerAgent + platform,
      otherClosing: (o.price * OTHER_CLOSING_PCT) / 100,
      payoff: o.payoff,
      equity: o.price - o.payoff,
      youKeep: sheet.youKeep,
      vsTraditional: 0,
    } satisfies Scenario;
  };
  const traditional = make('traditional', 'Traditional 6%', 'Traditional', { kind: 'percent', value: 3 }, 3, 0);
  // A flat buyer's-agent offer is stored as its equivalent percent of the price, so every total and label stays consistent.
  const buyerPct = o.buyerFlat != null ? (o.buyerFlat / o.price) * 100 : o.buyerPct;
  const housa = make('housa', 'Typical Housa bid', 'Typical Housa', { kind: 'percent', value: o.typicalPct }, buyerPct, PLATFORM_FEE);
  const custom = make('custom', 'Your fee', 'Your fee', o.customFee, buyerPct, PLATFORM_FEE);
  for (const s of [housa, custom]) s.vsTraditional = s.youKeep - traditional.youKeep;
  return { traditional, housa, custom };
}

/** "4.25%" — trims trailing zeros. */
export const pctText = (n: number) => `${Number(n.toFixed(2))}%`;
