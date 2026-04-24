const BASE = 'https://finnhub.io/api/v1';

function getKey() {
  return import.meta.env.VITE_FINNHUB_KEY || '';
}

async function request(path, params = {}) {
  const url = new URL(`${BASE}${path}`);
  url.searchParams.set('token', getKey());
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
  const res = await fetch(url.toString());
  if (!res.ok) throw new Error(`Finnhub ${res.status}: ${path}`);
  return res.json();
}

export const finnhub = {
  quote: (symbol) => request('/quote', { symbol }),

  candles: (symbol, resolution, from, to) =>
    request('/stock/candle', { symbol, resolution, from, to }),

  companyProfile: (symbol) =>
    request('/stock/profile2', { symbol }),

  basicFinancials: (symbol) =>
    request('/stock/metric', { symbol, metric: 'all' }),

  peers: (symbol) =>
    request('/stock/peers', { symbol }),

  companyNews: (symbol, from, to) =>
    request('/company-news', { symbol, from, to }),

  marketNews: (category = 'general') =>
    request('/news', { category }),

  symbolSearch: (q) =>
    request('/search', { q }),

  recommendation: (symbol) =>
    request('/stock/recommendation', { symbol }),

  earnings: (symbol) =>
    request('/stock/earnings', { symbol }),

  earningsCalendar: (from, to) =>
    request('/calendar/earnings', { from, to }),

  // Major index quotes via their symbols
  indexQuote: (symbol) =>
    request('/quote', { symbol }),
};
