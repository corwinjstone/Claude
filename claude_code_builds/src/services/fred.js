const BASE = 'https://api.stlouisfed.org/fred';

function getKey() {
  return import.meta.env.VITE_FRED_KEY || '';
}

async function request(path, params = {}) {
  const url = new URL(`${BASE}${path}`);
  url.searchParams.set('api_key', getKey());
  url.searchParams.set('file_type', 'json');
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
  const res = await fetch(url.toString());
  if (!res.ok) throw new Error(`FRED ${res.status}: ${path}`);
  return res.json();
}

export const fred = {
  series: (series_id, params = {}) =>
    request('/series/observations', { series_id, ...params }),

  // Common economic indicators
  cpi: () => fred.series('CPIAUCSL', { limit: 24, sort_order: 'desc' }),
  unemployment: () => fred.series('UNRATE', { limit: 24, sort_order: 'desc' }),
  gdp: () => fred.series('GDP', { limit: 12, sort_order: 'desc' }),
  federalFundsRate: () => fred.series('FEDFUNDS', { limit: 24, sort_order: 'desc' }),
  vix: () => fred.series('VIXCLS', { limit: 30, sort_order: 'desc' }),
};
