#!/usr/bin/env node
// Pulls every source, merges new events into site/data.json, and exits 0 even
// when a source fails (the failure is recorded in data.json and shown on the
// dashboard) so one bad source never blanks the others.
//
//   SEC_USER_AGENT  required for the SEC sources, e.g. "Jane Doe jane@example.com"
//   UW_API_TOKEN    optional, enables dark-pool and options flow (Unusual Whales)
//   QUOTES_DIR      where per-ticker price files go (default site/quotes)
//   QUOTES_BASE     URL the page loads those files from (default "quotes/")
//   STATE_FILE      fetcher bookkeeping (seen filings, ETF snapshots, backfill progress),
//                   kept out of the published data.json (default .state.json)

import { readFile, writeFile, mkdir, readdir, unlink } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseEdgarFeed, parseForm4, form4Events, schedule13Event, parseArkHoldings, diffHoldings, tickerIndex, fillTickers } from './lib/parse.mjs';
import { parseChart, buildQuote, isMarketHours, buildFundamentals } from './lib/market.mjs';
import { WATCHLIST, parseDailyIndex, acceptanceTime, recentFilings, filingUrls, sectorOf } from './lib/sec.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const DATA = resolve(process.env.DATA_FILE ?? `${HERE}/site/data.json`);
const STATE = resolve(process.env.STATE_FILE ?? `${HERE}/.state.json`);

const CFG = {
  secUserAgent: process.env.SEC_USER_AGENT?.trim(),
  uwToken: process.env.UW_API_TOKEN?.trim(),
  form4Pages: Number(process.env.FORM4_PAGES ?? 6), // 100 feed entries per page
  form4MinValue: Number(process.env.FORM4_MIN_VALUE ?? 100_000), // 10% owners are always kept
  keepDays: Number(process.env.KEEP_DAYS ?? 45),
  flowMinPremium: Number(process.env.FLOW_MIN_PREMIUM ?? 1_000_000),
  quotesDir: resolve(process.env.QUOTES_DIR ?? `${HERE}/site/quotes`),
  quotesBase: process.env.QUOTES_BASE ?? 'quotes/',
  maxQuotes: Number(process.env.MAX_QUOTES ?? 300),
  fundamentalsPerRun: Number(process.env.FUNDAMENTALS_PER_RUN ?? 60),
  backfillDays: Number(process.env.FORM4_BACKFILL_DAYS ?? 14), // calendar days of Form 4s to catch up on
  backfillPerRun: Number(process.env.FORM4_BACKFILL_PER_RUN ?? 300), // filings read per run while catching up
  watchPerRun: Number(process.env.WATCH_PER_RUN ?? 250), // watchlist filings read per run
  profilesPerRun: Number(process.env.PROFILES_PER_RUN ?? 120),
};

const ARK_BASE = 'https://assets.ark-funds.com/fund-documents/funds-etf-csv/';
const ARK_FUNDS = {
  ARKK: 'ARK_INNOVATION_ETF_ARKK_HOLDINGS.csv',
  ARKW: 'ARK_NEXT_GENERATION_INTERNET_ETF_ARKW_HOLDINGS.csv',
  ARKG: 'ARK_GENOMIC_REVOLUTION_ETF_ARKG_HOLDINGS.csv',
  ARKQ: 'ARK_AUTONOMOUS_TECH._&_ROBOTICS_ETF_ARKQ_HOLDINGS.csv',
  ARKF: 'ARK_BLOCKCHAIN_&_FINTECH_INNOVATION_ETF_ARKF_HOLDINGS.csv',
  ARKX: 'ARK_SPACE_&_DEFENSE_INNOVATION_ETF_ARKX_HOLDINGS.csv',
};

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function get(url, { headers = {}, as = 'text' } = {}) {
  for (let attempt = 0; ; attempt++) {
    const res = await fetch(url, { headers, signal: AbortSignal.timeout(30_000) });
    if (res.ok) return as === 'json' ? res.json() : res.text();
    if ((res.status === 429 || res.status >= 500) && attempt < 2) { await sleep(2000 * (attempt + 1)); continue; }
    throw new Error(`${res.status} ${res.statusText} for ${new URL(url).host}${new URL(url).pathname}`);
  }
}

// SEC fair-access policy: declared User-Agent, at most 10 requests/second.
let lastSec = 0;
async function sec(url) {
  const wait = lastSec + 150 - Date.now();
  if (wait > 0) await sleep(wait);
  lastSec = Date.now();
  return get(url, { headers: { 'User-Agent': CFG.secUserAgent, 'Accept-Encoding': 'gzip, deflate' } });
}
const feedUrl = (type, start = 0) =>
  `https://www.sec.gov/cgi-bin/browse-edgar?action=getcurrent&type=${encodeURIComponent(type)}&owner=include&start=${start}&count=100&output=atom`;

// ------------------------------------------------------------------ sources

// One Form 4 submission -> tape events. The SEC header carries the exact
// acceptance time, which is used whichever path found the filing.
async function readForm4(filing) {
  const text = await sec(filing.textUrl);
  const parsed = parseForm4(text);
  const tenPct = parsed?.owners.some((o) => o.tenPct);
  return form4Events({ ...filing, updated: acceptanceTime(text) ?? filing.updated }, parsed, { minValue: tenPct ? 0 : CFG.form4MinValue });
}

const submissionsCache = new Map();
const submissions = (cik) => {
  if (!submissionsCache.has(cik)) submissionsCache.set(cik, sec(`https://data.sec.gov/submissions/CIK${String(cik).padStart(10, '0')}.json`).then(JSON.parse));
  return submissionsCache.get(cik);
};
const nyDate = (d) => d.toLocaleDateString('en-CA', { timeZone: 'America/New_York' }); // YYYY-MM-DD

/**
 * Three ways in, all deduplicated by accession number:
 *  1. the live feed of the newest filings (catches up with the previous run),
 *  2. the watchlist (Magnificent 7 and big chipmakers), read from each company's
 *     own filing history so they are never missed,
 *  3. the SEC's nightly daily index, worked through newest day first, a few
 *     hundred filings per run, to fill the last two weeks and any gaps.
 */
async function form4(state, ctx) {
  const seen = new Set(state.seen ?? []);
  const events = [];
  const counts = { feed: 0, watch: 0, backfill: 0 };
  const read = async (filing, kind) => {
    seen.add(filing.accession);
    counts[kind]++;
    try { events.push(...(await readForm4(filing))); } catch (e) { console.warn(`  form4 ${filing.accession}: ${e.message}`); }
  };

  for (let page = 0; page < CFG.form4Pages; page++) {
    const filings = parseEdgarFeed(await sec(feedUrl('4', page * 100))).filter((f) => /^4(\/A)?$/.test(f.form));
    const fresh = filings.filter((f) => !seen.has(f.accession));
    for (const f of fresh) await read(f, 'feed');
    if (!filings.length || fresh.length === 0) break; // caught up with the last run
  }

  const watchAt = { ...(state.watchAt ?? {}) };
  const since = nyDate(new Date(now - CFG.keepDays * 864e5));
  let watchBudget = CFG.watchPerRun;
  for (const t of WATCHLIST) {
    const cik = ctx.index?.cikOf(t);
    if (!cik || watchBudget <= 0 || now - Date.parse(watchAt[t] ?? 0) < 6 * 36e5) continue;
    try {
      const json = await submissions(cik);
      ctx.profile(t, json);
      const todo = recentFilings(json, ['4', '4/A'], since).filter((f) => !seen.has(f.accession));
      const batch = todo.slice(0, watchBudget);
      for (const f of batch) await read({ accession: f.accession, form: f.form, updated: f.accepted, ...filingUrls(cik, f.accession) }, 'watch');
      watchBudget -= batch.length;
      if (batch.length === todo.length) watchAt[t] = now.toISOString(); // otherwise finish next run
    } catch (e) { console.warn(`  watchlist ${t}: ${e.message}`); }
  }

  const done = new Set(state.backfillDone ?? []);
  const days = [];
  for (let k = 1; k <= CFG.backfillDays; k++) {
    const d = nyDate(new Date(now - k * 864e5));
    const wd = new Date(d + 'T12:00Z').getUTCDay();
    if (wd !== 0 && wd !== 6) days.push(d);
  }
  let budget = CFG.backfillPerRun;
  for (const d of days) {
    if (done.has(d) || budget <= 0) continue;
    const [y, m, dd] = d.split('-');
    const url = `https://www.sec.gov/Archives/edgar/daily-index/${y}/QTR${Math.ceil(Number(m) / 3)}/form.${y}${m}${dd}.idx`;
    let rows;
    try { rows = parseDailyIndex(await sec(url)); } catch (e) {
      if (/^40[34]/.test(e.message)) { done.add(d); continue; } // market holiday, or not published yet
      console.warn(`  backfill ${d}: ${e.message}`); break;
    }
    const todo = new Map();
    for (const r of rows) if ((r.form === '4' || r.form === '4/A') && !seen.has(r.accession) && !todo.has(r.accession)) todo.set(r.accession, r);
    const batch = [...todo.values()].slice(0, budget);
    for (const r of batch) {
      // Fallback time if the header lacks one: 4pm New York on the filing date.
      await read({ accession: r.accession, form: r.form, updated: `${d}T21:00:00Z`, ...filingUrls(r.cik, r.accession) }, 'backfill');
    }
    budget -= batch.length;
    if (batch.length === todo.size) done.add(d);
  }
  const covered = days.filter((d) => done.has(d));
  const pending = days.length - covered.length;
  const fmt = (d) => new Date(d + 'T12:00Z').toLocaleDateString('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' });
  return {
    events,
    state: { seen: [...seen].slice(-40000), watchAt, backfillDone: [...done].filter((d) => days.includes(d)) },
    note: `${counts.feed + counts.watch + counts.backfill} filings read this run. ` +
      (pending ? `Catching up on the last ${CFG.backfillDays} days: ${covered.length} of ${days.length} trading days done.` : `Complete back to ${fmt(days.at(-1))}.`),
  };
}

async function sched13(state) {
  const seen = new Set(state.seen ?? []);
  const events = [];
  // "SCHEDULE 13D/13G" are the form names since Dec 2024; "SC 13" covers stragglers.
  for (const type of ['SCHEDULE 13', 'SC 13']) {
    const filings = parseEdgarFeed(await sec(feedUrl(type))).filter((f) => /13[DG]/i.test(f.form));
    for (const f of filings) {
      if (seen.has(f.accession)) continue;
      seen.add(f.accession);
      let text = '';
      try { text = await sec(f.textUrl); } catch (e) { console.warn(`  13D/G ${f.accession}: ${e.message}`); }
      const ev = schedule13Event(f, text);
      if (ev) events.push(ev);
    }
  }
  return { events, state: { seen: [...seen].slice(-3000) }, note: `${events.length} new filings` };
}

async function etf(state) {
  const snapshots = { ...(state.snapshots ?? {}) };
  const events = [];
  const failed = [];
  let asOf = null;
  for (const [fund, file] of Object.entries(ARK_FUNDS)) {
    try {
      const next = parseArkHoldings(await get(ARK_BASE + encodeURIComponent(file)));
      if (!next.date || !next.positions.length) throw new Error('empty holdings file');
      // ARK leaves old files in place when it renames a fund, so a stale date means a dead URL.
      if (Date.now() - Date.parse(next.date) > 10 * 864e5) throw new Error(`file stopped updating on ${next.date}`);
      events.push(...diffHoldings(snapshots[fund], next));
      snapshots[fund] = next;
      asOf = next.date > (asOf ?? '') ? next.date : asOf;
    } catch (e) {
      failed.push(`${fund} (${e.message})`);
    }
  }
  if (failed.length === Object.keys(ARK_FUNDS).length) throw new Error(failed.join('; '));
  const firstRun = !state.snapshots;
  return {
    events,
    state: { snapshots },
    note: (firstRun ? `Baseline holdings saved for ${asOf}; trades appear once the next daily file is published` : `Holdings as of ${asOf}`) +
      (failed.length ? `. Unavailable: ${failed.join('; ')}` : ''),
  };
}

// Optional paid source. Field names follow Unusual Whales' public API docs;
// this adapter has not been run against a live key, so mapping is defensive.
async function flow() {
  const headers = { Authorization: `Bearer ${CFG.uwToken}`, Accept: 'application/json' };
  const base = 'https://api.unusualwhales.com/api';
  const events = [];
  const dp = await get(`${base}/darkpool/recent?limit=200`, { headers, as: 'json' });
  for (const t of dp.data ?? []) {
    const value = Number(t.premium ?? t.size * t.price);
    if (!(value >= CFG.flowMinPremium)) continue;
    events.push({
      id: `dp:${t.tracking_id ?? `${t.ticker}:${t.executed_at}:${t.size}`}`,
      source: 'darkpool', time: t.executed_at, ticker: t.ticker, company: '', actor: 'Off-exchange print',
      action: 'block', shares: Number(t.size), price: Number(t.price), value,
      tags: [t.market_center ? `Venue ${t.market_center}` : 'Dark pool'], detail: '', url: `https://unusualwhales.com/stock/${t.ticker}`,
    });
  }
  const opt = await get(`${base}/option-trades/flow-alerts?limit=200&min_premium=${CFG.flowMinPremium}`, { headers, as: 'json' });
  for (const a of opt.data ?? []) {
    const call = /^c/i.test(a.type ?? '');
    events.push({
      id: `opt:${a.id ?? `${a.option_chain}:${a.created_at}`}`,
      source: 'options', time: a.created_at, ticker: a.ticker, company: '', actor: 'Options flow',
      action: call ? 'call' : 'put', shares: Number(a.volume ?? a.total_size) || null, price: null, value: Number(a.total_premium),
      tags: [`${a.strike}${call ? 'C' : 'P'} ${a.expiry}`, a.has_sweep ? 'Sweep' : 'Block'].filter(Boolean),
      detail: a.open_interest ? `Open interest ${Number(a.open_interest).toLocaleString('en-US')}` : '',
      url: `https://unusualwhales.com/stock/${a.ticker}`,
    });
  }
  return { events, state: {}, note: `${events.length} prints of $${(CFG.flowMinPremium / 1e6).toFixed(1)}M or more` };
}

// ------------------------------------------------- stock drawer price files

const YAHOO = 'https://query1.finance.yahoo.com/v8/finance/chart/';
const yahooChart = async (ticker, range, interval) =>
  parseChart(await get(`${YAHOO}${encodeURIComponent(ticker.replace('.', '-'))}?range=${range}&interval=${interval}&includePrePost=false`,
    { headers: { 'User-Agent': 'Mozilla/5.0', Accept: 'application/json' }, as: 'json' }));

const SEC_CONCEPT = (cik, tax, tag) => `https://data.sec.gov/api/xbrl/companyconcept/CIK${cik.padStart(10, '0')}/${tax}/${tag}.json`;
async function secConcept(cik, tax, tag) {
  try { return JSON.parse(await sec(SEC_CONCEPT(cik, tax, tag))); } catch (e) {
    if (/^404/.test(e.message)) return null; // company never used this tag
    throw e;
  }
}
async function fundamentals(cik) {
  const revenue = [];
  for (const tag of ['RevenueFromContractWithCustomerExcludingAssessedTax', 'Revenues', 'SalesRevenueNet']) {
    const c = await secConcept(cik, 'us-gaap', tag);
    if (c) revenue.push(c);
  }
  const netIncome = await secConcept(cik, 'us-gaap', 'NetIncomeLoss');
  const eps = (await secConcept(cik, 'us-gaap', 'EarningsPerShareDiluted')) ?? (await secConcept(cik, 'us-gaap', 'EarningsPerShareBasic'));
  const shares = await secConcept(cik, 'dei', 'EntityCommonStockSharesOutstanding');
  const dilutedShares = shares ? null : await secConcept(cik, 'us-gaap', 'WeightedAverageNumberOfDilutedSharesOutstanding');
  return buildFundamentals({ revenue, netIncome, eps, shares, dilutedShares }, cik);
}

async function pool(items, size, fn) {
  let i = 0;
  await Promise.all(Array.from({ length: Math.min(size, items.length) }, async () => { while (i < items.length) await fn(items[i++]); }));
}

/**
 * One JSON file per ticker on the tape: intraday (1m), five-day (15m) and
 * five-year daily closes from Yahoo, plus quarterly results from SEC XBRL.
 * Outside market hours intraday data is only refreshed every few hours, the
 * daily series twice a day, and fundamentals every few days.
 */
async function quotes(events, index) {
  await mkdir(CFG.quotesDir, { recursive: true });
  // The watchlist is always charted, even with no events; then the tape's tickers, newest first.
  const onTape = [...new Set(events.map((e) => e.ticker).filter((t) => t && /^[A-Z][A-Z0-9.\-]{0,9}$/.test(t) && !WATCHLIST.includes(t)))];
  const tickers = [...WATCHLIST, ...onTape.slice(0, CFG.maxQuotes)];
  const open = isMarketHours(now);
  const age = (iso) => (iso ? now - Date.parse(iso) : Infinity);
  let ok = 0, failed = 0, fundBudget = CFG.fundamentalsPerRun;
  const failures = [];
  await pool(tickers, 3, async (t) => {
    const file = `${CFG.quotesDir}/${t}.json`;
    const prev = await readFile(file, 'utf8').then(JSON.parse).catch(() => null);
    try {
      const fresh = open || age(prev?.fetchedAt) > 3 * 36e5;
      const intraday = fresh ? await yahooChart(t, '1d', '1m') : null;
      const fiveDay = fresh ? await yahooChart(t, '5d', '15m') : null;
      const daily = !prev?.daily?.length || age(prev.dailyAt) > 12 * 36e5 ? await yahooChart(t, '5y', '1d') : null;
      const q = buildQuote({ intraday, fiveDay, daily }, prev, now);
      const cik = index?.cikOf(t);
      if (cik && fundBudget > 0 && age(q.fundamentals?.fetchedAt) > 3 * 864e5) {
        fundBudget--;
        try {
          const f = await fundamentals(cik);
          q.fundamentals = f ? { ...f, fetchedAt: now.toISOString() } : { cik, quarters: [], fetchedAt: now.toISOString() };
        } catch (e) { console.warn(`  fundamentals ${t}: ${e.message}`); }
      }
      await writeFile(file, JSON.stringify(q));
      ok++;
    } catch (e) {
      failed++;
      if (failures.length < 5) failures.push(`${t} (${e.message})`);
    }
  });
  // Drop files for tickers that have scrolled off the tape.
  const keep = new Set(tickers.map((t) => `${t}.json`));
  for (const f of await readdir(CFG.quotesDir)) if (f.endsWith('.json') && !keep.has(f)) await unlink(`${CFG.quotesDir}/${f}`);
  if (tickers.length && !ok) throw new Error(`every ticker failed, e.g. ${failures.join('; ')}`);
  return `${ok} of ${tickers.length} tickers updated${failed ? `; failed: ${failures.join('; ')}` : ''}`;
}

const SOURCES = [
  { key: 'etf', run: etf },
  { key: 'form4', run: form4, needs: () => (CFG.secUserAgent ? null : 'Set the SEC_USER_AGENT repository variable (a name and contact email) to turn this on.') },
  { key: 'sched13', run: sched13, needs: () => (CFG.secUserAgent ? null : 'Set the SEC_USER_AGENT repository variable (a name and contact email) to turn this on.') },
  { key: 'flow', run: flow, needs: () => (CFG.uwToken ? null : 'Needs a paid data feed. Add an Unusual Whales API key as the UW_API_TOKEN repository secret to turn this on.') },
];

// --------------------------------------------------------------------- main

const prev = await readFile(DATA, 'utf8').then(JSON.parse).catch(() => ({}));
// Older data.json files carried the bookkeeping inline; use it once if there is no state file yet.
const state = await readFile(STATE, 'utf8').then(JSON.parse).catch(() => prev.state ?? {});
const now = new Date();
const data = { updatedAt: now.toISOString(), sources: {}, events: prev.events ?? [] };
const ids = new Set(data.events.map((e) => e.id));

// The SEC's CIK-to-ticker list: fills missing tickers, finds the watchlist's
// filings and each company's industry code.
let index = null;
if (CFG.secUserAgent) {
  try { index = tickerIndex(JSON.parse(await sec('https://www.sec.gov/files/company_tickers.json'))); } catch (e) {
    console.warn(`tickers: lookup unavailable (${e.message})`);
  }
}
const profilesState = { ...(state.profiles ?? {}) };
const ctx = {
  index,
  profile(t, json) { profilesState[t] = { sic: json.sic ?? null, industry: json.sicDescription ?? null, at: now.toISOString() }; },
};

for (const { key, run, needs } of SOURCES) {
  const was = prev.sources?.[key] ?? {};
  const missing = needs?.();
  if (missing) {
    data.sources[key] = { status: 'off', note: missing };
    console.log(`${key}: off`);
    continue;
  }
  try {
    const r = await run(state[key] ?? {}, ctx);
    state[key] = r.state;
    let added = 0;
    for (const e of r.events) if (!ids.has(e.id)) { ids.add(e.id); data.events.push(e); added++; }
    data.sources[key] = { status: 'ok', note: r.note, lastSuccess: now.toISOString() };
    console.log(`${key}: ok, ${added} new events (${r.note})`);
  } catch (e) {
    data.sources[key] = { status: 'error', note: e.message, lastSuccess: was.lastSuccess ?? null };
    console.error(`${key}: FAILED ${e.message}`);
  }
}

// 13D/13G filings name the company but not its ticker, and some Form 4s carry
// "NONE". Fill both from the SEC's CIK-to-ticker list (also backfills old rows).
if (index) console.log(`tickers: filled ${fillTickers(data.events, index)} from ${index.size} companies`);

const cutoff = now.getTime() - CFG.keepDays * 864e5;
data.events = data.events
  .filter((e) => !(Date.parse(e.time) < cutoff))
  .sort((a, b) => Date.parse(b.time) - Date.parse(a.time));

data.quotesBase = CFG.quotesBase;
try {
  const note = await quotes(data.events, index);
  data.sources.quotes = { status: 'ok', note, lastSuccess: now.toISOString() };
  console.log(`quotes: ${note}`);
} catch (e) {
  data.sources.quotes = { status: 'error', note: e.message, lastSuccess: prev.sources?.quotes?.lastSuccess ?? null };
  console.error(`quotes: FAILED ${e.message}`);
}

// Sector for every ticker on the tape plus the watchlist, from its SEC industry code.
const tracked = [...new Set([...data.events.map((e) => e.ticker).filter(Boolean), ...WATCHLIST])];
if (index) {
  let budget = CFG.profilesPerRun;
  for (const t of tracked) {
    const cik = index.cikOf(t);
    const had = profilesState[t];
    if (!cik || budget <= 0 || (had && now - Date.parse(had.at) < 30 * 864e5)) continue;
    budget--;
    try { ctx.profile(t, await submissions(cik)); } catch (e) { console.warn(`  profile ${t}: ${e.message}`); }
  }
}
state.profiles = Object.fromEntries(Object.entries(profilesState).filter(([t]) => tracked.includes(t)));
data.profiles = Object.fromEntries(tracked.map((t) => {
  const p = state.profiles[t];
  const sector = sectorOf(p?.sic, t);
  return sector ? [t, { sector, industry: p?.industry ?? null }] : null;
}).filter(Boolean));
console.log(`profiles: ${Object.keys(data.profiles).length} of ${tracked.length} tickers have a sector`);

await mkdir(dirname(DATA), { recursive: true });
await mkdir(dirname(STATE), { recursive: true });
await writeFile(STATE, JSON.stringify(state));
await writeFile(DATA, JSON.stringify(data));
console.log(`Wrote ${data.events.length} events to ${DATA}`);
