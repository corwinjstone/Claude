# Architecture: folder structure and data model

## Folder structure

```
Housa2027/
├── data/                     # Dummy data (JSON), from scripts/generate-data.mjs
│   ├── zips.json             # 20 DFW zips: city, neighborhood, $/sq ft, center point
│   ├── properties.json       # 40 homes
│   ├── agents.json           # 30 agents (9 top producers, 21 rising)
│   ├── brokerages.json, teams.json
│   ├── requests.json         # 14 seller requests in every status
│   ├── bids.json             # ~50 bids
│   ├── titleBranches.json    # 25 fictional DFW title branches, for the typeahead
│   ├── closings.json         # title packet, GF number, fee status
│   ├── milestones.json, viewLogs.json, fairShare.json
├── docs/
├── scripts/
│   ├── generate-data.mjs     # npm run seed
│   └── generate-theme.mjs    # npm run theme (M3 tokens from the seed color)
└── src/
    ├── app/                  # Next.js routes (App Router)
    │   ├── page.tsx          # 1. Equity calculator (public)
    │   ├── sell/             # 2. Seller request
    │   ├── seller/           # 4. Bids, 5. accept and sign, 7. problems and milestones
    │   ├── agent/            # 3. Feed, gate, bid; 6. closing intake
    │   ├── admin/            # 8. View logs and fee status
    │   └── api/              # places (autocomplete), estimate, later: bids, views, packets
    ├── components/           # Shared UI: AppShell, HelpTip, AddressSearch…
    ├── features/<screen>/    # Screen-specific client components
    ├── lib/
    │   ├── types.ts          # Data model (below)
    │   ├── data.ts           # Server-only data access (swap for SQLite later)
    │   ├── fees.ts           # Net sheet and fee math; the $995 constant lives here
    │   ├── glossary.ts       # "What does this mean?" text
    │   ├── places.ts         # Google → OpenStreetMap → local address fallback
    │   └── estimate.ts       # Home value estimate (dummy)
    └── theme/                # m3-tokens.json + MUI theme with M3 overrides
```

**Why JSON, not SQLite (for now):** it needs no native build step, it is easy to read and edit, and every page reads data through `src/lib/data.ts`. For screens 3–8, actions that change state (bids, signatures, view logs) will go through API routes into an in-memory store that is seeded from JSON and mirrored in `localStorage`, so a demo can click through the whole loop. Moving to SQLite later only changes `data.ts`.

## Data model

```
Zip ─< Property ─< SellerRequest ─< Bid >─ Agent >─ Brokerage
                        │             │       └──── Team (optional) >─ Brokerage
                        │             └─ accepted → Closing >─ TitleBranch
                        ├─ Milestones (signed → … → closed)
                        └─< ViewLog >─ Agent  (both directions)
FairShareRules (one record of settings)
```

| Entity | Key fields | Notes |
|---|---|---|
| **Property** | address, location, beds/baths/sqft, condition, estValue {low, mid, high}, mortgagePayoff, owner | Address, exact location and owner show only at **stage 3** (after the seller accepts). |
| **SellerRequest** | propertyId, status, timeline, conditionNotes, feePreference, packageWanted, servicesWanted, buyerAgentOffer, risingWindowEndsAt, acceptedBidId | Stage 1 shows zip, neighborhood, price band, beds/baths/size, timeline and a blurred map. Stage 2 adds street name, condition notes, fee preference and services. |
| **Agent** | license, brokerageId, teamId, tier (`rising` if fewer than 15 sides), sidesLast12Months, rating, avgResponseHours, saleToListPct, onTimeReportRate, releasesLast12Months, **activeHousaClients**, bidsThisWeek, packagePrices | Feeds the bid ranking and the fair-share caps. |
| **Bid** | requestId, agentId, package, fee (`percent` or `flat`), coversPlatformFee, suggestedListPrice, plan, brokerApproved, counterRound (≤3) | "You keep" is computed at three sale prices with `lib/fees.ts`. |
| **Closing** | titleBranchId, escrowOfficer, gfNumber, contractUploaded, packetSentAt, closingDate, platformFee = 995, feeStatus (`pending`, `paid` or `overdue`) | The title packet holds Exhibits A–D. |
| **ViewLog** | at, direction (`agent-viewed-request` or `seller-viewed-agent`), stage, attributionSigned | The audit trail for off-platform deals. |
| **FairShareRules** | 12h rising window, 3 of 8 slots reserved, 1 bid per team, client cap (solo 6; team 3 per member, max 15), 10 bids a week, 10% zip share cap, 2 releases → 90-day pause | From PRD module 6. |

## Fee math (`src/lib/fees.ts`)

`You keep = sale price − mortgage payoff − listing agent fee − buyer's agent offer − $995 platform fee − other closing costs (about 1%)`

The traditional scenario uses 3% + 3% and no platform fee. Housa never stores or shows a "standard" rate. The "typical Housa bid" is a median of past bids, labeled as such.
