'use strict';

const DEFAULT_KEYWORDS = [
  'mortgage', 'refinance', 'refi', 'apr', 'interest rate',
  'fixed rate', 'adjustable rate', 'arm loan', 'heloc',
  'home equity', 'pmi', 'ltv', 'escrow', 'amortize',
  'loan-to-value', 'closing costs', 'origination fee',
  'down payment', 'pre-approval', 'home loan', 'foreclosure',
  'lender', 'underwriting', 'appraisal'
];

// ─── State ──────────────────────────────────────────────────────────

let state = { enabled: true, keywords: [...DEFAULT_KEYWORDS], fredApiKey: '' };

async function loadState() {
  const stored = await chrome.storage.sync.get({
    enabled: true,
    keywords: DEFAULT_KEYWORDS,
    fredApiKey: ''
  });
  state = stored;
}

async function saveState(patch) {
  Object.assign(state, patch);
  await chrome.storage.sync.set(patch);
}

// ─── Rates ──────────────────────────────────────────────────────────

async function loadRates() {
  const rates = await chrome.runtime.sendMessage({ type: 'GET_RATES' });
  document.getElementById('rate-30').textContent = rates.thirtyYear + '%';
  document.getElementById('rate-15').textContent = rates.fifteenYear + '%';
  document.getElementById('rate-arm').textContent = rates.fiveOneArm + '%';
  const src = document.getElementById('rate-source');
  if (src) {
    src.textContent = rates.source === 'fred'
      ? `FRED · ${rates.lastUpdated}`
      : `Estimated · ${rates.lastUpdated} — Add FRED API key for live data`;
  }
}

async function refreshRates() {
  const btn = document.getElementById('refresh-rates');
  if (btn) btn.textContent = '↻ …';
  await chrome.runtime.sendMessage({ type: 'CLEAR_CACHE' });
  await loadRates();
  if (btn) btn.innerHTML = `
    <svg viewBox="0 0 24 24" width="13" height="13" fill="none">
      <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M3 3v5h5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
    Refresh`;
}

// ─── Keywords ───────────────────────────────────────────────────────

function renderKeywords() {
  const list = document.getElementById('keyword-list');
  const count = document.getElementById('kw-count');
  if (!list) return;

  list.innerHTML = '';
  state.keywords.forEach(kw => {
    const tag = document.createElement('span');
    tag.className = 'kw-tag';
    tag.innerHTML = `${escHtml(kw)}<button class="kw-tag-remove" data-kw="${escHtml(kw)}" title="Remove">&times;</button>`;
    tag.querySelector('.kw-tag-remove').addEventListener('click', () => removeKeyword(kw));
    list.appendChild(tag);
  });

  if (count) count.textContent = state.keywords.length;
}

function escHtml(str) {
  return str.replace(/[&<>"']/g, c =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])
  );
}

async function addKeyword(kw) {
  const clean = kw.trim().toLowerCase();
  if (!clean || state.keywords.includes(clean)) return;
  const updated = [...state.keywords, clean];
  await saveState({ keywords: updated });
  renderKeywords();
}

async function removeKeyword(kw) {
  const updated = state.keywords.filter(k => k !== kw);
  await saveState({ keywords: updated });
  renderKeywords();
}

// ─── Init ────────────────────────────────────────────────────────────

async function init() {
  await loadState();

  // Enabled toggle
  const toggle = document.getElementById('enabled-toggle');
  if (toggle) {
    toggle.checked = state.enabled;
    toggle.addEventListener('change', () => saveState({ enabled: toggle.checked }));
  }

  // Rates
  loadRates();
  document.getElementById('refresh-rates')?.addEventListener('click', refreshRates);

  // Keywords
  renderKeywords();

  const newKwInput = document.getElementById('new-keyword');
  const addBtn = document.getElementById('add-keyword');

  addBtn?.addEventListener('click', () => {
    const val = newKwInput?.value || '';
    addKeyword(val);
    if (newKwInput) newKwInput.value = '';
  });

  newKwInput?.addEventListener('keydown', e => {
    if (e.key === 'Enter') {
      addKeyword(newKwInput.value);
      newKwInput.value = '';
    }
  });

  // FRED API key
  const apiInput = document.getElementById('fred-api-key');
  const saveKeyBtn = document.getElementById('save-api-key');
  const apiStatus = document.getElementById('api-status');

  if (apiInput && state.fredApiKey) {
    apiInput.value = state.fredApiKey;
  }

  saveKeyBtn?.addEventListener('click', async () => {
    const key = apiInput?.value?.trim() || '';
    await saveState({ fredApiKey: key });
    await chrome.runtime.sendMessage({ type: 'CLEAR_CACHE' });
    if (apiStatus) {
      apiStatus.textContent = key ? '✓ API key saved. Refreshing rates…' : 'API key cleared.';
      apiStatus.className = 'api-status api-status--ok';
    }
    await loadRates();
  });

  // Reset
  document.getElementById('reset-all')?.addEventListener('click', async () => {
    if (!confirm('Reset all keywords and settings to defaults?')) return;
    await saveState({ keywords: DEFAULT_KEYWORDS, enabled: true, fredApiKey: '' });
    if (apiInput) apiInput.value = '';
    if (toggle) toggle.checked = true;
    renderKeywords();
    if (apiStatus) { apiStatus.textContent = ''; apiStatus.className = 'api-status'; }
  });
}

document.addEventListener('DOMContentLoaded', init);
