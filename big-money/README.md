# Big Money Tracker

A static dashboard of institutional buying and selling, built from the fastest
public disclosures. A scheduled GitHub Action runs `fetch.mjs`, which merges new
events into `data.json`, and publishes the page to GitHub Pages at `/big-money/`.

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

The workflow (`.github/workflows/big-money-tracker.yml`) runs every 30 minutes
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

## Known gaps

- The SEC and Unusual Whales fetchers were written against the documented
  formats and unit-tested on fixtures, but have not been run against the live
  services yet. Check the first workflow run's log.
- ARKW's holdings file URL stopped updating in Oct 2026 (ARK renames files when
  funds are renamed). Update `ARK_FUNDS` in `fetch.mjs` with the new file name.
- Only ARK is wired up for active ETFs. Other issuers (JPMorgan, Avantis,
  Dimensional) publish in their own formats and each needs a small parser.
- The page is a 30-minute snapshot, not a streaming feed, so the flow panel is
  minutes behind even with a paid key.
