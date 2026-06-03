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

// ─── Calculator ───────────────────────────────────────────────────────────────

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

function esc(str) {
  return String(str).replace(/[&<>"']/g, c =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])
  );
}

// ─── House SVG illustration ────────────────────────────────────────────────────

const HOUSE_SVG = `
<svg viewBox="0 0 360 160" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" width="360" height="160">
  <defs>
    <linearGradient id="moSky" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#020817"/>
      <stop offset="100%" stop-color="#0c2040"/>
    </linearGradient>
    <linearGradient id="moGround" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#0a1c30"/>
      <stop offset="100%" stop-color="#050c18"/>
    </linearGradient>
    <radialGradient id="moWinGlow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#fbbf24" stop-opacity="0.25"/>
      <stop offset="100%" stop-color="#fbbf24" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="moMoonGlow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#e2e8f0" stop-opacity="0.3"/>
      <stop offset="100%" stop-color="#e2e8f0" stop-opacity="0"/>
    </radialGradient>
  </defs>

  <!-- Sky -->
  <rect width="360" height="132" fill="url(#moSky)"/>
  <!-- Ground -->
  <rect y="132" width="360" height="28" fill="url(#moGround)"/>

  <!-- Stars -->
  <circle cx="22"  cy="16" r="1.1" fill="#e2e8f0" opacity="0.75"/>
  <circle cx="58"  cy="34" r="0.8" fill="#e2e8f0" opacity="0.5"/>
  <circle cx="98"  cy="11" r="1.3" fill="#e2e8f0" opacity="0.85"/>
  <circle cx="143" cy="27" r="0.7" fill="#e2e8f0" opacity="0.55"/>
  <circle cx="178" cy="7"  r="1.2" fill="#e2e8f0" opacity="0.9"/>
  <circle cx="215" cy="19" r="0.8" fill="#e2e8f0" opacity="0.6"/>
  <circle cx="252" cy="13" r="1.0" fill="#e2e8f0" opacity="0.7"/>
  <circle cx="294" cy="30" r="0.7" fill="#e2e8f0" opacity="0.5"/>
  <circle cx="333" cy="9"  r="1.2" fill="#e2e8f0" opacity="0.8"/>
  <circle cx="352" cy="24" r="0.7" fill="#e2e8f0" opacity="0.55"/>
  <circle cx="72"  cy="21" r="0.6" fill="#e2e8f0" opacity="0.45"/>
  <circle cx="318" cy="17" r="0.9" fill="#e2e8f0" opacity="0.65"/>
  <circle cx="130" cy="42" r="0.7" fill="#e2e8f0" opacity="0.4"/>
  <circle cx="270" cy="44" r="0.8" fill="#e2e8f0" opacity="0.45"/>

  <!-- Moon glow -->
  <circle cx="38" cy="32" r="26" fill="url(#moMoonGlow)"/>
  <!-- Moon (crescent) -->
  <circle cx="38" cy="32" r="15" fill="#dde8f5" opacity="0.92"/>
  <circle cx="44" cy="26" r="12" fill="#020817"/>

  <!-- Left tree cluster -->
  <rect x="28" y="88" width="7" height="48" fill="#071424"/>
  <ellipse cx="31" cy="80" rx="21" ry="29" fill="#091c14"/>
  <ellipse cx="31" cy="68" rx="14" ry="20" fill="#0c2419"/>
  <ellipse cx="31" cy="60" rx="9"  ry="14" fill="#0e2d1e"/>

  <!-- Right tree cluster -->
  <rect x="322" y="92" width="7" height="44" fill="#071424"/>
  <ellipse cx="325" cy="85" rx="19" ry="26" fill="#091c14"/>
  <ellipse cx="325" cy="73" rx="13" ry="18" fill="#0c2419"/>

  <!-- ── HOUSE ── -->
  <!-- Main body -->
  <rect x="82" y="75" width="196" height="60" fill="#112034" rx="2"/>

  <!-- Roof (gable) -->
  <polygon points="72,77 180,38 288,77" fill="#0a1829"/>
  <!-- Roof fascia/overhang highlight -->
  <line x1="72" y1="77" x2="288" y2="77" stroke="#1a3050" stroke-width="1.5" opacity="0.8"/>

  <!-- Chimney -->
  <rect x="228" y="42" width="15" height="37" fill="#0a1829"/>
  <rect x="225" y="39" width="21" height="6"  fill="#0d1e32"/>

  <!-- Garage door -->
  <rect x="90" y="92" width="58" height="43" fill="#0a1829" rx="3"/>
  <line x1="90" y1="104" x2="148" y2="104" stroke="#1a3050" stroke-width="1.5"/>
  <line x1="90" y1="117" x2="148" y2="117" stroke="#1a3050" stroke-width="1.5"/>
  <line x1="119" y1="92"  x2="119" y2="135" stroke="#1a3050" stroke-width="1.5"/>
  <rect x="111" y="121" width="16" height="3" fill="#1e3a5c" rx="1.5"/>

  <!-- Front door -->
  <rect x="161" y="98" width="32" height="37" fill="#0a1829" rx="2"/>
  <rect x="161" y="98" width="32" height="10" fill="#0c2040" rx="2"/>
  <circle cx="188" cy="118" r="2.5" fill="#60a5fa" opacity="0.9"/>

  <!-- Living room window (large) -->
  <rect x="196" y="81" width="72" height="40" fill="#0a1829" rx="3"/>
  <rect x="197" y="82" width="34" height="38" fill="#fbbf24" opacity="0.10" rx="1"/>
  <rect x="233" y="82" width="34" height="38" fill="#fbbf24" opacity="0.06" rx="1"/>
  <line x1="232" y1="82"  x2="232" y2="120" stroke="#112034" stroke-width="2"/>
  <line x1="197" y1="101" x2="269" y2="101" stroke="#112034" stroke-width="1.5"/>
  <!-- Window glow on ground -->
  <ellipse cx="233" cy="135" rx="45" ry="7" fill="url(#moWinGlow)"/>

  <!-- Upper window (bedroom) -->
  <rect x="103" y="80" width="32" height="22" fill="#0a1829" rx="2"/>
  <rect x="104" y="81" width="14" height="20" fill="#fbbf24" opacity="0.18"/>
  <rect x="119" y="81" width="15" height="20" fill="#fbbf24" opacity="0.10"/>
  <line x1="118" y1="81" x2="118" y2="101" stroke="#112034" stroke-width="1.5"/>

  <!-- Porch step -->
  <rect x="155" y="133" width="44" height="5" fill="#0a1829" rx="1"/>

  <!-- Pathway -->
  <polygon points="161,138 193,138 206,160 148,160" fill="#0a1520" opacity="0.75"/>
  <!-- Driveway -->
  <polygon points="90,135 148,135 166,160 72,160" fill="#07101e" opacity="0.8"/>

  <!-- Lawn line -->
  <path d="M0,132 Q90,126 180,130 Q270,134 360,128" stroke="#0c2419" stroke-width="3" fill="none" opacity="0.9"/>
</svg>
`;

// ─── Ad unit (WSJ-style display ad) ───────────────────────────────────────────

const AD_UNIT_HTML = `
<div class="mo-ad-wrap">
  <div class="mo-ad-label">Advertisement</div>
  <div class="mo-ad-unit">
    <div class="mo-ad-inner">
      <div class="mo-ad-brand">
        <div class="mo-ad-logo">
          <svg viewBox="0 0 32 32" width="32" height="32" xmlns="http://www.w3.org/2000/svg">
            <rect width="32" height="32" rx="6" fill="#1d4ed8"/>
            <path d="M8 22 L16 10 L24 22" stroke="white" stroke-width="2.5" fill="none" stroke-linejoin="round"/>
            <circle cx="16" cy="24" r="2.5" fill="white"/>
          </svg>
        </div>
        <div class="mo-ad-brand-name">Apex&nbsp;Lending</div>
        <div class="mo-ad-sponsored">Sponsored</div>
      </div>
      <div class="mo-ad-headline">Lock in a lower rate before they rise again.</div>
      <div class="mo-ad-body">Compare personalized mortgage offers from top lenders — no hard credit pull required.</div>
      <div class="mo-ad-rate-badge">Rates from <strong>6.49% APR</strong></div>
      <a class="mo-ad-cta" href="#" onclick="return false;">Check My Rate &rarr;</a>
      <div class="mo-ad-fine">Rates vary based on credit score &amp; loan amount. Terms apply. NMLS #0000000.</div>
    </div>
  </div>
</div>
`;

// ─── Overlay HTML ─────────────────────────────────────────────────────────────

function buildOverlayHTML(triggerWord, rates) {
  const isEstimated = rates.source === 'estimated';
  const trendAbs = Math.abs(rates.trend).toFixed(2);
  const trendDir = rates.trend > 0 ? '▲' : rates.trend < 0 ? '▼' : '—';
  const trendClass = rates.trend > 0 ? 'mo-trend--up' : rates.trend < 0 ? 'mo-trend--down' : '';
  const defaultPayment = fmtCurrency(calcPayment(400000, rates.thirtyYear, 30));

  return `
  <div class="mo-panel" id="mo-panel" role="dialog" aria-label="Mortgage Rate Insights">

    <!-- Hero: house illustration -->
    <div class="mo-hero">
      ${HOUSE_SVG}
      <div class="mo-hero-overlay">
        <div class="mo-hero-text">
          <div class="mo-title">Mortgage Insights</div>
          <div class="mo-subtitle">Triggered by <span class="mo-keyword">&ldquo;${esc(triggerWord)}&rdquo;</span></div>
        </div>
      </div>
      <button class="mo-close-btn" id="mo-close" aria-label="Close overlay">
        <svg viewBox="0 0 24 24" width="14" height="14" fill="none">
          <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>
        </svg>
      </button>
    </div>

    <!-- Scrollable body -->
    <div class="mo-body">

      <!-- Rates -->
      <div class="mo-section">
        <div class="mo-section-header">
          <span class="mo-section-title">Current Rates</span>
          <span class="mo-updated">${esc(rates.lastUpdated)}${isEstimated ? ' · est.' : ''}</span>
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

      <!-- Calculator -->
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
            <div class="mo-payment-note" id="mo-payment-note">/ month &middot; 30-yr @ ${rates.thirtyYear}% (P&amp;I)</div>
          </div>
        </div>
      </div>

      <!-- Ad unit -->
      ${AD_UNIT_HTML}

    </div>

    <!-- Footer -->
    <div class="mo-footer">
      <div class="mo-footer-source">${isEstimated ? '* Add a FRED API key in settings for live rates' : 'Data: Federal Reserve Bank of St. Louis'}</div>
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

  root.querySelector('#mo-dismiss')?.addEventListener('click', () => {
    try { sessionStorage.setItem('mo_hidden', location.hostname); } catch (_) {}
    closeOverlay(root);
  });

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

  try {
    if (sessionStorage.getItem('mo_hidden') === location.hostname) return;
  } catch (_) {}

  const settings = await chrome.storage.sync.get({
    keywords: DEFAULT_KEYWORDS,
    enabled: true,
    triggerDelay: 1500
  });

  if (!settings.enabled) return;

  const trigger = findTriggerKeyword(settings.keywords);
  if (!trigger) return;

  setTimeout(async () => {
    const rates = await chrome.runtime.sendMessage({ type: 'GET_RATES' });
    showOverlay(trigger, rates);
  }, settings.triggerDelay);
}

// SPA navigation support
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
