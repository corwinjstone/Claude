#!/usr/bin/env node
// Pulls every source, merges new events into site/data.json, and exits 0 even
// when a source fails (the failure is recorded in data.json and shown on the
// dashboard) so one bad source never blanks the others.
//
//   SEC_USER_AGENT  required for the SEC sources, e.g. "Jane Doe jane@example.com"
//   UW_API_TOKEN    optional, enables dark-pool and options flow (Unusual Whales)

import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseEdgarFeed, parseForm4, form4Events, schedule13Event, parseArkHoldings, diffHoldings, tickerIndex, fillTickers } from './lib/parse.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const DATA = resolve(process.env.DATA_FILE ?? `${HERE}/site/data.json`);

const CFG = {
  secUserAgent: process.env.SEC_USER_AGENT?.trim(),
  uwToken: process.env.UW_API_TOKEN?.trim(),
  form4Pages: Number(process.env.FORM4_PAGES ?? 6), // 100 feed entries per page
  form4MinValue: Number(process.env.FORM4_MIN_VALUE ?? 100_000), // 10% owners are always kept
  keepDays: Number(process.env.KEEP_DAYS ?? 45),
  flowMinPremium: Number(process.env.FLOW_MIN_PREMIUM ?? 1_000_000),
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

async function form4(state) {
  const seen = new Set(state.seen ?? []);
  const events = [];
  let scanned = 0;
  for (let page = 0; page < CFG.form4Pages; page++) {
    const filings = parseEdgarFeed(await sec(feedUrl('4', page * 100))).filter((f) => /^4(\/A)?$/.test(f.form));
    const fresh = filings.filter((f) => !seen.has(f.accession));
    for (const f of fresh) {
      seen.add(f.accession);
      scanned++;
      try {
        const parsed = parseForm4(await sec(f.textUrl));
        const tenPct = parsed?.owners.some((o) => o.tenPct);
        events.push(...form4Events(f, parsed, { minValue: tenPct ? 0 : CFG.form4MinValue }));
      } catch (e) {
        console.warn(`  form4 ${f.accession}: ${e.message}`);
      }
    }
    if (!filings.length || fresh.length === 0) break; // caught up with the last run
  }
  return { events, state: { seen: [...seen].slice(-6000) }, note: `${scanned} new filings scanned` };
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

const SOURCES = [
  { key: 'etf', run: etf },
  { key: 'form4', run: form4, needs: () => (CFG.secUserAgent ? null : 'Set the SEC_USER_AGENT repository variable (a name and contact email) to turn this on.') },
  { key: 'sched13', run: sched13, needs: () => (CFG.secUserAgent ? null : 'Set the SEC_USER_AGENT repository variable (a name and contact email) to turn this on.') },
  { key: 'flow', run: flow, needs: () => (CFG.uwToken ? null : 'Needs a paid data feed. Add an Unusual Whales API key as the UW_API_TOKEN repository secret to turn this on.') },
];

// --------------------------------------------------------------------- main

const prev = await readFile(DATA, 'utf8').then(JSON.parse).catch(() => ({}));
const now = new Date();
const data = { updatedAt: now.toISOString(), sources: {}, state: prev.state ?? {}, events: prev.events ?? [] };
const ids = new Set(data.events.map((e) => e.id));

for (const { key, run, needs } of SOURCES) {
  const was = prev.sources?.[key] ?? {};
  const missing = needs?.();
  if (missing) {
    data.sources[key] = { status: 'off', note: missing };
    console.log(`${key}: off`);
    continue;
  }
  try {
    const r = await run(data.state[key] ?? {});
    data.state[key] = r.state;
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
if (CFG.secUserAgent) {
  try {
    const index = tickerIndex(JSON.parse(await sec('https://www.sec.gov/files/company_tickers.json')));
    console.log(`tickers: filled ${fillTickers(data.events, index)} from ${index.size} companies`);
  } catch (e) {
    console.warn(`tickers: lookup unavailable (${e.message})`);
  }
}

const cutoff = now.getTime() - CFG.keepDays * 864e5;
data.events = data.events
  .filter((e) => !(Date.parse(e.time) < cutoff))
  .sort((a, b) => Date.parse(b.time) - Date.parse(a.time));

await mkdir(dirname(DATA), { recursive: true });
await writeFile(DATA, JSON.stringify(data));
console.log(`Wrote ${data.events.length} events to ${DATA}`);
