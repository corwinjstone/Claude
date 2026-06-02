// Content script — keyword detection and overlay management

const DEFAULT_KEYWORDS = [
  'mortgage', 'refinance', 'refi', 'apr', 'interest rate',
  'fixed rate', 'adjustable rate', 'arm loan', 'heloc',
  'home equity', 'pmi', 'ltv', 'escrow', 'amortize',
  'loan-to-value', 'closing costs', 'origination fee',
  'down payment', 'pre-approval', 'home loan', 'foreclosure',
  'lender', 'underwriting', 'appraisal'
];

let overlayShown = false;
let currentRates = null;

// ─── Keyword detection ────────────────────────────────────────────────────────

function findTriggerKeyword(keywords) {
  // Gather all visible text without altering the DOM
  const walker = document.createTreeWalker(
    document.body,
    NodeFilter.SHOW_TEXT,
    {
      acceptNode(node) {
        const tag = node.parentElement?.tagName?.toLowerCase();
        if (!tag) return NodeFilter.FILTER_REJECT;
        if (['script', 'style', 'noscript', 'iframe', 'input', 'textarea'].includes(tag)) {
          return NodeFilter.FILTER_REJECT;
        }
        return NodeFilter.FILTER_ACCEPT;
      }
    }
  );

  const lowerKeywords = keywords.map(k => k.toLowerCase());
  let node;
  while ((node = walker.nextNode())) {
    const text = node.textContent.toLowerCase();
    const hit = lowerKeywords.find(k => text.includes(k));
    if (hit) return hit;
  }
  return null;
}

// ─── Monthly payment calculator ───────────────────────────────────────────────

function calcPayment(principal, annualRatePct, years) {
  const r = annualRatePct / 100 / 12;
  const n = years * 12;
  if (r === 0) return principal / n;
  return principal * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
}

function fmtCurrency(n) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency', currency: 'USD', maximumFractionDigits: 0
  }).format(n);
}

// ─── Overlay HTML ─────────────────────────────────────────────────────────────

function esc(str) {
  return String(str).replace(/[&<>"']/g, c =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])
  );
}

function buildOverlayHTML(triggerWord, rates) {
  const isEstimated = rates.source === 'estimated';
  const trendAbs = Math.abs(rates.trend).toFixed(2);
  const trendDir = rates.trend > 0 ? '▲' : rates.trend < 0 ? '▼' : '—';
  const trendClass = rates.trend > 0 ? 'mo-trend--up' : rates.trend < 0 ? 'mo-trend--down' : '';
  const defaultPayment = fmtCurrency(calcPayment(400000, rates.thirtyYear, 30));

  return `
  <div class="mo-panel" id="mo-panel" role="dialog" aria-label="Mortgage Rate Insights">
    <div class="mo-header">
      <div class="mo-header-left">
        <div class="mo-icon-wrap">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" width="20" height="20">
            <path d="M3 9.5L12 3L21 9.5V20C21 20.55 20.55 21 20 21H4C3.45 21 3 20.55 3 20V9.5Z" stroke="white" stroke-width="2" stroke-linejoin="round" fill="none"/>
            <path d="M9 21V13H15V21" stroke="white" stroke-width="2" stroke-linejoin="round"/>
          </svg>
        </div>
        <div>
          <div class="mo-title">Mortgage Insights</div>
          <div class="mo-subtitle">Triggered by <span class="mo-keyword">"${esc(triggerWord)}"</span></div>
        </div>
      </div>
      <button class="mo-close-btn" id="mo-close" aria-label="Close overlay">
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none">
          <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        </svg>
      </button>
    </div>

    <div class="mo-body">
      <div class="mo-section">
        <div class="mo-section-header">
          <span class="mo-section-title">Current Rates</span>
          <span class="mo-updated">${esc(rates.lastUpdated)}${isEstimated ? ' *' : ''}</span>
        </div>
        <div class="mo-rates-grid">
          <div class="mo-rate-card mo-rate-card--primary">
            <div class="mo-rate-label">30-Year Fixed</div>
            <div class="mo-rate-value">${rates.thirtyYear}<span class="mo-rate-pct">%</span></div>
            <div class="mo-rate-trend ${trendClass}">${trendDir} ${trendAbs}% wk</div>
          </div>
          <div class="mo-rate-card">
            <div class="mo-rate-label">15-Year Fixed</div>
            <div class="mo-rate-value">${rates.fifteenYear}<span class="mo-rate-pct">%</span></div>
          </div>
          <div class="mo-rate-card">
            <div class="mo-rate-label">5/1 ARM</div>
            <div class="mo-rate-value">${rates.fiveOneArm}<span class="mo-rate-pct">%</span></div>
          </div>
        </div>
      </div>

      <div class="mo-section">
        <div class="mo-section-title">Monthly Payment Estimator</div>
        <div class="mo-calc">
          <label class="mo-calc-label" for="mo-loan">Loan Amount</label>
          <div class="mo-input-wrap">
            <span class="mo-input-prefix">$</span>
            <input
              type="number"
              id="mo-loan"
              class="mo-input"
              value="400000"
              min="10000"
              max="10000000"
              step="5000"
              inputmode="numeric"
            />
          </div>
          <div class="mo-term-tabs">
            <button class="mo-term-btn mo-term-btn--active" data-years="30" data-rate="${rates.thirtyYear}">30 yr</button>
            <button class="mo-term-btn" data-years="15" data-rate="${rates.fifteenYear}">15 yr</button>
          </div>
          <div class="mo-payment-result">
            <div class="mo-payment-amount" id="mo-payment">${defaultPayment}</div>
            <div class="mo-payment-note" id="mo-payment-note">/ month · 30-yr @ ${rates.thirtyYear}% (P&amp;I)</div>
          </div>
        </div>
      </div>
    </div>

    <div class="mo-footer">
      ${isEstimated ? '<div class="mo-disclaimer">* Rates are estimates. Add your FRED API key in extension settings for live data.</div>' : '<div class="mo-disclaimer">Source: Federal Reserve Bank of St. Louis (FRED)</div>'}
      <button class="mo-dismiss-link" id="mo-dismiss">Hide on this site</button>
    </div>
  </div>
  <div class="mo-backdrop" id="mo-backdrop"></div>
  `;
}

// ─── Overlay lifecycle ────────────────────────────────────────────────────────

function showOverlay(triggerWord, rates) {
  if (overlayShown) return;
  overlayShown = true;
  currentRates = rates;

  const root = document.createElement('div');
  root.id = 'mortgage-overlay-root';
  root.innerHTML = buildOverlayHTML(triggerWord, rates);
  document.body.appendChild(root);

  // Trigger slide-in animation on next frame
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      root.querySelector('#mo-panel')?.classList.add('mo-panel--open');
    });
  });

  wireEvents(root, rates);
}

function closeOverlay(root) {
  const panel = root.querySelector('#mo-panel');
  if (panel) panel.classList.remove('mo-panel--open');
  setTimeout(() => root.remove(), 320);
}

function wireEvents(root, rates) {
  root.querySelector('#mo-close')?.addEventListener('click', () => closeOverlay(root));
  root.querySelector('#mo-backdrop')?.addEventListener('click', () => closeOverlay(root));

  // "Hide on this site" persists to sessionStorage
  root.querySelector('#mo-dismiss')?.addEventListener('click', () => {
    try { sessionStorage.setItem('mo_hidden', location.hostname); } catch (_) {}
    closeOverlay(root);
  });

  // Calculator: live updates
  const loanInput = root.querySelector('#mo-loan');
  const paymentEl = root.querySelector('#mo-payment');
  const noteEl = root.querySelector('#mo-payment-note');
  const termBtns = root.querySelectorAll('.mo-term-btn');

  let selectedYears = 30;
  let selectedRate = rates.thirtyYear;

  function updatePayment() {
    const principal = parseFloat(loanInput?.value) || 0;
    const payment = calcPayment(principal, selectedRate, selectedYears);
    if (paymentEl) paymentEl.textContent = fmtCurrency(payment);
    if (noteEl) noteEl.textContent = `/ month · ${selectedYears}-yr @ ${selectedRate}% (P&I)`;
  }

  loanInput?.addEventListener('input', updatePayment);

  termBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      termBtns.forEach(b => b.classList.remove('mo-term-btn--active'));
      btn.classList.add('mo-term-btn--active');
      selectedYears = parseInt(btn.dataset.years, 10);
      selectedRate = parseFloat(btn.dataset.rate);
      updatePayment();
    });
  });

  // Keyboard: Escape to close
  document.addEventListener('keydown', function onKey(e) {
    if (e.key === 'Escape') {
      closeOverlay(root);
      document.removeEventListener('keydown', onKey);
    }
  });
}

// ─── Init ─────────────────────────────────────────────────────────────────────

async function init() {
  if (!document.body) return;

  // Respect "hide on this site" preference
  try {
    if (sessionStorage.getItem('mo_hidden') === location.hostname) return;
  } catch (_) {}

  // Load user settings
  const settings = await chrome.storage.sync.get({
    keywords: DEFAULT_KEYWORDS,
    enabled: true,
    triggerDelay: 1500
  });

  if (!settings.enabled) return;

  const trigger = findTriggerKeyword(settings.keywords);
  if (!trigger) return;

  // Small delay so the page finishes painting before we overlay
  setTimeout(async () => {
    const rates = await chrome.runtime.sendMessage({ type: 'GET_RATES' });
    showOverlay(trigger, rates);
  }, settings.triggerDelay);
}

// Handle SPAs that do client-side navigation
let lastUrl = location.href;
const navObserver = new MutationObserver(() => {
  if (location.href !== lastUrl) {
    lastUrl = location.href;
    overlayShown = false;
    document.getElementById('mortgage-overlay-root')?.remove();
    setTimeout(init, 800);
  }
});
navObserver.observe(document.body, { subtree: true, childList: true });

init();
