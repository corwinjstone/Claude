import test from 'node:test';
import assert from 'node:assert/strict';
import { parseChart, buildQuote, isMarketHours, quarterly, buildFundamentals } from '../lib/market.mjs';

// 2026-11-24 and 2026-11-25 sessions, timestamps at 9:30 ET (14:30 UTC).
const t = (iso) => Date.parse(iso) / 1000;
const chart = (meta, rows) => ({
  chart: { result: [{ meta, timestamp: rows.map((r) => r[0]), indicators: { quote: [{ close: rows.map((r) => r[1]), open: rows.map((r) => r[2] ?? r[1]) }] } }], error: null },
});

test('chart parse drops empty bars and keeps the first open', () => {
  const c = parseChart(chart({ symbol: 'X' }, [[1, null, null], [2, 10.123456789, 10], [3, 11]]));
  assert.deepEqual(c.points, [[2, 10.1235], [3, 11]]);
  assert.equal(c.open, 10);
  assert.throws(() => parseChart({ chart: { result: null, error: { description: 'No data found' } } }), /No data/);
});

test('previous close comes from the session before the intraday one', () => {
  const daily = parseChart(chart({}, [[t('2026-11-23T14:30Z'), 180], [t('2026-11-24T14:30Z'), 190.01], [t('2026-11-25T14:30Z'), 196.19]]));
  const intraday = parseChart(chart({ symbol: 'COHR', longName: 'Coherent Corp.', regularMarketPrice: 196.19, chartPreviousClose: 196.24, regularMarketTime: t('2026-11-25T21:00Z') },
    [[t('2026-11-25T14:30Z'), 180.5, 181], [t('2026-11-25T20:59Z'), 196.19]]));
  const q = buildQuote({ intraday, fiveDay: null, daily }, { i15m: [[1, 2]] });
  assert.equal(q.prevClose, 190.01);
  assert.equal(q.open, 181);
  assert.equal(q.name, 'Coherent Corp.');
  assert.deepEqual(q.i15m, [[1, 2]]); // kept from the previous file
  assert.equal(q.daily.length, 3);
});

test('market hours follow New York time', () => {
  assert.equal(isMarketHours(new Date('2026-11-25T15:00:00Z')), true); // Wed 10:00 ET
  assert.equal(isMarketHours(new Date('2026-11-25T22:00:00Z')), false); // Wed 17:00 ET
  assert.equal(isMarketHours(new Date('2026-11-28T15:00:00Z')), false); // Saturday
});

const fact = (start, end, val, filed = '2026-11-01', form = '10-Q') => ({ start, end, val, filed, form });
const concept = (unit, facts) => ({ units: { [unit]: facts } });

test('quarterly series derives Q4 from the fiscal year', () => {
  const s = quarterly(concept('USD', [
    fact('2025-01-01', '2025-03-31', 100), fact('2025-04-01', '2025-06-30', 110), fact('2025-07-01', '2025-09-30', 120),
    fact('2025-01-01', '2025-12-31', 470, '2026-02-15', '10-K'),
    fact('2025-01-01', '2025-06-30', 210), // six-month YTD: ignored
    fact('2026-01-01', '2026-03-31', 90, '2026-05-01'), fact('2026-01-01', '2026-03-31', 95, '2026-08-01'), // restated: later filing wins
  ]), 'USD');
  assert.deepEqual(s.map((x) => [x.end, x.val, x.derived]), [
    ['2025-03-31', 100, false], ['2025-06-30', 110, false], ['2025-09-30', 120, false], ['2025-12-31', 140, true], ['2026-03-31', 95, false],
  ]);
});

test('fundamentals pick the freshest revenue tag and compute TTM', () => {
  const q = (y, n, v) => fact(`${y}-${String(n * 3 - 2).padStart(2, '0')}-01`, ['', '03-31', '06-30', '09-30', '12-31'][n].replace(/^/, `${y}-`), v);
  const oldTag = concept('USD', [q(2019, 1, 1), q(2019, 2, 1)]);
  const newTag = concept('USD', [q(2025, 1, 100), q(2025, 2, 100), q(2025, 3, 100), q(2025, 4, 100), q(2026, 1, 120), q(2026, 2, 130), q(2026, 3, 150)]);
  const ni = concept('USD', [q(2025, 4, 10), q(2026, 1, 12), q(2026, 2, 13), q(2026, 3, 15)]);
  const eps = concept('USD/shares', [q(2025, 4, 0.5), q(2026, 1, 0.6), q(2026, 2, 0.65), q(2026, 3, 0.75)]);
  const shares = concept('shares', [{ end: '2026-10-20', val: 20, filed: '2026-11-01' }, { end: '2026-07-20', val: 19, filed: '2026-08-01' }]);
  const f = buildFundamentals({ revenue: [oldTag, newTag], netIncome: ni, eps, shares }, '123');
  assert.equal(f.quarters.length, 7);
  assert.equal(f.lastQuarterEnd, '2026-09-30');
  assert.deepEqual(f.ttm, { revenue: 500, netIncome: 50, eps: 2.5 });
  assert.equal(f.quarters.at(-1).revenueYoY, 0.5);
  assert.equal(f.shares, 20);
  assert.equal(buildFundamentals({ revenue: [], netIncome: null, eps: null }, '1'), null);
});
