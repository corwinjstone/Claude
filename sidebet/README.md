# SideBet

> Wanna bet?! Friend-to-friend wagers on anything — sports, stocks, news, or
> goofy in-person dares — with Claude Fable 5 generating ideas, setting fair
> odds, and judging outcomes.

## What's in here

- **Next.js 15 App Router**, TypeScript, Tailwind CSS — fully responsive,
  mobile-first, with a desktop layout that centers the column.
- **Three Fable 5 endpoints** (`app/api/ai/*`):
  - `/api/ai/suggest` — creative bet ideas, mix of serious + goofy
  - `/api/ai/odds` — calibrated probability + American-odds estimates
  - `/api/ai/resolve` — settles a bet from user-provided evidence
- **In-memory store** (`lib/store.ts`) seeded with the bets from the reference
  screens (Trailblazers, Pelicans, Raiders, Beer Challenge, etc.). Swap with
  SQLite/Postgres for production — the function signatures are the contract.
- **Public marketplace** — flip any bet to "public" and others can copy it for
  their own friend group or take a solo position (Draft Kings-style).

## Screens

| Path | What it is |
| ---- | ---------- |
| `/splash` | Splash with logo + "Wanna bet?!" tagline |
| `/` | Home — actions, wallet, current bets feed |
| `/bet/:id` | Bet detail — team toggle, spread editor, Fable 5 fair odds, stake selector, opposing positions, news feed; resolved view shows winners/losers + payout |
| `/bet/new` | Create-bet flow with live Fable 5 idea suggestions |
| `/discover` | Public marketplace ("Find a Sidebet") |
| `/wallet` | Balance, wins, losses |
| `/menu`, `/profile`, `/notifications` | Supporting screens |

## Run it

```bash
cd sidebet
npm install
cp .env.example .env.local   # add your ANTHROPIC_API_KEY
npm run dev
```

Open http://localhost:3000.

## Why Fable 5

Fable 5 is Anthropic's most capable widely released model — adaptive thinking
is always on (no `budget_tokens`/`temperature` to tune), and it's exceptional
at the kind of judgment work this app needs: weighing evidence to resolve a
disputed outcome, calibrating probabilities, and being playful + creative
when generating goofy bet ideas. The integration in `lib/anthropic.ts`
handles refusals gracefully (the safety classifier may decline some prompts)
and falls back to coin-flip odds + a small hand-coded suggestion list when
no API key is set, so the UI never breaks.

See `lib/anthropic.ts` for the wrapper and the inline notes on Fable 5's
breaking changes vs Opus-tier.
