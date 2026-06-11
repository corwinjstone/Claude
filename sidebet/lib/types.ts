export type User = {
  id: string;
  name: string;
  handle: string;
  avatarUrl?: string;
  walletUsd: number;
};

export type StakeKind = "cash" | "crypto" | "dinner" | "favor" | "custom";

export type Stake = {
  kind: StakeKind;
  amountUsd?: number; // for cash/crypto
  description?: string; // for dinner/favor/custom (e.g. "piggyback ride")
};

export type BetStatus =
  | "draft"
  | "open"        // friend invited, awaiting accept
  | "active"     // accepted, event in progress / pending
  | "resolved"   // outcome known
  | "voided";

export type BetVisibility = "private" | "public";

export type BetCategory =
  | "sports"
  | "stocks"
  | "news"
  | "weather"
  | "goofy"
  | "prediction"
  | "other";

export type Position = {
  userId: string;
  side: "yes" | "no" | "a" | "b"; // a/b for two-team bets
  stake: Stake;
  createdAt: number;
};

export type Bet = {
  id: string;
  title: string;        // "Trailblazers to win +5"
  category: BetCategory;
  description?: string;
  // For sports: teams. For others: two options.
  sideA: { label: string; sublabel?: string; emoji?: string; logo?: string };
  sideB: { label: string; sublabel?: string; emoji?: string; logo?: string };
  spread?: number;       // points spread, optional
  creatorId: string;
  visibility: BetVisibility;
  status: BetStatus;
  positions: Position[];
  resolution?: { winningSide: "a" | "b"; resolvedAt: number; rationale?: string };
  createdAt: number;
  eventAt?: number;      // when the underlying event happens
  context?: string;      // for AI resolver context (final score, etc.)
};

export type FeedItem = {
  id: string;
  type: "news" | "tip" | "ai";
  title: string;
  body?: string;
  imageUrl?: string;
  tags?: string[];
  date?: string;
};
