# Newsstand — Editorial Layout Studio

A single-page tool that turns a plain manuscript into a fully paginated,
editorial magazine spread — bold newsstand typography, drop caps, pull
quotes, folios, chart recommendations — in the style of a glossy feature
well. No AI calls; a deterministic content-analysis engine reads the
manuscript's structure and casts it into a layout.

## What it does

- **Paste or upload a manuscript** (`.txt`/`.md`). The parser reads the
  first line as the headline, `By Name` as the byline, a short one-line
  paragraph as the dek, `## Heading` for section breaks, `> quote` to force
  a pull quote, `- item` lists for countdowns, and `Speaker: line` for
  interviews.
- **Automatic template selection** — the engine detects dialogue (→ Q&A
  spread), lists (→ ranked countdown), short word counts (→ capsule
  review), or defaults to a longform feature well with a drop-cap opener.
- **Pull-quote recommendations** — sentences are scored for punch (length,
  quotation marks, vivid language) and offered as toggleable pull quotes
  that get set in oversized editorial type, both inline and as full quote
  spreads.
- **Chart & data recommendations** — numeric statements in the copy are
  detected and offered as either a trend bar chart (3+ numbers in one
  sentence) or oversized stat-card callouts.
- **Folios everywhere** — every page carries a running masthead and a
  footer folio (publication name, section, page N / total).
- **Theme system** — a CSS Zen Garden-style theme layer: the same
  manuscript and layout logic gets completely reskinned by swapping CSS
  custom-property tokens. Four presets ship (Gonzo, Atelier, Circuit,
  Ledger); the built-in theme builder lets you design and save your own
  palette/type system.
- **Print / export** — the "Print / Export PDF" button uses the browser's
  native print pipeline with dedicated print CSS (one magazine page per
  printed page).

## Running it

```bash
npm install
npm run dev
```

Open the printed local URL. A sample feature and a sample interview
manuscript are one click away in the Manuscript tab.

## Architecture

- `src/lib/manuscriptParser.js` — heuristic parser: raw text → structured
  document (headline/dek/byline/blocks/flags).
- `src/lib/quoteExtractor.js` — scores and ranks pull-quote candidates.
- `src/lib/chartRecommender.js` — detects numeric statements, recommends a
  bar chart or stat cards.
- `src/lib/layoutEngine.js` — picks a template and paginates the parsed
  document into page objects.
- `src/lib/themes.js` — theme registry + custom-theme CSS variable
  builder.
- `src/styles/magazine.css` — structural print-page styling, entirely
  driven by theme CSS variables.
- `src/styles/themes.css` — the four preset theme token sheets.
- `src/components/` — the tool chrome (manuscript input, theme switcher,
  custom theme builder, recommendations panel) and `pages/` (the actual
  magazine page templates: cover, article, quote spread, chart, countdown,
  end).
