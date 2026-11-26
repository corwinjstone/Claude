// Pure transforms for the stock drawer: Yahoo chart JSON -> price series,
// SEC XBRL company concepts -> quarterly results and TTM ratios.

const r6 = (v) => (v == null || !Number.isFinite(v) ? null : Number(v.toPrecision(6)));
const etDate = (sec) => new Date(sec * 1000).toLocaleDateString('en-CA', { timeZone: 'America/New_York' });

// ------------------------------------------------------------------ prices

/** Yahoo /v8/finance/chart response -> { meta, points: [[unixSec, close]], open } */
export function parseChart(json) {
  const r = json?.chart?.result?.[0];
  if (!r) throw new Error(json?.chart?.error?.description ?? 'no chart result');
  const ts = r.timestamp ?? [];
  const q = r.indicators?.quote?.[0] ?? {};
  const points = [];
  ts.forEach((t, i) => { if (q.close?.[i] != null) points.push([t, r6(q.close[i])]); });
  const open = q.open?.find((v) => v != null) ?? null;
  return { meta: r.meta ?? {}, points, open: r6(open) };
}

/**
 * Combine the three chart pulls into the file the drawer reads.
 * `prev` is the last file for this ticker, used when a pull was skipped.
 * Previous close comes from the daily series (the close of the last session
 * before the intraday one), which is more reliable than chart meta.
 */
export function buildQuote({ intraday, fiveDay, daily }, prev = null, now = new Date()) {
  const i1m = intraday?.points ?? prev?.i1m ?? [];
  const i15m = fiveDay?.points ?? prev?.i15m ?? [];
  const d = daily?.points ?? prev?.daily ?? [];
  const meta = intraday?.meta ?? fiveDay?.meta ?? daily?.meta ?? {};
  const sessionDay = i1m.length ? etDate(i1m.at(-1)[0]) : null;
  let prevClose = null;
  for (let k = d.length - 1; k >= 0; k--) {
    if (!sessionDay || etDate(d[k][0]) < sessionDay) { prevClose = d[k][1]; break; }
  }
  const price = r6(meta.regularMarketPrice) ?? i1m.at(-1)?.[1] ?? prev?.price ?? null;
  return {
    symbol: meta.symbol ?? prev?.symbol,
    name: meta.longName ?? meta.shortName ?? prev?.name ?? null,
    exchange: meta.fullExchangeName ?? prev?.exchange ?? null,
    currency: meta.currency ?? prev?.currency ?? 'USD',
    asOf: meta.regularMarketTime ? new Date(meta.regularMarketTime * 1000).toISOString() : prev?.asOf ?? null,
    price,
    prevClose: prevClose ?? r6(meta.chartPreviousClose) ?? prev?.prevClose ?? null,
    open: intraday?.open ?? prev?.open ?? null,
    dayHigh: r6(meta.regularMarketDayHigh) ?? prev?.dayHigh ?? null,
    dayLow: r6(meta.regularMarketDayLow) ?? prev?.dayLow ?? null,
    volume: meta.regularMarketVolume ?? prev?.volume ?? null,
    wk52High: r6(meta.fiftyTwoWeekHigh) ?? prev?.wk52High ?? null,
    wk52Low: r6(meta.fiftyTwoWeekLow) ?? prev?.wk52Low ?? null,
    i1m,
    i15m,
    daily: d,
    fetchedAt: now.toISOString(),
    dailyAt: daily ? now.toISOString() : prev?.dailyAt ?? null,
    fundamentals: prev?.fundamentals ?? null,
  };
}

/** True from 9:25 to 16:10 New York time on weekdays (holidays not modelled). */
export function isMarketHours(now = new Date()) {
  const p = Object.fromEntries(new Intl.DateTimeFormat('en-US', { timeZone: 'America/New_York', weekday: 'short', hour: 'numeric', minute: 'numeric', hourCycle: 'h23' })
    .formatToParts(now).map((x) => [x.type, x.value]));
  const mins = Number(p.hour) * 60 + Number(p.minute);
  return !['Sat', 'Sun'].includes(p.weekday) && mins >= 9 * 60 + 25 && mins <= 16 * 60 + 10;
}

// ------------------------------------------------------------ fundamentals

const DAY = 864e5;
const span = (f) => (Date.parse(f.end) - Date.parse(f.start)) / DAY;

/**
 * One XBRL concept -> quarterly values by period end, latest filing wins.
 * Companies rarely file Q4 as its own quarter, so Q4 = fiscal year minus the
 * three reported quarters inside it (marked derived).
 */
export function quarterly(concept, unit) {
  const facts = concept?.units?.[unit] ?? [];
  const q = new Map();
  const fy = new Map();
  for (const f of facts) {
    if (!f.start || f.val == null) continue;
    const days = span(f);
    const bucket = days >= 80 && days <= 100 ? q : days >= 350 && days <= 380 ? fy : null;
    if (!bucket) continue;
    const old = bucket.get(f.end);
    if (!old || f.filed > old.filed) bucket.set(f.end, f);
  }
  for (const [end, a] of fy) {
    if (q.has(end)) continue;
    const inside = [...q.values()].filter((x) => x.start >= a.start && x.end < end);
    if (inside.length === 3) q.set(end, { ...a, start: inside.reduce((m, x) => (x.end > m ? x.end : m), a.start), val: a.val - inside.reduce((s, x) => s + x.val, 0), derived: true });
  }
  return [...q.values()].sort((a, b) => a.end.localeCompare(b.end)).map((f) => ({ end: f.end, val: f.val, filed: f.filed, form: f.form, derived: !!f.derived }));
}

/** The latest point-in-time value of an instant concept (e.g. shares outstanding). */
export function latestInstant(concept, unit) {
  const facts = (concept?.units?.[unit] ?? []).filter((f) => f.val != null && f.end);
  facts.sort((a, b) => a.end.localeCompare(b.end) || a.filed.localeCompare(b.filed));
  const f = facts.at(-1);
  return f ? { val: f.val, end: f.end } : null;
}

const yearBefore = (rows, end) => rows.find((r) => {
  const gap = (Date.parse(end) - Date.parse(r.end)) / DAY;
  return gap >= 350 && gap <= 380;
});

/**
 * @param c { revenue: [concept...], netIncome, eps, shares, dilutedShares }
 * Revenue moved between tags over the years, so every candidate is read and
 * the one with the most recent quarter wins.
 */
export function buildFundamentals(c, cik) {
  const revs = (c.revenue ?? []).map((x) => quarterly(x, 'USD')).filter((s) => s.length);
  revs.sort((a, b) => b.at(-1).end.localeCompare(a.at(-1).end));
  const rev = revs[0] ?? [];
  const ni = quarterly(c.netIncome, 'USD');
  const eps = quarterly(c.eps, 'USD/shares');
  const spine = (rev.length ? rev : eps.length ? eps : ni).slice(-8);
  if (!spine.length) return null;
  const at = (s, end) => s.find((x) => x.end === end);
  const quarters = spine.map(({ end }) => {
    const r = at(rev, end);
    const prior = r && yearBefore(rev, end);
    return {
      end,
      revenue: r?.val ?? null,
      revenueYoY: r && prior?.val ? (r.val - prior.val) / Math.abs(prior.val) : null,
      netIncome: at(ni, end)?.val ?? null,
      eps: at(eps, end)?.val ?? null,
      derived: !!(r?.derived || at(eps, end)?.derived),
    };
  });
  const last4 = quarters.slice(-4);
  const contiguous = last4.length === 4 && (Date.parse(last4[3].end) - Date.parse(last4[0].end)) / DAY < 300;
  const sum = (k) => (contiguous && last4.every((x) => x[k] != null) ? last4.reduce((s, x) => s + x[k], 0) : null);
  const shares = latestInstant(c.shares, 'shares') ?? (() => {
    const w = quarterly(c.dilutedShares, 'shares').at(-1);
    return w ? { val: w.val, end: w.end } : null;
  })();
  const filed = [...rev, ...eps, ...ni].reduce((m, x) => (x.filed > m ? x.filed : m), '');
  return {
    cik,
    quarters,
    ttm: { revenue: sum('revenue'), netIncome: sum('netIncome'), eps: sum('eps') },
    shares: shares?.val ?? null,
    sharesAsOf: shares?.end ?? null,
    lastQuarterEnd: quarters.at(-1).end,
    lastFiled: filed || null,
  };
}
