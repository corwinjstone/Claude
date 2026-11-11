// Data model for the Housa prototype. Mirrors the JSON files in /data.

export type Fee =
  | { kind: 'percent'; value: number } // percent of sale price, e.g. 1.5
  | { kind: 'flat'; value: number }; // dollars

export type PackageId = 'full-service' | 'list-negotiate' | 'price-negotiate' | 'contract-to-close' | 'pricing-consult';
export type Timeline = 'asap' | '1-3-months' | '3-6-months' | '6-12-months';
export type Condition = 'move-in-ready' | 'needs-minor-updates' | 'needs-major-work';

export interface Zip { zip: string; city: string; neighborhood: string; ppsf: number; lat: number; lng: number }

export interface Property {
  id: string;
  address: { street: string; city: string; state: 'TX'; zip: string }; // stage 3 only
  neighborhood: string;
  location: { lat: number; lng: number }; // stage 3 only; agents get a blurred circle
  beds: number; baths: number; sqft: number; yearBuilt: number; lotSqft: number;
  condition: Condition;
  estValue: { low: number; mid: number; high: number };
  mortgagePayoff: number;
  owner: { name: string; email: string; phone: string }; // stage 3 only
  interiorPhotos: number;
}

export interface Brokerage { id: string; name: string; office: string; broker: string }
export interface Team { id: string; name: string; brokerageId: string; licensedMembers: number }

export interface Agent {
  id: string; name: string; licenseNumber: string; licenseVerified: boolean; licensedSince: number;
  brokerageId: string; teamId: string | null;
  tier: 'top-producer' | 'rising'; // rising = fewer than 15 closed sides in 12 months
  sidesLast12Months: number; zipsServed: string[];
  rating: number; reviewCount: number; avgResponseHours: number;
  saleToListPct: number; medianDaysOnMarket: number; onTimeReportRate: number;
  releasesLast12Months: number; activeHousaClients: number; bidsThisWeek: number;
  bio: string;
  packagePrices: Record<PackageId, Fee>;
}

export interface SellerRequest {
  id: string; propertyId: string; sellerName: string;
  status: 'open' | 'bidding' | 'accepted' | 'under-contract' | 'closed' | 'withdrawn';
  postedAt: string; ownershipVerified: boolean;
  timeline: Timeline; condition: Condition; conditionNotes: string;
  feePreference: { kind: 'percent'; maxPercent: number } | { kind: 'flat'; maxFlat: number } | { kind: 'open' };
  packageWanted: PackageId; servicesWanted: string[];
  buyerAgentOffer: Fee; sellerGoalPrice: number;
  risingWindowEndsAt: string; acceptedBidId: string | null;
}

export interface Bid {
  id: string; requestId: string; agentId: string;
  package: PackageId; fee: Fee; coversPlatformFee: boolean;
  suggestedListPrice: number; priceRange: { low: number; high: number };
  plan: string; brokerApproved: boolean; submittedAt: string;
  status: 'active' | 'accepted' | 'declined' | 'withdrawn'; counterRound: number; // max 3 rounds
}

export interface TitleBranch {
  id: string; company: string; branch: string; displayName: string; intakeEmail: string; phone: string;
  escrowOfficers: { name: string; email: string }[];
}

export interface Closing {
  id: string; requestId: string; bidId: string; titleBranchId: string;
  escrowOfficer: { name: string; email: string }; gfNumber: string | null;
  contractUploaded: boolean; packetSentAt: string | null;
  salePrice: number | null; closingDate: string;
  platformFee: 995; feeStatus: 'pending' | 'paid' | 'overdue'; feePaidAt: string | null;
}

export type MilestoneKey = 'signed' | 'listed' | 'under-contract' | 'inspection' | 'appraisal' | 'clear-to-close' | 'closed';
export interface Milestones { requestId: string; steps: { key: MilestoneKey; done: boolean; at: string | null }[] }

export interface ViewLog {
  id: string; at: string;
  direction: 'agent-viewed-request' | 'seller-viewed-agent';
  agentId: string; requestId: string; bidId?: string | null;
  stage: 1 | 2 | 3 | null; attributionSigned: boolean | null;
}

export interface FairShareRules {
  risingAgentWindowHours: number; risingAgentMaxSides: number;
  bidSlotsPerRequest: number; reservedRisingSlots: number; bidsPerTeamPerRequest: number;
  activeClientCap: { solo: number; perTeamMember: number; teamMax: number };
  weeklyBidCap: number; marketShareCapPct: number; releasesBeforePause: number; pauseDays: number;
}

// Calculator result for any address (dummy record, or a rough zip-level guess).
export interface HomeEstimate {
  label: string;
  zip: string | null;
  source: 'housa-record' | 'zip-estimate' | 'dfw-estimate';
  low: number; mid: number; high: number;
  payoffGuess: number;
  payoffKnown: boolean;
  details?: { beds: number; baths: number; sqft: number; neighborhood: string };
  propertyId?: string;
}

export interface AddressSuggestion {
  id: string;
  label: string;
  secondary?: string;
  source: 'google' | 'osm' | 'housa';
  zip?: string;
}
