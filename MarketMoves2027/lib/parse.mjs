// Pure parsers and transforms. No network here, so everything is unit-testable.

const decode = (s) =>
  String(s ?? '')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&amp;/g, '&')
    .trim();

const num = (s) => {
  if (s == null) return null;
  const n = Number(String(s).replace(/[$,%\s]/g, ''));
  return Number.isFinite(n) ? n : null;
};

/** First <tag>…</tag> body inside xml (namespace prefixes tolerated). */
export function tag(xml, name) {
  const m = new RegExp(`<(?:\\w+:)?${name}(?:\\s[^>]*)?>([\\s\\S]*?)</(?:\\w+:)?${name}>`, 'i').exec(xml ?? '');
  return m ? m[1] : null;
}
export function tags(xml, name) {
  const re = new RegExp(`<(?:\\w+:)?${name}(?:\\s[^>]*)?>([\\s\\S]*?)</(?:\\w+:)?${name}>`, 'gi');
  return [...(xml ?? '').matchAll(re)].map((m) => m[1]);
}
/** Form 4 wraps most leaves as <x><value>…</value></x>. */
const val = (xml, name) => {
  const body = tag(xml, name);
  if (body == null) return null;
  const inner = tag(body, 'value');
  return decode(inner ?? body);
};
const truthy = (s) => /^(1|true)$/i.test(String(s ?? '').trim());

// ---------------------------------------------------------------- EDGAR feed

/**
 * EDGAR "current filings" atom feed. One filing appears once per related
 * entity (issuer, reporting owner, subject, filer), so entries are grouped by
 * accession number.
 */
export function parseEdgarFeed(xml) {
  const byAcc = new Map();
  for (const entry of tags(xml, 'entry')) {
    const title = decode(tag(entry, 'title'));
    const href = /<link[^>]*href="([^"]+)"/i.exec(entry)?.[1];
    const acc = /accession-number=([\d-]+)/i.exec(entry)?.[1];
    if (!acc || !href) continue;
    const form = /<category[^>]*term="([^"]+)"/i.exec(entry)?.[1] ?? title.split(' - ')[0];
    const m = /^.*? - (.*) \((\d{10})\) \(([^)]+)\)$/.exec(title);
    const filing = byAcc.get(acc) ?? {
      accession: acc,
      form: decode(form),
      updated: decode(tag(entry, 'updated')),
      indexUrl: href.replace(/^http:/, 'https:'),
      parties: [],
    };
    if (m) filing.parties.push({ name: m[1].trim(), cik: m[2], role: m[3].trim() });
    byAcc.set(acc, filing);
  }
  return [...byAcc.values()].map((f) => ({
    ...f,
    textUrl: f.indexUrl.replace(/-index\.html?$/i, '.txt'),
  }));
}

// -------------------------------------------------------------------- Form 4

/**
 * issuerTradingSymbol is free text: "LNW", "LNW, ASX:LNW", "ASX:LNW", "None".
 * Prefer a bare US symbol; otherwise take the part after an exchange prefix.
 */
export function cleanSymbol(raw) {
  const parts = String(raw ?? '').toUpperCase().split(/[,;/\s]+|\bAND\b/).map((p) => p.trim()).filter(Boolean);
  const pick = parts.find((p) => !p.includes(':')) ?? parts[0]?.split(':').pop();
  const t = (pick ?? '').replace(/[^A-Z0-9.\-]/g, '');
  return t && !/^(NONE|N\/?A|NA)$/.test(t) ? t : null;
}

const TX_CODES = { P: 'buy', S: 'sell' };

/**
 * Parse the ownershipDocument XML embedded in a Form 4 submission.
 * Only open-market purchases (code P) and sales (code S) are kept: grants,
 * option exercises, gifts and tax withholding are not a view on the stock.
 */
export function parseForm4(text) {
  const doc = tag(text, 'ownershipDocument');
  if (!doc) return null;
  const owners = tags(doc, 'reportingOwner').map((o) => ({
    name: val(o, 'rptOwnerName'),
    tenPct: truthy(val(o, 'isTenPercentOwner')),
    director: truthy(val(o, 'isDirector')),
    officer: truthy(val(o, 'isOfficer')),
    title: val(o, 'officerTitle') || null,
  }));
  const trades = [];
  for (const t of tags(doc, 'nonDerivativeTransaction')) {
    const action = TX_CODES[val(t, 'transactionCode')];
    if (!action) continue;
    const shares = num(val(t, 'transactionShares'));
    const price = num(val(t, 'transactionPricePerShare'));
    if (!shares || !price) continue;
    trades.push({
      action,
      date: val(t, 'transactionDate'),
      shares,
      price,
      value: shares * price,
      after: num(val(t, 'sharesOwnedFollowingTransaction')),
    });
  }
  return {
    issuer: val(doc, 'issuerName'),
    issuerCik: val(doc, 'issuerCik') ? String(Number(val(doc, 'issuerCik'))) : null,
    ticker: cleanSymbol(val(doc, 'issuerTradingSymbol')),
    owners,
    trades,
  };
}

/** Collapse a filing's individual fills into one buy row and/or one sell row. */
export function form4Events(filing, parsed, { minValue = 0 } = {}) {
  if (!parsed?.trades.length) return [];
  const owner = parsed.owners[0] ?? {};
  const tenPct = parsed.owners.some((o) => o.tenPct);
  const roles = [
    tenPct && '10% owner',
    parsed.owners.some((o) => o.director) && 'Director',
    parsed.owners.some((o) => o.officer) && (owner.title || 'Officer'),
  ].filter(Boolean);
  const out = [];
  for (const action of ['buy', 'sell']) {
    const fills = parsed.trades.filter((t) => t.action === action);
    if (!fills.length) continue;
    const shares = fills.reduce((s, t) => s + t.shares, 0);
    const value = fills.reduce((s, t) => s + t.value, 0);
    if (value < minValue) continue;
    out.push({
      id: `f4:${filing.accession}:${action}`,
      source: 'form4',
      time: filing.updated,
      tradeDate: fills.map((t) => t.date).sort().at(-1),
      ticker: parsed.ticker,
      cik: parsed.issuerCik,
      company: parsed.issuer,
      actor: parsed.owners.map((o) => o.name).filter(Boolean).slice(0, 2).join(', ') +
        (parsed.owners.length > 2 ? ` +${parsed.owners.length - 2}` : ''),
      action,
      shares,
      price: value / shares,
      value,
      tags: roles,
      tenPct,
      detail: fills.at(-1).after != null ? `Holds ${Math.round(fills.at(-1).after).toLocaleString('en-US')} after` : '',
      url: filing.indexUrl,
    });
  }
  return out;
}

// ------------------------------------------------------------ Schedule 13D/G

/**
 * A 13D/13G row is built from the feed alone (who filed, on which company).
 * `text` is optional enrichment: stake size is pulled from the structured XML
 * when present. Field names differ between 13D and 13G, so match loosely and
 * keep the largest reporting person's figures.
 */
export function schedule13Event(filing, text = '') {
  const subject = filing.parties.find((p) => /subject/i.test(p.role));
  const filers = filing.parties.filter((p) => /filed by|filer/i.test(p.role));
  if (!subject && !filers.length) return null;
  const activist = /13D/i.test(filing.form);
  const amendment = /\/A/i.test(filing.form);

  let pct = null;
  let shares = null;
  for (const m of text.matchAll(/<(?:\w+:)?(\w*percent\w*)>\s*([\d.,]+)\s*%?\s*</gi)) {
    const v = num(m[2]);
    if (v != null && v > 0 && v <= 100 && (pct == null || v > pct)) pct = v;
  }
  for (const m of text.matchAll(/<(?:\w+:)?(\w*aggregate\w*)>\s*([\d.,]+)\s*</gi)) {
    const v = num(m[2]);
    if (v != null && (shares == null || v > shares)) shares = v;
  }

  return {
    id: `13:${filing.accession}`,
    source: 'sched13',
    time: filing.updated,
    ticker: null,
    cik: subject ? String(Number(subject.cik)) : null,
    company: subject?.name ?? '(unknown issuer)',
    actor: filers.map((f) => f.name).slice(0, 2).join(', ') + (filers.length > 2 ? ` +${filers.length - 2}` : ''),
    action: 'stake',
    shares,
    pct,
    value: null,
    tags: [activist ? '13D activist' : '13G passive', amendment ? 'Amended' : 'New filing'],
    activist,
    amendment,
    detail: '',
    url: filing.indexUrl,
  };
}

// ----------------------------------------------------------- Active ETF CSVs

export function parseCsvLine(line) {
  const out = [];
  let cur = '';
  let q = false;
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (q) {
      if (c === '"' && line[i + 1] === '"') { cur += '"'; i++; }
      else if (c === '"') q = false;
      else cur += c;
    } else if (c === '"') q = true;
    else if (c === ',') { out.push(cur); cur = ''; }
    else cur += c;
  }
  out.push(cur);
  return out;
}

/** ARK daily holdings CSV -> { date: 'YYYY-MM-DD', fund, positions: [...] }. */
export function parseArkHoldings(csv) {
  const lines = csv.replace(/^﻿/, '').split(/\r?\n/).filter(Boolean);
  const head = parseCsvLine(lines[0]).map((h) => h.trim().toLowerCase());
  const col = (name) => head.findIndex((h) => h.startsWith(name));
  const ix = { date: col('date'), fund: col('fund'), company: col('company'), ticker: col('ticker'), cusip: col('cusip'), shares: col('shares'), value: col('market value'), weight: col('weight') };
  const positions = [];
  let date = null;
  let fund = null;
  for (const line of lines.slice(1)) {
    const c = parseCsvLine(line);
    const m = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/.exec((c[ix.date] ?? '').trim());
    if (!m) continue; // trailing disclaimer row
    date = `${m[3]}-${m[1].padStart(2, '0')}-${m[2].padStart(2, '0')}`;
    fund = c[ix.fund].trim();
    const shares = num(c[ix.shares]);
    const value = num(c[ix.value]);
    if (!shares) continue;
    positions.push({
      key: (c[ix.cusip] || c[ix.ticker] || c[ix.company]).trim(),
      ticker: c[ix.ticker].trim().split(' ')[0] || null,
      company: c[ix.company].trim(),
      shares,
      value,
      weight: num(c[ix.weight]),
    });
  }
  return { date, fund, positions };
}

const median = (xs) => {
  const s = [...xs].sort((a, b) => a - b);
  const mid = s.length >> 1;
  return s.length % 2 ? s[mid] : (s[mid - 1] + s[mid]) / 2;
};

/**
 * Compare two holdings snapshots of one fund and return the manager's trades.
 *
 * When investors create or redeem ETF shares, every position scales by the
 * same ratio. That is fund flow, not a decision. The median share ratio
 * estimates that scaling; only moves that depart from it by more than
 * `tolerance` count as trades, sized net of the scaling.
 */
export function diffHoldings(prev, next, { tolerance = 0.005 } = {}) {
  if (!prev || !next || prev.date === next.date) return [];
  const before = new Map(prev.positions.map((p) => [p.key, p]));
  const after = new Map(next.positions.map((p) => [p.key, p]));
  const ratios = [];
  for (const [k, p] of after) if (before.has(k)) ratios.push(p.shares / before.get(k).shares);
  const scale = ratios.length >= 5 ? median(ratios) : 1;
  const events = [];
  const push = (p, delta, kind) => {
    const px = p.value && p.shares ? p.value / p.shares : null;
    if (!p.ticker) return; // cash, private placements, placeholder rows
    events.push({
      id: `etf:${next.fund}:${next.date}:${p.key}`,
      source: 'etf',
      time: `${next.date}T21:00:00Z`,
      tradeDate: next.date,
      ticker: p.ticker,
      company: p.company,
      actor: `ARK ${next.fund}`,
      action: delta > 0 ? 'buy' : 'sell',
      shares: Math.abs(Math.round(delta)),
      price: px,
      value: px ? Math.abs(delta) * px : null,
      tags: [kind],
      detail: p.weight != null && kind !== 'Exited' ? `${p.weight.toFixed(2)}% of fund` : '',
      url: 'https://www.ark-funds.com/funds/' + next.fund.toLowerCase(),
    });
  };
  for (const [k, p] of after) {
    const old = before.get(k);
    if (!old) { push(p, p.shares, 'New position'); continue; }
    const expected = old.shares * scale;
    if (Math.abs(p.shares / expected - 1) > tolerance) push(p, p.shares - expected, p.shares > expected ? 'Added' : 'Trimmed');
  }
  for (const [k, old] of before) if (!after.has(k)) push(old, -old.shares, 'Exited');
  return events;
}

// ------------------------------------------------------------ ticker lookup

const normName = (s) =>
  String(s ?? '').toUpperCase().replace(/&AMP;/g, '&').replace(/[.,'"()]/g, ' ')
    .replace(/\b(INC|CORP|CORPORATION|CO|COMPANY|LTD|LIMITED|PLC|LLC|LP|HOLDINGS?|GROUP|SA|NV|AG|SE|THE|CLASS [A-Z])\b/g, ' ')
    .replace(/[^A-Z0-9&]+/g, ' ').trim();

/**
 * SEC company_tickers.json -> lookup by CIK and by normalised name. The file
 * is ordered by market value, so the first ticker seen for a CIK is its
 * primary listing (e.g. GOOGL before GOOG).
 */
export function tickerIndex(json) {
  const byCik = new Map();
  const byName = new Map();
  for (const r of Object.values(json ?? {})) {
    const cik = String(r.cik_str);
    if (!byCik.has(cik)) byCik.set(cik, r.ticker);
    const n = normName(r.title);
    if (n && !byName.has(n)) byName.set(n, r.ticker);
  }
  const known = new Set([...Object.values(json ?? {})].map((r) => r.ticker));
  return {
    size: byCik.size,
    known: (t) => known.has(t),
    lookup: (e) => (e.cik && byCik.get(String(Number(e.cik)))) || byName.get(normName(e.company)) || null,
  };
}

/** Fill in missing or placeholder tickers in place. Returns how many were filled. */
export function fillTickers(events, index) {
  let n = 0;
  for (const e of events) {
    if (e.source === 'etf') continue;
    // Keep a ticker the SEC list recognises; re-resolve placeholders and mangled ones.
    if (e.ticker && index.known(e.ticker)) continue;
    const t = index.lookup(e);
    if (t) { if (t !== e.ticker) n++; e.ticker = t; } else if (e.ticker && /^(NONE|N\/?A|NA)$/.test(e.ticker)) e.ticker = null;
  }
  return n;
}
