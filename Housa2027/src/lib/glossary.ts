// "What does this mean?" tips. Plain language, high-school reading level.
export const glossary = {
  homeValue: {
    term: 'Home value range',
    text: 'Our best guess at what your home could sell for today. The real price depends on its condition and what buyers will pay. Agents will give you their own price when they bid.',
  },
  payoff: {
    term: 'Mortgage payoff',
    text: 'The amount you still owe on your home loan. The title company pays it off from the sale money on closing day. Your lender can tell you the exact number.',
  },
  listingFee: {
    term: 'Listing agent fee',
    text: 'What you pay the agent who sells your home. It can be a percent of the price or one flat amount. On Housa, agents compete, so you see each fee before you pick.',
  },
  buyerAgent: {
    term: "Buyer's agent offer",
    text: "Money you choose to offer toward the buyer's agent. Since 2024 this is up to you, and it can be $0. Offering some can bring more buyers.",
  },
  platformFee: {
    term: 'Platform Technology & Transaction Coordination Fee',
    text: 'A flat $995 fee for the software and coordination Housa provides: milestone tracking, the digital closing packet for the title company, a secure document locker and tracking of the money you keep. You pay it from your sale money at closing, and only if your home sells. It is never a percentage and never changes with your price.',
  },
  closingCosts: {
    term: 'Estimated closing costs',
    text: 'What the title company charges to close the sale: escrow, the title policy and tax adjustments. We start with about 1% of the price as a rough guess. Change it to match a real estimate.',
  },
  equity: {
    term: 'Your equity',
    text: 'The part of your home you own: the sale price minus what you still owe on your mortgage. Selling costs come out of this.',
  },
  cashAtClose: {
    term: 'Cash at close',
    text: 'The money you walk away with on closing day: your equity minus agent fees, the Platform Technology & Transaction Coordination Fee, and your estimated closing costs.',
  },
  youKeep: {
    term: 'You keep',
    text: 'The cash left for you after the sale: the price minus your loan payoff, agent fees and closing costs.',
  },
  traditional: {
    term: 'Traditional 6%',
    text: "The old standard: about 3% to your agent and 3% to the buyer's agent. Since 2024, these fees are open to negotiation.",
  },
  typicalHousa: {
    term: 'Typical Housa bid',
    text: 'The middle fee from recent full-service agent bids on Housa in Dallas–Fort Worth. Housa does not set fees. Agents set their own.',
  },
} as const;

export type GlossaryKey = keyof typeof glossary;
