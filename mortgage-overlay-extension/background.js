// Service worker — handles rate fetching and caching

const CACHE_KEY = 'mortgage_rates_cache';
const CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour

// Fallback rates when no API key is set or fetch fails
// Kept realistic for mid-2026 environment
const FALLBACK_RATES = {
  thirtyYear: 6.89,
  fifteenYear: 6.21,
  fiveOneArm: 6.54,
  trend: 0.08,
  lastUpdated: 'Jun 2026 (est.)',
  source: 'estimated'
};

async function fetchFredSeries(seriesId, apiKey) {
  const url =
    `https://api.stlouisfed.org/fred/series/observations` +
    `?series_id=${seriesId}&api_key=${apiKey}&limit=2&sort_order=desc&file_type=json`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`FRED ${seriesId} ${res.status}`);
  const data = await res.json();
  const obs = data.observations || [];
  return {
    latest: parseFloat(obs[0]?.value) || null,
    previous: parseFloat(obs[1]?.value) || null,
    date: obs[0]?.date || null
  };
}

async function fetchLiveRates(apiKey) {
  const [r30, r15, r5] = await Promise.all([
    fetchFredSeries('MORTGAGE30US', apiKey),
    fetchFredSeries('MORTGAGE15US', apiKey),
    fetchFredSeries('MORTGAGE5US', apiKey)
  ]);

  const trend = r30.latest && r30.previous
    ? Math.round((r30.latest - r30.previous) * 100) / 100
    : 0;

  const dateStr = r30.date
    ? new Date(r30.date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
    : '';

  return {
    thirtyYear: r30.latest,
    fifteenYear: r15.latest,
    fiveOneArm: r5.latest,
    trend,
    lastUpdated: dateStr,
    source: 'fred'
  };
}

async function getRates() {
  // Check cache first
  const stored = await chrome.storage.local.get(CACHE_KEY);
  const cached = stored[CACHE_KEY];
  if (cached && Date.now() - cached.fetchedAt < CACHE_TTL_MS) {
    return cached.data;
  }

  // Try live fetch if API key is set
  const settings = await chrome.storage.sync.get({ fredApiKey: '' });
  if (settings.fredApiKey) {
    try {
      const live = await fetchLiveRates(settings.fredApiKey);
      await chrome.storage.local.set({
        [CACHE_KEY]: { data: live, fetchedAt: Date.now() }
      });
      return live;
    } catch (err) {
      console.warn('[MortgageOverlay] FRED fetch failed:', err.message);
    }
  }

  return FALLBACK_RATES;
}

chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
  if (msg.type === 'GET_RATES') {
    getRates().then(sendResponse).catch(() => sendResponse(FALLBACK_RATES));
    return true; // keep message channel open for async response
  }

  if (msg.type === 'CLEAR_CACHE') {
    chrome.storage.local.remove(CACHE_KEY, () => sendResponse({ ok: true }));
    return true;
  }
});
