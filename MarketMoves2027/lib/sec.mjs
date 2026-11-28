// Pure helpers for SEC backfill and company profiles.

export const MAG7 = ['AAPL', 'MSFT', 'GOOGL', 'GOOG', 'AMZN', 'META', 'NVDA', 'TSLA'];
// Large US-listed chipmakers and chip-equipment makers whose insiders file Form 4.
export const SEMIS = ['NVDA', 'AVGO', 'AMD', 'INTC', 'QCOM', 'MU', 'TXN', 'ADI', 'MRVL', 'AMAT', 'LRCX', 'KLAC', 'NXPI', 'MCHP', 'ON', 'MPWR', 'TER', 'SMCI'];
export const WATCHLIST = [...new Set([...MAG7, ...SEMIS])];

/**
 * EDGAR daily form index (form.YYYYMMDD.idx) -> [{ form, name, cik, date, accession, path }].
 * Fixed-width text; columns are separated by two or more spaces.
 */
export function parseDailyIndex(text) {
  const out = [];
  let body = false;
  for (const line of String(text).split(/\r?\n/)) {
    if (!body) { if (/^-{20,}/.test(line)) body = true; continue; }
    const m = /^(\S+(?: \S+)*?)\s{2,}(.+?)\s{2,}(\d+)\s+(\d{8})\s+(edgar\/data\/\S+\.txt)\s*$/.exec(line);
    if (!m) continue;
    out.push({ form: m[1], name: m[2].trim(), cik: m[3], date: m[4], path: m[5], accession: m[5].split('/').pop().replace(/\.txt$/, '') });
  }
  return out;
}

/** Wall-clock New York time -> ISO string with the right offset (EST or EDT). */
export function nyToIso(y, mo, d, h = 0, mi = 0, s = 0) {
  for (const off of [-4, -5]) {
    const t = Date.UTC(y, mo - 1, d, h - off, mi, s);
    const p = Object.fromEntries(new Intl.DateTimeFormat('en-US', { timeZone: 'America/New_York', hourCycle: 'h23', year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric' })
      .formatToParts(new Date(t)).map((x) => [x.type, Number(x.value)]));
    if (p.hour === h && p.day === d) return new Date(t).toISOString().replace('.000Z', 'Z');
  }
  return new Date(Date.UTC(y, mo - 1, d, h + 5, mi, s)).toISOString();
}

/** <ACCEPTANCE-DATETIME>20261125163018 in a submission's SEC header -> ISO time. */
export function acceptanceTime(text) {
  const m = /<ACCEPTANCE-DATETIME>\s*(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/.exec(String(text).slice(0, 4000));
  return m ? nyToIso(...m.slice(1).map(Number)) : null;
}

/** data.sec.gov/submissions JSON -> recent filings of the given forms filed on or after `since` (YYYY-MM-DD). */
export function recentFilings(json, forms, since) {
  const r = json?.filings?.recent ?? {};
  const out = [];
  (r.accessionNumber ?? []).forEach((acc, i) => {
    if (!forms.includes(r.form[i]) || r.filingDate[i] < since) return;
    out.push({ accession: acc, form: r.form[i], date: r.filingDate[i], accepted: r.acceptanceDateTime?.[i] ?? null });
  });
  return out;
}

/** A filing's EDGAR URLs, from the CIK it is filed under and its accession number. */
export function filingUrls(cik, accession) {
  const base = `https://www.sec.gov/Archives/edgar/data/${Number(cik)}/${accession.replace(/-/g, '')}/${accession}`;
  return { indexUrl: `${base}-index.htm`, textUrl: `${base}.txt` };
}

// SEC Standard Industrial Classification -> broad sector. Semiconductors are split out of
// technology; a few chip-equipment makers carry machinery or instrument codes, so they are named.
const SEMI_TICKERS = new Set([...SEMIS, 'ASML', 'TSM', 'ARM', 'ENTG', 'ONTO', 'ACMR', 'AMKR', 'COHU', 'FORM', 'CAMT', 'UCTT', 'ICHR', 'AEHR', 'WOLF', 'SITM', 'POWI', 'SLAB', 'SWKS', 'QRVO', 'LSCC', 'CRUS', 'SYNA', 'RMBS', 'ALGM', 'MTSI', 'NVMI', 'AMBA', 'INDI', 'NVTS', 'GFS']);
const SIC_RANGES = [
  [[3674, 3674], 'Semiconductors'],
  [[6770, 6770], 'SPACs and shells'],
  [[6500, 6553], 'Real estate'], [[6798, 6798], 'Real estate'],
  [[6000, 6799], 'Financials'],
  [[2830, 2836], 'Health care'], [[3840, 3851], 'Health care'], [[8000, 8099], 'Health care'], [[8731, 8731], 'Health care'], [[5047, 5047], 'Health care'], [[5122, 5122], 'Health care'],
  [[3570, 3579], 'Technology'], [[3600, 3699], 'Technology'], [[7370, 7379], 'Technology'], [[3820, 3829], 'Technology'], [[3812, 3812], 'Industrials'],
  [[4800, 4899], 'Communication services'], [[2700, 2799], 'Communication services'], [[7810, 7829], 'Communication services'],
  [[4900, 4999], 'Utilities'],
  [[1300, 1399], 'Energy'], [[2900, 2999], 'Energy'], [[4610, 4619], 'Energy'], [[5171, 5172], 'Energy'],
  [[1000, 1499], 'Materials'], [[2600, 2699], 'Materials'], [[2800, 2829], 'Materials'], [[2840, 2899], 'Materials'], [[3200, 3399], 'Materials'],
  [[2000, 2199], 'Consumer staples'], [[5400, 5499], 'Consumer staples'], [[5140, 5149], 'Consumer staples'], [[5912, 5912], 'Consumer staples'],
  [[3711, 3716], 'Consumer discretionary'], [[2200, 2399], 'Consumer discretionary'], [[2500, 2599], 'Consumer discretionary'], [[3630, 3639], 'Consumer discretionary'], [[3940, 3949], 'Consumer discretionary'],
  [[5000, 5999], 'Consumer discretionary'], [[7000, 7099], 'Consumer discretionary'], [[7900, 7999], 'Consumer discretionary'], [[8200, 8299], 'Consumer discretionary'],
  [[1500, 1799], 'Industrials'], [[3400, 3569], 'Industrials'], [[3580, 3599], 'Industrials'], [[3700, 3799], 'Industrials'], [[4000, 4799], 'Industrials'], [[7380, 7389], 'Industrials'], [[8700, 8799], 'Industrials'],
];
export function sectorOf(sic, ticker) {
  if (SEMI_TICKERS.has(ticker)) return 'Semiconductors';
  const n = Number(sic);
  if (!n) return null;
  return SIC_RANGES.find(([[a, b]]) => n >= a && n <= b)?.[1] ?? 'Other';
}
