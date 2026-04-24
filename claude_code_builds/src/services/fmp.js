const BASE = 'https://financialmodelingprep.com/api/v3';

function getKey() {
  return import.meta.env.VITE_FMP_KEY || '';
}

async function request(path, params = {}) {
  const url = new URL(`${BASE}${path}`);
  url.searchParams.set('apikey', getKey());
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
  const res = await fetch(url.toString());
  if (!res.ok) throw new Error(`FMP ${res.status}: ${path}`);
  return res.json();
}

export const fmp = {
  analystRatings: (symbol) =>
    request(`/analyst-stock-recommendations/${symbol}`),

  incomeStatement: (symbol) =>
    request(`/income-statement/${symbol}`, { limit: 4 }),

  priceTarget: (symbol) =>
    request(`/price-target-consensus/${symbol}`),

  sectorPerformance: () =>
    request('/sector-performance'),
};
