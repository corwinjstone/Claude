// Yahoo Finance requires a CORS proxy when called from a browser on a different origin
const PROXY = 'https://corsproxy.io/?';
const BASE = 'https://query1.finance.yahoo.com/v8/finance/chart';

const RANGE_MAP = {
  '1D': { interval: '5m',  range: '1d'  },
  '1W': { interval: '15m', range: '5d'  },
  '1M': { interval: '1d',  range: '1mo' },
  '3M': { interval: '1d',  range: '3mo' },
  '1Y': { interval: '1d',  range: '1y'  },
  '5Y': { interval: '1wk', range: '5y'  },
};

const DAYS_TO_RANGE = {
  182:  '6mo',
  365:  '1y',
  1095: '2y',
  1825: '5y',
};

export async function fetchYahooCandles(symbol, rangeLabel) {
  const { interval, range } = RANGE_MAP[rangeLabel] ?? RANGE_MAP['1Y'];
  return _fetch(symbol, interval, range);
}

export async function fetchYahooCandlesByDays(symbol, days) {
  const range = DAYS_TO_RANGE[days] ?? '1y';
  const interval = days <= 365 ? '1d' : '1wk';
  return _fetch(symbol, interval, range);
}

async function _fetch(symbol, interval, range) {
  const yahooUrl = `${BASE}/${encodeURIComponent(symbol)}?interval=${interval}&range=${range}&events=div,splits`;
  const url = `${PROXY}${encodeURIComponent(yahooUrl)}`;

  const res = await fetch(url);
  if (!res.ok) throw new Error(`Yahoo Finance ${res.status} for ${symbol}`);

  const json = await res.json();
  const result = json?.chart?.result?.[0];
  if (!result) throw new Error(`No data for ${symbol}`);

  const timestamps = result.timestamp ?? [];
  const quote = result.indicators.quote[0];

  return timestamps
    .map((t, i) => ({
      time:   t,
      t,
      open:   quote.open[i],
      high:   quote.high[i],
      low:    quote.low[i],
      close:  quote.close[i],
      c:      quote.close[i],
      volume: quote.volume[i],
    }))
    .filter((c) => c.close != null);
}
