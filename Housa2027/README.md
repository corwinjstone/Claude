# Housa 2027: clickable prototype

A working prototype of **Housa**, a marketplace where Dallas–Fort Worth home sellers post their home privately and licensed agents compete to list it. It covers phase 1 only: sellers in DFW. There is no buyer side, no MLS data and no sponsorships. All data is made up.

Source of truth: the Housa PRD (*Housa — Product Requirements & Exit Strategy*), especially "Strategic pivots" and Functional requirements modules 1–9 and 13.

## Run it locally

You need Node.js 20 or newer.

```bash
cd Housa2027
npm install
npm run dev
```

Open http://localhost:3000. The Housa logo always leads back to the home page.

For a production build: `npm run build && npm start`.

## Run it in the browser (GitHub Pages)

Live at **https://corwinjstone.github.io/Claude/housa2027/** once this folder is on `main`.

`.github/workflows/deploy-housa2027.yml` builds a static version (`npm run build:pages`) on every push to `main` that touches `Housa2027/`, and publishes it to the `housa2027/` folder of the `gh-pages` branch. You can also run it by hand from the Actions tab.

The static version has no server, so it differs in one way: address suggestions come from OpenStreetMap plus the sample addresses, never Google. A Google key in a static site would be public. Everything else runs the same in the browser, using the same code.

To try the static build locally:

```bash
npm run build:pages   # writes ./out with base path /Claude/housa2027
```

### Optional: Google address suggestions

Address suggestions work without any key. With no key, the app uses OpenStreetMap (Photon) plus the 40 sample DFW addresses. To use Google Places Autocomplete instead:

1. In Google Cloud, enable **Places API (New)** and create an API key. Restrict it to that API.
2. Copy `.env.example` to `.env.local` and set `GOOGLE_MAPS_API_KEY=...`.
3. Restart `npm run dev`.

The key is read only on the server (`src/lib/places.ts`) and is never sent to the browser. `.env.local` is git-ignored.

## Screens

| # | Screen | Route | Status |
|---|--------|-------|--------|
| — | Home page (from the "Housa - Splashpage" Figma frame); the Housa logo leads here | `/` | ✅ Built |
| 1 | Home Equity Calculator (public, no login) | `/calculator` | ✅ Built |
| 1B | Home Equity Calculator, design B (for comparison) | `/v2` | ✅ Built |
| 2 | Seller request, address hidden | `/sell` | Placeholder |
| 3 | Agent console: feed, attribution gate, bid form | `/agent` | Placeholder |
| 4 | Seller bid comparison | `/seller/bids` | Placeholder |
| 5 | Accept bid, reveal address, mock e-signing | — | Not started |
| 6 | Agent closing intake and title packet | — | Not started |
| 7 | Report a problem, release notice, milestones | — | Not started |
| 8 | Admin: view logs and fee status | `/admin` | Placeholder |

### Home page

Built from the Figma frame "Housa - Splashpage": hero with the phone photo, three numbered steps (a live mini calculator, agents bidding, choosing an agent), and a footer with links to every prototype page. Photos are compressed to WebP in `public/brand/splash/`. The sample numbers use the same rules as the calculators, so the $995 Platform Technology & Transaction Coordination Fee and about 1% closing costs are included.

### Screen 1: try it

- Type an address (try "post oak" or "prairie"), or tap a sample home.
- The big number first: "If you sold for about $X, you could keep about $Y."
- Three fee levels side by side: the traditional 6%, a typical Housa bid (the median of the sample full-service bids, plus the $995 fee), and your own fee (percent or flat).
- Sliders for sale price, mortgage payoff, your own fee and the buyer's agent offer. "Show the math" lists every cost line.
- Every ⓘ button opens a plain-language "What does this mean?" tip.
- "Email me a monthly update" saves the home in the browser (no email is sent). "Get offers from local agents" carries the numbers to screen 2 through `sessionStorage`, so the address never goes in the URL.

## Brand

The look comes from the **"Housa - Splash Blue"** Figma file (frame "My listings"). Everything lives in `src/theme/` and `scripts/generate-theme.mjs`, so a change there re-skins both calculators.

| Brand piece | From the Figma file | Where it is used |
|---|---|---|
| Splash blue `#005FF2` | page background, buttons | page, "Get offers" button, "full equity" bar |
| Navy panels `#001330` | black at 80% over the blue | cards, dialogs, footer |
| Field fill `#293951` | white at 16% over a panel | inputs, value boxes, chart tracks |
| Lime `#85FF00` | active state, good news | cash at close, savings, links, focus ring, page-level buttons |
| Red | `#D0021B` (destructive) | traditional-fee tint; text uses a lighter red to pass contrast |
| Avenir | Heavy for labels and numbers, Book for sentences | all text |
| Shapes | 5px panels, 10px fields, 7px buttons | theme shape and component overrides |
| Slider | yellow, lime, green, red rail with a white thumb | every slider |
| Logo | the H mark over the "housa" wordmark | `src/components/Logo.tsx`, `public/brand/` |

- **Two looks:** the brand look (blue page, navy panels) is the default. The sun/moon button switches to a lighter daytime variant made from the same blue.
- **Avenir:** it is licensed and comes with Apple devices. Everyone else gets the closest free match, Nunito Sans, from Google Fonts (see `src/app/layout.tsx`). To self-host Avenir, add the font files and point `FONT` in `theme.ts` at them.
- **Contrast:** lime on blue is only 4.2:1, so it is never used for small text on the blue page; the active nav item uses a lime underline instead. All text still passes WCAG 2.2 AA.
- **Regenerate colors:** edit `BRAND` in `scripts/generate-theme.mjs`, then run `npm run theme`.

## Stack

- **Next.js 15** (App Router, server rendering) with TypeScript
- **MUI 7**, themed with **Material Design 3** tokens generated from the Housa brand-blue seed (`npm run theme`)
- **Dummy data** as JSON in `/data`, made by a seeded generator (`npm run seed`)
- Light and dark themes follow the device setting; there is also a toggle in the top bar.

## Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Start the dev server |
| `npm run build` / `npm start` | Production build and serve |
| `npm run build:pages` | Static build for GitHub Pages (`./out`) |
| `npm run typecheck` | TypeScript check |
| `npm run seed` | Regenerate `/data/*.json` (deterministic) |
| `npm run theme` | Regenerate M3 color tokens from the seed color |

## Rules this prototype follows

- Plain language at a high-school reading level, with dollar amounts instead of jargon.
- WCAG 2.2 AA: M3 color roles for contrast, touch targets of 48px or more, rem-based type that follows browser font size, labels on every control, a skip link and visible focus. Screen 1 passes an axe-core WCAG 2.2 AA scan in light and dark, on phone and desktop.
- The $995 fee is always the **Platform Technology & Transaction Coordination Fee**: flat, paid by the seller at closing, and never a percentage.
- Housa never sets or recommends fees. "Typical" figures are medians of past bids.

See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) for the folder structure and data model.
