(function () {
  const { SITE, INSTRUCTORS, WORKSHOPS } = window;

  // ---------- Helpers ----------
  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const $ = (sel, root = document) => root.querySelector(sel);
  const money = (n, cur = "USD") => new Intl.NumberFormat(undefined, { style: "currency", currency: cur, maximumFractionDigits: 0 }).format(n);
  const fmtDate = (d) => d.toLocaleDateString(undefined, { weekday: "long", month: "short", day: "numeric" });
  const fmtTime = (d) => d.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });
  const fmtTz = (d) => d.toLocaleTimeString(undefined, { timeZoneName: "short" }).split(" ").pop();
  const workshopUrl = (w) => `workshop.html?id=${encodeURIComponent(w.id)}`;

  function rng(seed) {
    let s = seed >>> 0;
    return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296);
  }
  const seedOf = (str) => [...str].reduce((a, c) => (a * 31 + c.charCodeAt(0)) >>> 0, 7);

  // ---------- Artwork ----------
  // The visual idea: many muted things drifting by, one turned green and in focus.
  const LEAF = "M0,-50 C30,-28 30,28 0,50 C-30,28 -30,-28 0,-50 Z";
  const SHAPES = {
    leaves: { path: LEAF, size: 50 },
    blocks: { path: "M-40,-40 h80 v80 h-80 Z", size: 40, rx: true },
    dots: { path: "M0,-40 a40,40 0 1,0 0.01,0 Z", size: 40 },
    bubbles: { path: "M-46,-34 h92 a10,10 0 0 1 10,10 v40 a10,10 0 0 1 -10,10 h-56 l-20,18 v-18 h-16 a10,10 0 0 1 -10,-10 v-40 a10,10 0 0 1 10,-10 Z", size: 46 },
    frames: { path: "M-26,-48 h52 a10,10 0 0 1 10,10 v76 a10,10 0 0 1 -10,10 h-52 a10,10 0 0 1 -10,-10 v-76 a10,10 0 0 1 10,-10 Z", size: 48 },
    keys: { path: "M0,-44 a22,22 0 1,1 -0.01,0 Z M-6,-6 h12 v50 h-12 Z M6,20 h14 v8 h-14 Z M6,34 h10 v8 h-10 Z", size: 44 },
    sparks: { path: "M0,-48 C6,-8 8,-6 48,0 C8,6 6,8 0,48 C-6,8 -8,6 -48,0 C-8,-6 -6,-8 0,-48 Z", size: 48 }
  };

  function leafDetail(fill) {
    return `<path d="${LEAF}" fill="${fill}"/>
      <path d="M0,-46 Q3,0 0,62" stroke="rgba(40,60,10,0.55)" stroke-width="1.6" fill="none"/>
      ${[-30, -15, 0, 15, 30].map((y) => `<path d="M1,${y} Q12,${y - 8} 20,${y - 18}" stroke="rgba(40,60,10,0.35)" stroke-width="1" fill="none"/><path d="M0,${y} Q-11,${y - 8} -19,${y - 18}" stroke="rgba(40,60,10,0.35)" stroke-width="1" fill="none"/>`).join("")}`;
  }

  function heroArt(metaphor, seed) {
    const r = rng(seed);
    const shape = SHAPES[metaphor] || SHAPES.leaves;
    const muted = metaphor === "leaves" ? "#c8644a" : "rgba(255,255,255,0.5)";
    let crowd = "";
    for (let i = 0; i < 26; i++) {
      const x = 40 + r() * 340, y = 40 + r() * 460, s = 0.35 + r() * 0.45, rot = r() * 360;
      const o = (0.18 + r() * 0.35).toFixed(2);
      crowd += `<g transform="translate(${x.toFixed(0)} ${y.toFixed(0)})"><g class="drift" style="--d:${(12 + r() * 14).toFixed(1)}s;--delay:-${(r() * 20).toFixed(1)}s;--o:${o}" opacity="${o}"><path d="${shape.path}" fill="${muted}" transform="rotate(${rot.toFixed(0)}) scale(${s.toFixed(2)})"/></g></g>`;
    }
    const hero = metaphor === "leaves"
      ? leafDetail("url(#leafGrad)")
      : `<path d="${shape.path}" fill="url(#leafGrad)"/>`;
    return `<svg viewBox="0 0 420 520" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs>
        <linearGradient id="leafGrad" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#b9d878"/><stop offset="0.55" stop-color="#8db04a"/><stop offset="1" stop-color="#5e8a27"/></linearGradient>
        <filter id="lift" x="-50%" y="-50%" width="200%" height="200%"><feDropShadow dx="-10" dy="22" stdDeviation="14" flood-color="#1a0410" flood-opacity="0.55"/></filter>
      </defs>
      ${crowd}
      <g transform="translate(200 190) rotate(28) scale(2)" filter="url(#lift)"><g class="sway">${hero}</g></g>
    </svg>`;
  }

  function cardArt(metaphor, seed) {
    const r = rng(seed);
    const shape = SHAPES[metaphor] || SHAPES.leaves;
    const muted = metaphor === "leaves" ? "#c8644a" : "rgba(255,255,255,0.22)";
    const cols = 7, rows = 4;
    const focus = [4, 1];
    let out = "";
    for (let cy = 0; cy < rows; cy++) for (let cx = 0; cx < cols; cx++) {
      if (cx === focus[0] && cy === focus[1]) continue;
      const x = 24 + cx * 46 + (r() - 0.5) * 18, y = 28 + cy * 50 + (r() - 0.5) * 18;
      const rot = metaphor === "leaves" || metaphor === "sparks" ? r() * 360 : (r() - 0.5) * 20;
      out += `<path d="${shape.path}" fill="${muted}" opacity="${(0.4 + r() * 0.5).toFixed(2)}" transform="translate(${x.toFixed(0)} ${y.toFixed(0)}) rotate(${rot.toFixed(0)}) scale(${(0.24 + r() * 0.12).toFixed(2)})"/>`;
    }
    const fx = 24 + focus[0] * 46, fy = 28 + focus[1] * 50 + 22;
    const hero = metaphor === "leaves" ? leafDetail("url(#g" + seed + ")") : `<path d="${shape.path}" fill="url(#g${seed})"/>`;
    return `<svg viewBox="0 0 320 200" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs>
        <linearGradient id="g${seed}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#b9d878"/><stop offset="1" stop-color="#5e8a27"/></linearGradient>
        <filter id="s${seed}" x="-50%" y="-50%" width="200%" height="200%"><feDropShadow dx="-4" dy="10" stdDeviation="7" flood-color="#12030b" flood-opacity="0.5"/></filter>
      </defs>
      ${out}
      <g transform="translate(${fx} ${fy}) rotate(24) scale(0.9)" filter="url(#s${seed})">${hero}</g>
    </svg>`;
  }

  const check = `<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="11" fill="var(--leaf)"/><path d="M7 12.5l3.2 3.2L17 9" stroke="#2a0a1d" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

  // ---------- Shared chrome ----------
  function brandLink() {
    const [first, ...rest] = SITE.name.split(" ");
    const lines = rest.length > 1 ? [`${first} ${rest[0]}`, rest.slice(1).join(" ")] : [SITE.name];
    return `<a class="brand" href="index.html"><img class="brand-mark" src="${esc(SITE.logo)}" alt="" width="54" height="54"><span>${lines.map(esc).join("<br>")}</span></a>`;
  }
  function navLinks(extraClass = "") {
    return `<div class="nav-links ${extraClass}"><a href="index.html#workshops">Workshops</a><a class="hide-sm" href="index.html#how">How it works</a><a href="mailto:${esc(SITE.contactEmail)}">Contact</a></div>`;
  }
  function nav() {
    return `<nav class="nav" aria-label="Main">${brandLink()}${navLinks()}</nav>`;
  }
  function footer() {
    return `<footer class="footer"><div class="wrap"><span>© ${new Date().getFullYear()} ${esc(SITE.name)} · Live workshops on Zoom</span><a href="mailto:${esc(SITE.contactEmail)}">${esc(SITE.contactEmail)}</a></div></footer>`;
  }

  function lockup(w) {
    if (w.titleLines && w.eyebrow) {
      return `<h1 class="lockup"><span class="eyebrow">${esc(w.eyebrow[0])}</span><span class="big">${esc(w.titleLines[0])}</span><span class="eyebrow">${esc(w.eyebrow[1])}</span><span class="big">${esc(w.titleLines[1])}</span></h1>`;
    }
    return `<h1 class="lockup"><span class="big">${esc(w.title)}</span></h1>`;
  }

  function instructorChip(inst) {
    return `<div class="instructor-chip"><img class="avatar" src="${esc(inst.photo)}" alt="${esc(inst.name)}" width="72" height="72"><div><strong>${esc(inst.name)}</strong><span>${esc(inst.title)}</span></div></div>`;
  }
  function brands(inst) {
    return `<div class="brands"><span class="brands-label">Built at</span>${inst.brands.map((b) => `<span>${esc(b)}</span>`).join("")}</div>`;
  }

  function hero(w, { cta, intro } = {}) {
    const inst = INSTRUCTORS[w.instructor];
    const art = w.heroImage
      ? `<img class="leaves-img" src="${esc(w.heroImage)}" alt="">`
      : heroArt(w.metaphor, seedOf(w.id));
    return `<header class="hero">
      <div class="hero-card">
        <div class="hero-copy">
          ${lockup(w)}
          <p class="lead-green">${esc(w.subtitle)}</p>
          ${intro ? `<p class="hero-intro">${esc(intro)}</p>` : ""}
          ${inst ? instructorChip(inst) : ""}
          ${cta || ""}
          ${inst ? brands(inst) : ""}
        </div>
        <div class="hero-art">${art}</div>
      </div>
    </header>`;
  }

  const upcoming = (w) => (w.sessions || []).filter((s) => new Date(s.start) > new Date());

  // ---------- Listing page ----------
  function renderListing() {
    const featured = WORKSHOPS.find((w) => w.status === "open") || WORKSHOPS[0];
    const cats = ["All", ...new Set(WORKSHOPS.map((w) => w.category))];

    document.body.innerHTML = `${stage(featured)}
      <main>
        <section class="section" id="workshops"><div class="wrap">
          <div class="section-head">
            <div><p class="kicker">Workshops</p><h2>Product design, UX &amp; AI</h2></div>
            <div class="chips" role="group" aria-label="Filter by topic">${cats.map((c, i) => `<button class="chip" type="button" data-cat="${esc(c)}" aria-pressed="${i === 0}">${esc(c)}</button>`).join("")}</div>
          </div>
          <div class="grid" id="grid"></div>
        </div></section>
        <section class="section" id="how" style="padding-top:0"><div class="wrap">
          <div class="section-head"><div><p class="kicker">How it works</p><h2>Small, live and friendly</h2></div></div>
          <div class="steps">
            <div class="step"><div class="n">1</div><h3>Pick a workshop</h3><p>Every class is taught by an industry professional who builds this stuff for a living.</p></div>
            <div class="step"><div class="n">2</div><h3>Choose a day</h3><p>Sessions run live on Zoom. Times show in your own time zone.</p></div>
            <div class="step"><div class="n">3</div><h3>Show up curious</h3><p>No experience needed. Leave with something real you made yourself.</p></div>
          </div>
        </div></section>
      </main>
      ${footer()}`;

    const grid = $("#grid");
    const draw = (cat) => {
      const list = WORKSHOPS.filter((w) => cat === "All" || w.category === cat);
      grid.innerHTML = list.length ? list.map(card).join("") : `<p class="empty">Nothing here yet — check back soon.</p>`;
    };
    document.querySelectorAll(".chip").forEach((b) => b.addEventListener("click", () => {
      document.querySelectorAll(".chip").forEach((x) => x.setAttribute("aria-pressed", String(x === b)));
      draw(b.dataset.cat);
    }));
    draw("All");
    initStage(featured);
  }

  // ---------- Home stage: floating cards over the city ----------
  // Each card sits in three layers: .layer (pointer/scroll parallax), .floater (idle bob), .fcard (hover + expand source).
  function stage(featured) {
    const inst = INSTRUCTORS[featured.instructor];
    const next = upcoming(featured)[0];
    const basics = WORKSHOPS.find((w) => w.id === "product-design-basics");
    const claude = WORKSHOPS.find((w) => w.id === "all-in-on-claude-code");
    const event = (window.EVENTS || [])[0];
    const layer = (depth, cls, inner) => `<div class="layer ${cls}" style="--depth:${depth}"><div class="floater">${inner}</div></div>`;
    const hit = (panel, label) => `<button class="card-hit" type="button" data-panel="${esc(panel)}" aria-haspopup="dialog"><span class="sr">${esc(label)}</span></button>`;

    return `<header class="stage" id="top">
      <div class="stage-bg" aria-hidden="true"><img src="assets/hero-city.jpg" srcset="assets/hero-city-sm.jpg 960w, assets/hero-city.jpg 1918w" sizes="100vw" alt=""></div>
      <div class="stage-grid">
        <nav class="rail" aria-label="Main">${brandLink()}${navLinks("rail-links")}</nav>

        ${layer(8, "l-feature", `<article class="fcard feature">
          ${hit("feature", `Quick look: ${featured.title}`)}
          <img class="leaves-img" src="${esc(featured.heroImage)}" alt="">
          <div class="feature-copy">
            ${lockup(featured)}
            <p class="lead-green">${esc(featured.subtitle)}</p>
            <div class="feature-facts">
              <div><span class="mini">Price</span><span class="feature-price">${money(featured.price, featured.currency)}</span></div>
              ${next ? `<div class="feature-when"><span>${esc(fmtDate(new Date(next.start)))}</span><span>${esc(fmtTime(new Date(next.start)))} ${esc(fmtTz(new Date(next.start)))} · ${featured.durationMinutes} Min</span></div>` : ""}
            </div>
            <a class="btn btn-xl" href="${workshopUrl(featured)}#book">Reserve a Seat</a>
          </div>
        </article>`)}

        ${basics ? layer(14, "l-wide", `<article class="fcard soft wide">
          ${hit("w:" + basics.id, `Quick look: ${basics.title}`)}
          <span class="mini">Workshop</span>
          <h2 class="card-title">${esc(basics.title)}</h2>
          <p class="card-when">${esc(basics.teaser)}</p>
          <span class="peek" aria-hidden="true">+</span>
        </article>`) : ""}

        ${event ? layer(20, "l-media", `<article class="fcard media">
          ${hit("event:" + event.id, `${event.title}, ${event.city}`)}
          <img src="${esc(event.image)}" alt="${esc(event.title)} — ${esc(event.city)}, ${esc(event.dates)}">
          <span class="peek" aria-hidden="true">+</span>
        </article>`) : ""}

        ${inst ? layer(16, "l-hello", `<article class="fcard soft hello">
          ${hit("instructor", `Meet ${inst.name}`)}
          <div><span class="mini">Say hi to</span><h2 class="card-title">${esc(inst.name.split(" ")[0])}</h2></div>
          <img class="avatar" src="${esc(inst.photo)}" alt="" width="92" height="92">
        </article>`) : ""}

        ${claude ? layer(26, "l-ghost", `<article class="ghost-block">
          <span class="mini">${esc(claude.teaser)}</span>
          <h2 class="ghost-title">${esc(claude.title)}</h2>
          <button class="text-link" type="button" data-panel="w:${esc(claude.id)}" aria-haspopup="dialog">Learn more</button>
        </article>`) : ""}
      </div>
      <a class="scroll-cue" href="#workshops"><span>All workshops</span><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 9l6 6 6-6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg></a>
    </header>
    <div class="scrim" hidden></div>
    <div class="sheet" role="dialog" aria-modal="true" aria-labelledby="sheet-title" hidden>
      <button class="sheet-close" type="button" aria-label="Close"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg></button>
      <div class="sheet-body"></div>
    </div>`;
  }

  function panelContent(key, featured) {
    const chipList = (items) => `<ul class="facts on-dark">${items.map((i) => `<li>${esc(i)}</li>`).join("")}</ul>`;
    if (key === "feature") {
      const w = featured;
      const dates = upcoming(w).slice(0, 4).map((s) => {
        const d = new Date(s.start), full = s.seatsLeft <= 0;
        return full
          ? `<li class="date-row full"><span>${esc(fmtDate(d))}</span><span>${esc(fmtTime(d))}</span><span>Full</span></li>`
          : `<li><a class="date-row" href="${workshopUrl(w)}&session=${encodeURIComponent(s.id)}#book"><span>${esc(fmtDate(d))}</span><span>${esc(fmtTime(d))}</span><span>${s.seatsLeft <= 6 ? `${s.seatsLeft} left` : "Pick"} →</span></a></li>`;
      }).join("");
      return { tone: "plum", html: `
        <p class="mini">${esc(w.category)} workshop</p>
        <h2 id="sheet-title" class="sheet-title">${esc(w.title)}</h2>
        <p class="lead-green">${esc(w.subtitle)}</p>
        ${chipList([money(w.price, w.currency), `${w.durationMinutes} min`, w.format, w.level])}
        <p class="sheet-text">${esc(w.audience)}</p>
        <div class="tool-row">${w.tools.map((t) => `<span><strong>${esc(t.name)}</strong> ${esc(t.role)}</span>`).join("")}</div>
        <h3 class="sheet-sub">Upcoming dates <span class="mini">in your time zone</span></h3>
        <ul class="date-list">${dates}</ul>
        <div class="sheet-actions"><a class="btn" href="${workshopUrl(w)}#book">Reserve a Seat</a><a class="btn ghost" href="${workshopUrl(w)}">Full details</a></div>` };
    }
    if (key === "instructor") {
      const inst = INSTRUCTORS[featured.instructor];
      return { tone: "soft", html: `
        <div class="instructor-chip"><img class="avatar lg" src="${esc(inst.photo)}" alt="" width="112" height="112"><div><p class="mini">Say hi to</p><h2 id="sheet-title" class="sheet-title">${esc(inst.name)}</h2><span>${esc(inst.title)}</span></div></div>
        <div class="video">${inst.introVideoUrl ? `<iframe src="${esc(inst.introVideoUrl)}" title="Intro from ${esc(inst.name)}" allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen></iframe>` : `<div class="video-placeholder"><div class="play"><svg viewBox="0 0 24 24"><path d="M5 3l16 9-16 9z" fill="#2a0a1d"/></svg></div><span>A short hello from ${esc(inst.name.split(" ")[0])} — video coming soon</span></div>`}</div>
        <p class="sheet-text">${esc(inst.bio)}</p>
        ${brands(inst)}
        <div class="sheet-actions"><a class="btn" href="${workshopUrl(featured)}#instructor">Take a class with ${esc(inst.name.split(" ")[0])}</a></div>` };
    }
    if (key.startsWith("event:")) {
      const e = (window.EVENTS || []).find((x) => x.id === key.slice(6));
      return { tone: "soft", html: `
        <img class="sheet-img" src="${esc(e.image)}" alt="">
        <p class="mini">In person · ${esc(e.city)}</p>
        <h2 id="sheet-title" class="sheet-title">${esc(e.title)}</h2>
        ${chipList([e.dates, e.venue])}
        <p class="sheet-text">${esc(e.about)}</p>
        <div class="sheet-actions">${e.url ? `<a class="btn" href="${esc(e.url)}" target="_blank" rel="noopener">Get tickets</a>` : `<a class="btn" href="mailto:${esc(SITE.contactEmail)}?subject=${encodeURIComponent("Notify me: " + e.title + " " + e.city)}">Notify me</a>`}</div>` };
    }
    const w = WORKSHOPS.find((x) => x.id === key.slice(2));
    return { tone: "soft", html: `
      <p class="mini">${esc(w.category)} workshop${w.teaser ? ` · ${esc(w.teaser)}` : ""}</p>
      <h2 id="sheet-title" class="sheet-title">${esc(w.title)}</h2>
      <p class="lead-green">${esc(w.subtitle)}</p>
      ${chipList([`${w.durationMinutes} min`, w.format, "Registration opens soon"])}
      ${w.about ? `<p class="sheet-text">${esc(w.about)}</p>` : ""}
      <div class="sheet-actions"><a class="btn" href="mailto:${esc(SITE.contactEmail)}?subject=${encodeURIComponent("Notify me: " + w.title)}">Notify me</a><a class="btn ghost" href="#workshops" data-close>See all workshops</a></div>` };
  }

  function initStage(featured) {
    const stageEl = $(".stage"), bg = $(".stage-bg"), layers = [...document.querySelectorAll(".layer")];
    const sheet = $(".sheet"), body = $(".sheet-body", sheet), scrim = $(".scrim");
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const finePointer = matchMedia("(hover: hover) and (pointer: fine)").matches;

    // Parallax: pointer drifts the layers by depth, scroll slides the photo slower than the page.
    let tx = 0, ty = 0, mx = 0, my = 0, raf = 0;
    const paint = () => {
      mx += (tx - mx) * 0.08; my += (ty - my) * 0.08;
      const sy = Math.min(window.scrollY, stageEl.offsetHeight);
      const lift = innerWidth > 860 ? 0.012 : 0; // stacked mobile cards keep their order while scrolling
      bg.style.transform = `translate3d(${(-mx * 14).toFixed(2)}px, ${(-my * 10 + sy * 0.3).toFixed(2)}px, 0) scale(1.08)`;
      layers.forEach((l) => {
        const d = +l.style.getPropertyValue("--depth");
        l.style.transform = `translate3d(${(mx * d).toFixed(2)}px, ${(my * d - sy * d * lift).toFixed(2)}px, 0)`;
      });
      raf = Math.abs(tx - mx) + Math.abs(ty - my) > 0.001 ? requestAnimationFrame(paint) : 0;
    };
    const kick = () => { if (!raf) raf = requestAnimationFrame(paint); };
    if (!reduce) {
      if (finePointer) {
        stageEl.addEventListener("pointermove", (e) => {
          const r = stageEl.getBoundingClientRect();
          tx = ((e.clientX - r.left) / r.width - 0.5) * 2;
          ty = ((e.clientY - r.top) / r.height - 0.5) * 2;
          kick();
        });
        stageEl.addEventListener("pointerleave", () => { tx = ty = 0; kick(); });
      }
      addEventListener("scroll", () => { if (!raf) paint(); }, { passive: true });
      paint();
    }

    // Expand: the clicked card morphs into a centered sheet, and morphs back on close.
    let source = null, opener = null;
    const radius = (el) => getComputedStyle(el).borderTopLeftRadius;
    const targetRect = () => {
      const pad = innerWidth < 640 ? 12 : 24;
      const w = Math.min(720, innerWidth - pad * 2);
      Object.assign(sheet.style, { left: "0px", top: "0px", width: w + "px", height: "auto" });
      const h = Math.min(sheet.scrollHeight, innerHeight - pad * 2);
      return { left: (innerWidth - w) / 2, top: innerWidth < 640 ? innerHeight - h - pad : (innerHeight - h) / 2, width: w, height: h };
    };
    const rectStyle = (r, rad) => ({ left: r.left + "px", top: r.top + "px", width: r.width + "px", height: r.height + "px", borderRadius: rad });

    function open(key, trigger) {
      const card = trigger.closest(".fcard, .ghost-block");
      const { tone, html } = panelContent(key, featured);
      body.innerHTML = html;
      sheet.className = `sheet tone-${tone}`;
      sheet.hidden = false; scrim.hidden = false;
      sheet.style.visibility = "hidden";
      const to = targetRect();
      const from = card.getBoundingClientRect();
      sheet.style.visibility = "";
      Object.assign(sheet.style, rectStyle(to, "32px"));
      source = card; opener = trigger;
      document.body.classList.add("sheet-open");
      if (!reduce) {
        card.classList.add("is-source");
        sheet.animate([rectStyle(from, radius(card)), rectStyle(to, "32px")], { duration: 520, easing: "cubic-bezier(.2,.8,.2,1)" });
        body.animate([{ opacity: 0, transform: "translateY(12px)" }, { opacity: 1, transform: "none" }], { duration: 360, delay: 160, easing: "ease-out", fill: "backwards" });
        scrim.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 400, easing: "ease-out" });
      }
      $(".sheet-close", sheet).focus({ preventScroll: true });
    }

    function close() {
      if (sheet.hidden) return;
      const done = () => {
        sheet.hidden = true; scrim.hidden = true;
        source?.classList.remove("is-source");
        opener?.focus({ preventScroll: true });
        source = opener = null;
      };
      document.body.classList.remove("sheet-open");
      if (reduce || !source) return done();
      const to = source.getBoundingClientRect();
      body.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 160, fill: "forwards" });
      scrim.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 380, fill: "forwards" });
      const a = sheet.animate([rectStyle(sheet.getBoundingClientRect(), "32px"), rectStyle(to, radius(source))], { duration: 440, easing: "cubic-bezier(.4,0,.2,1)", fill: "forwards" });
      a.onfinish = () => { done(); a.cancel(); body.getAnimations().forEach((x) => x.cancel()); scrim.getAnimations().forEach((x) => x.cancel()); };
    }

    document.addEventListener("click", (e) => {
      const t = e.target.closest("[data-panel]");
      if (t) { e.preventDefault(); return open(t.dataset.panel, t); }
      if (e.target.closest(".sheet-close") || e.target === scrim) return close();
      if (e.target.closest("[data-close]")) close();
    });
    document.addEventListener("keydown", (e) => {
      if (sheet.hidden) return;
      if (e.key === "Escape") return close();
      if (e.key === "Tab") {
        const f = [...sheet.querySelectorAll("a[href], button, iframe")];
        const first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    });
    addEventListener("resize", () => { if (!sheet.hidden) Object.assign(sheet.style, rectStyle(targetRect(), "32px")); });
  }

  function card(w) {
    const open = w.status === "open";
    const tag = open ? "a" : "article";
    const href = open ? ` href="${workshopUrl(w)}"` : "";
    const n = open ? upcoming(w).length : 0;
    return `<${tag} class="w-card ${open ? "open" : "soon"}"${href}>
      <div class="w-art"><span class="w-badge ${open ? "open" : ""}">${open ? `${n} date${n === 1 ? "" : "s"} open` : "Coming soon"}</span>${cardArt(w.metaphor, seedOf(w.id) % 997)}</div>
      <div class="w-body">
        <span class="w-cat">${esc(w.category)}</span>
        <h3>${esc(w.title)}</h3>
        <p>${esc(w.subtitle)}</p>
        <div class="w-meta"><span>${w.durationMinutes} min · ${esc(w.format)}</span><span class="w-price">${open ? money(w.price, w.currency) : "TBA"}</span></div>
      </div>
    </${tag}>`;
  }

  // ---------- Detail page ----------
  function renderDetail() {
    const id = new URLSearchParams(location.search).get("id") || WORKSHOPS[0].id;
    const w = WORKSHOPS.find((x) => x.id === id);
    if (!w) { location.replace("index.html#workshops"); return; }
    document.title = `${w.title} · ${SITE.name}`;

    if (w.status !== "open") {
      document.body.innerHTML = `${nav()}${hero(w)}<main class="section"><div class="wrap" style="max-width:560px"><div class="booking soon-panel"><h2>Coming soon</h2><p style="color:var(--muted)">This workshop isn't on the calendar yet. Want a heads-up when it is?</p><a class="btn" href="mailto:${esc(SITE.contactEmail)}?subject=${encodeURIComponent("Notify me: " + w.title)}">Notify me</a><a href="index.html#workshops">← All workshops</a></div></div></main>${footer()}`;
      return;
    }

    const inst = INSTRUCTORS[w.instructor];
    const video = inst.introVideoUrl
      ? `<iframe src="${esc(inst.introVideoUrl)}" title="Intro from ${esc(inst.name)}" allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen></iframe>`
      : `<div class="video-placeholder"><div class="play"><svg viewBox="0 0 24 24"><path d="M5 3l16 9-16 9z" fill="#2a0a1d"/></svg></div><span>A short hello from ${esc(inst.name.split(" ")[0])} — video coming soon</span></div>`;

    document.body.innerHTML = `${nav()}
      ${hero(w, { cta: `<div class="hero-actions"><a class="btn" href="#book">Choose a date · ${money(w.price, w.currency)}</a><a class="btn ghost" href="#instructor">Meet your instructor</a></div>` })}
      <main class="section"><div class="wrap detail-grid">
        <div class="prose">
          <section>
            <p class="kicker">${esc(w.category)} workshop · ${w.durationMinutes} minutes · ${esc(w.format)}</p>
            <h2>Who it's for</h2>
            <p>${esc(w.audience)}</p>
          </section>
          <section><p class="quote">${esc(w.metaphorNote)}</p></section>
          <section>
            <h2>What you'll leave with</h2>
            <ul class="checks">${w.outcomes.map((o) => `<li>${check}<span>${esc(o)}</span></li>`).join("")}</ul>
          </section>
          <section>
            <h2>The tools, made friendly</h2>
            <div class="tools">${w.tools.map((t) => `<div class="tool"><strong>${esc(t.name)}</strong><span>${esc(t.role)}</span></div>`).join("")}</div>
            <p style="margin-top:14px">All free to start. We'll set them up together in the first few minutes — no installs, no code background needed.</p>
          </section>
          <section>
            <h2>The 90 minutes</h2>
            <ol class="agenda">${w.agenda.map((a) => `<li><span class="min">${a.minutes} min</span><span>${esc(a.label)}</span></li>`).join("")}</ol>
          </section>
          <section id="instructor">
            <div class="instructor-card">
              <div class="video">${video}</div>
              <div class="instructor-chip"><img class="avatar lg" src="${esc(inst.photo)}" alt="${esc(inst.name)}" width="112" height="112"><div><p class="kicker" style="color:rgba(255,255,255,.6);margin:0 0 4px">Your instructor</p><strong style="font-size:1.4rem">${esc(inst.name)}</strong><span>${esc(inst.title)}</span></div></div>
              <p>${esc(inst.bio)}</p>
              ${brands(inst)}
            </div>
          </section>
        </div>
        <aside class="booking" id="book" aria-label="Book a seat"></aside>
      </div></main>
      ${footer()}`;

    renderBooking(w, $("#book"));
    if (location.hash) document.getElementById(location.hash.slice(1))?.scrollIntoView();
  }

  function renderBooking(w, el) {
    const sessions = upcoming(w);
    const tz = fmtTz(new Date());
    const slots = sessions.map((s, i) => {
      const d = new Date(s.start), end = new Date(d.getTime() + w.durationMinutes * 60000);
      const full = s.seatsLeft <= 0;
      const seats = full ? "Full" : s.seatsLeft <= 6 ? `${s.seatsLeft} left` : `${s.seatsLeft} seats`;
      return `<label class="slot"><input type="radio" name="session" value="${esc(s.id)}" ${full ? "disabled" : ""}>
        <span class="slot-body"><span><span class="slot-date">${esc(fmtDate(d))}</span><span class="slot-time">${esc(fmtTime(d))} – ${esc(fmtTime(end))}</span></span><span class="slot-seats ${!full && s.seatsLeft <= 6 ? "low" : ""}">${seats}</span></span></label>`;
    }).join("");

    el.innerHTML = `
      <div class="price-row"><span class="price">${money(w.price, w.currency)}</span><span class="price-cur">${esc(w.currency)} / person</span></div>
      <ul class="facts"><li>${w.durationMinutes} min</li><li>${esc(w.format)}</li><li>${esc(w.level)}</li></ul>
      ${sessions.length ? `<form id="signup" novalidate>
        <fieldset class="slots" aria-describedby="tz"><legend class="field-label">Pick a session</legend><p class="tz-note" id="tz">Times shown in your time zone (${esc(tz)})</p>${slots}</fieldset>
        <div class="inputs">
          <label><span class="field-label">Your name</span><input class="input" name="name" autocomplete="name" required></label>
          <label><span class="field-label">Email (for your Zoom link)</span><input class="input" name="email" type="email" autocomplete="email" required></label>
          <label><span class="field-label">How do you feel about AI right now? <span style="color:var(--muted)">(optional)</span></span>
            <select class="input" name="comfort"><option value="">Choose one</option><option>Honestly a little intimidated</option><option>Curious but haven't tried much</option><option>I use it sometimes</option><option>I use it a lot</option></select></label>
        </div>
        <button class="btn block" type="submit">Reserve my seat · ${money(w.price, w.currency)}</button>
        <p class="form-error" role="alert"></p>
        <p class="fine">${SITE.checkoutUrl ? "You'll finish payment on a secure checkout page." : "Your Zoom link arrives by email before the session."} Can't make it? Switch dates up to 24 hours before.</p>
      </form>` : `<p style="color:var(--muted)">All current sessions have passed — new dates are coming soon.</p><a class="btn block" style="margin-top:16px" href="mailto:${esc(SITE.contactEmail)}?subject=${encodeURIComponent("Notify me: " + w.title)}">Notify me</a>`}`;

    const form = $("#signup", el);
    if (!form) return;
    const wanted = new URLSearchParams(location.search).get("session");
    const pre = wanted && [...form.querySelectorAll('input[name="session"]')].find((i) => i.value === wanted && !i.disabled);
    if (pre) pre.checked = true;
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const data = new FormData(form);
      const err = $(".form-error", form);
      const sessionId = data.get("session");
      const name = String(data.get("name") || "").trim();
      const email = String(data.get("email") || "").trim();
      if (!sessionId) return (err.textContent = "Pick a session to continue.");
      if (!name) return (err.textContent = "Add your name so we know who's coming.");
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return (err.textContent = "That email doesn't look quite right.");
      err.textContent = "";

      const session = sessions.find((s) => s.id === sessionId);
      const booking = { workshop: w.id, session: sessionId, name, email, comfort: data.get("comfort") || "", at: new Date().toISOString() };
      try {
        const all = JSON.parse(localStorage.getItem("bookings") || "[]");
        all.push(booking);
        localStorage.setItem("bookings", JSON.stringify(all));
      } catch (_) { /* storage unavailable; the booking still goes through */ }

      if (SITE.checkoutUrl) {
        const url = new URL(SITE.checkoutUrl);
        url.searchParams.set("prefilled_email", email);
        url.searchParams.set("client_reference_id", `${w.id}_${sessionId}`);
        location.href = url.toString();
        return;
      }
      confirmBooking(w, session, booking, el);
    });
  }

  function confirmBooking(w, session, booking, el) {
    const d = new Date(session.start);
    el.innerHTML = `<div class="confirm">
      <svg viewBox="-60 -60 120 120" aria-hidden="true"><defs><linearGradient id="cg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#b9d878"/><stop offset="1" stop-color="#5e8a27"/></linearGradient></defs><g transform="rotate(28) scale(0.95)">${leafDetail("url(#cg)")}</g></svg>
      <h3>You're in, ${esc(booking.name.split(" ")[0])}.</h3>
      <p>${esc(w.title)}<br>${esc(fmtDate(d))} at ${esc(fmtTime(d))} (${esc(fmtTz(d))})</p>
      <p>We'll send your Zoom link to <strong>${esc(booking.email)}</strong>.</p>
      <button class="btn block" type="button" id="ics">Add to calendar</button>
      <a href="index.html#workshops">Browse other workshops</a>
    </div>`;
    $("#ics", el).addEventListener("click", () => downloadIcs(w, d));
  }

  function downloadIcs(w, start) {
    const end = new Date(start.getTime() + w.durationMinutes * 60000);
    const stamp = (d) => d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
    const ics = [
      "BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//" + SITE.name + "//Workshops//EN", "BEGIN:VEVENT",
      `UID:${w.id}-${stamp(start)}@workshops`, `DTSTAMP:${stamp(new Date())}`, `DTSTART:${stamp(start)}`, `DTEND:${stamp(end)}`,
      `SUMMARY:${w.title}`, `DESCRIPTION:${w.subtitle} Zoom link will arrive by email.`, "LOCATION:Zoom", "END:VEVENT", "END:VCALENDAR"
    ].join("\r\n");
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([ics], { type: "text/calendar" }));
    a.download = `${w.id}.ics`;
    a.click();
    URL.revokeObjectURL(a.href);
  }

  // ---------- Boot ----------
  if (document.body.dataset.page === "detail") renderDetail();
  else renderListing();
})();
