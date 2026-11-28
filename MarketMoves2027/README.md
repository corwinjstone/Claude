# Market Moves 2027

A static dashboard of institutional buying and selling, built from the fastest
public disclosures. A scheduled GitHub Action runs `fetch.mjs`, which merges new
events into `data.json`, and publishes the page to GitHub Pages at `/marketmoves2027/`.

| Source | Delay | Names the fund? | Where it comes from | Status |
|---|---|---|---|---|
| Active ETF trades | Same day, after close | Yes | ARK daily holdings CSVs, diffed day over day | Works out of the box |
| Form 4 (insiders, 10% owners) | 2 business days | Yes | SEC EDGAR current-filings feed + each filing's XML | Needs `SEC_USER_AGENT` |
| Schedule 13D / 13G | 5 to 10 days | Yes | SEC EDGAR current-filings feed | Needs `SEC_USER_AGENT` |
| Dark pool and options flow | Minutes | No | Unusual Whales API (paid) | Needs `UW_API_TOKEN` |

## Setup

In the GitHub repo, under Settings > Secrets and variables > Actions:

1. **Variable `SEC_USER_AGENT`** (required for both SEC sources): a name and
   contact email, e.g. `Jane Doe jane@example.com`. The SEC rejects automated
   requests that do not declare one.
2. **Secret `UW_API_TOKEN`** (optional): an Unusual Whales API key, to turn on
   dark-pool prints and options flow alerts of $1M+ premium.

The workflow (`.github/workflows/deploy-marketmoves2027.yml`) runs every 15 minutes
on weekdays once it is on `main`, and can be started by hand from the Actions tab.

## Run locally

```sh
SEC_USER_AGENT="Your Name you@example.com" npm run fetch   # writes site/data.json
npm run serve                                              # http://localhost:8080
npm test
```

## How to read it

- **ETF trades** are inferred by comparing today's holdings file with the last
  one. Investor creations and redemptions scale every position by the same
  ratio, so the median ratio is treated as fund flow and only moves that depart
  from it by more than 0.5% are reported as trades. Dollar values use the
  closing price implied by the holdings file.
- **Form 4** rows are open-market purchases (code P) and sales (code S) only.
  Grants, option exercises and tax withholding are dropped. Filings from 10%
  owners are always kept; others need $100k+ (`FORM4_MIN_VALUE`).
- **13D / 13G** rows show who filed on which company. Stake size is read from
  the filing's structured data when present and is blank otherwise.
- Until real events exist the page shows clearly labelled sample rows.

## Coverage, watchlist and sectors

Form 4 filings arrive three ways, deduplicated by accession number:

1. **Live feed**: the newest filings since the previous run.
2. **Watchlist**: the Magnificent 7 (AAPL, MSFT, GOOGL/GOOG, AMZN, META,
   NVDA, TSLA) and large chipmakers (AVGO, AMD, INTC, QCOM, MU, TXN, ADI,
   MRVL, AMAT, LRCX, KLAC, NXPI, MCHP, ON, MPWR, TER, SMCI). Their insider
   filings for the last 45 days are read from each company's SEC filing
   history, so they are never missed. They always have price files for the
   drawer, with or without events. Edit `WATCHLIST` in `lib/sec.mjs`.
3. **Daily-index backfill**: the SEC's nightly list of every filing, worked
   through newest day first (`FORM4_BACKFILL_DAYS`, default 14), 300 filings
   per run. This fills the first two weeks and any gap from missed runs. The
   Form 4 card on the dashboard shows progress.

Sectors come from each company's SEC industry code (SIC), grouped into broad
sectors with **Semiconductors** split out of technology. A few chip-equipment
makers with machinery codes are named explicitly. The page's **Group** filter
picks the Magnificent 7; **Sector** lists the sectors on the tape with counts.

Fetcher bookkeeping (filings already read, ETF snapshots, backfill progress,
industry codes) is kept in `state.json` on the data branch, not in the
published `data.json`.

## Stock drawer

Click any ticker (in the chart or the tape) to open a 600px panel from the
right. The page behind it stays usable, `Esc` or × closes it, and the URL
(`#stock-AAPL`) links straight to it.

- **Price chart** with 1H, 1D, 5D, 1M, 6M, YTD, 1Y and 5Y views and a hover
  readout. Prices come from Yahoo Finance's chart data, fetched by the workflow
  (1-minute bars for the day, 15-minute for five days, daily for five years).
- **Key statistics**: previous close, open, day and 52-week range, volume,
  market cap, P/E (TTM), EPS (TTM), revenue (TTM), net margin and shares out.
- **Earnings**: the last eight quarters of revenue, year-over-year growth, net
  income and diluted EPS from the company's SEC XBRL filings. Q4 is the annual
  figure minus Q1 to Q3 when the company doesn't report it separately. P/E is
  price over the sum of the last four quarters' diluted EPS.
- **Big money in this stock**: every tape event for the ticker.

Price files are one JSON per ticker on the `marketmoves2027-data` branch. The
workflow replaces that branch on every run, so it carries no history. The page
loads them from `raw.githubusercontent.com`. During market hours intraday data
refreshes every run; daily history refreshes twice a day and SEC financials
every three days (up to 60 tickers per run).

## Known gaps

- The Unusual Whales fetcher was written against the documented format and
  has not been run against the live service.
- The SEC financials fetcher (`data.sec.gov`) is unit-tested on fixtures but
  has not run against live filings yet. Check the workflow log for
  `fundamentals` warnings after the first run.
- ARKW's holdings file URL stopped updating in Oct 2026 (ARK renames files when
  funds are renamed). Update `ARK_FUNDS` in `fetch.mjs` with the new file name.
- Only ARK is wired up for active ETFs. Other issuers (JPMorgan, Avantis,
  Dimensional) publish in their own formats and each needs a small parser.
- The page is a 15-minute snapshot, not a streaming feed, so the flow panel and
  the drawer's 1H chart are up to 15 minutes behind.
- Yahoo's chart data is an unofficial, undocumented endpoint. It is free and
  needs no key, but Yahoo can change or rate-limit it without notice. Forward
  P/E, analyst targets and the next earnings date need Yahoo's logged-in API,
  so they are not shown.
- Financials only exist for US companies that file XBRL with the SEC. Funds,
  foreign listings and private companies show prices only, or nothing.
