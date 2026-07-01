import { useEffect, useMemo, useState } from 'react';
import './App.css';
import './styles/magazine.css';
import './styles/themes.css';

import { parseManuscript } from './lib/manuscriptParser.js';
import { extractPullQuotes } from './lib/quoteExtractor.js';
import { recommendCharts } from './lib/chartRecommender.js';
import { chooseTemplate, buildPages } from './lib/layoutEngine.js';
import { THEMES, DEFAULT_THEME, buildCustomThemeVars } from './lib/themes.js';
import { SAMPLE_FEATURE } from './lib/sampleManuscript.js';

import ManuscriptPanel from './components/ManuscriptPanel.jsx';
import ThemeSwitcher from './components/ThemeSwitcher.jsx';
import CustomThemeBuilder from './components/CustomThemeBuilder.jsx';
import RecommendationsPanel from './components/RecommendationsPanel.jsx';
import Magazine from './components/Magazine.jsx';

const TABS = [
  { id: 'manuscript', label: 'Manuscript' },
  { id: 'design', label: 'Theme' },
  { id: 'recommendations', label: 'Recommendations' },
];

function App() {
  const [manuscriptText, setManuscriptText] = useState(SAMPLE_FEATURE);
  const [publicationName, setPublicationName] = useState('NEWSSTAND');
  const [issueLabel, setIssueLabel] = useState('VOL. 1 — NO. 1');
  const [activeTab, setActiveTab] = useState('manuscript');

  const [activeThemeId, setActiveThemeId] = useState(DEFAULT_THEME);
  const [customThemes, setCustomThemes] = useState([]);
  const [showThemeBuilder, setShowThemeBuilder] = useState(false);

  const [featuredQuoteIds, setFeaturedQuoteIds] = useState(new Set([0, 1]));
  const [chartEnabled, setChartEnabled] = useState(true);

  const doc = useMemo(() => parseManuscript(manuscriptText), [manuscriptText]);
  const template = useMemo(() => chooseTemplate(doc), [doc]);
  const quoteCandidates = useMemo(() => extractPullQuotes(doc, 8), [doc]);
  const chartRecsAll = useMemo(() => recommendCharts(doc), [doc]);

  // When the manuscript changes, re-seed the default featured quotes rather
  // than carrying stale indices from the previous draft's candidate list.
  useEffect(() => {
    const defaultCount = template.id === 'interview' || template.id === 'listicle' ? 1 : 2;
    setFeaturedQuoteIds(new Set(quoteCandidates.slice(0, defaultCount).map((_, i) => i)));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [manuscriptText]);

  const featuredQuotes = useMemo(
    () => quoteCandidates.filter((_, i) => featuredQuoteIds.has(i)),
    [quoteCandidates, featuredQuoteIds]
  );
  const chartRecs = useMemo(
    () => (chartEnabled ? chartRecsAll.slice(0, 1) : []),
    [chartEnabled, chartRecsAll]
  );

  const pages = useMemo(
    () => buildPages(doc, { template, featuredQuotes, chartRecs }),
    [doc, template, featuredQuotes, chartRecs]
  );

  const toggleQuote = (i) => {
    setFeaturedQuoteIds((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });
  };

  const saveCustomTheme = (form) => {
    const id = `custom-${Date.now()}`;
    const vars = buildCustomThemeVars(form);
    setCustomThemes((prev) => [
      ...prev,
      {
        id,
        name: form.name || 'Custom theme',
        tagline: 'Your custom palette & type system.',
        swatch: [form.paper, form.ink, form.accent],
        vars,
      },
    ]);
    setActiveThemeId(id);
    setShowThemeBuilder(false);
  };

  const isBuiltIn = THEMES.some((t) => t.id === activeThemeId);
  const activeCustom = customThemes.find((t) => t.id === activeThemeId);
  const themeProps = isBuiltIn
    ? { 'data-theme': activeThemeId }
    : { style: activeCustom?.vars || {} };

  return (
    <div className="app-shell">
      <header className="app-toolbar">
        <div className="app-toolbar__brand">
          <strong>Newsstand</strong>
          <span>Editorial layout studio</span>
        </div>
        <div className="app-toolbar__fields">
          <label>
            Publication
            <input
              type="text"
              value={publicationName}
              onChange={(e) => setPublicationName(e.target.value.toUpperCase())}
            />
          </label>
          <label>
            Issue
            <input type="text" value={issueLabel} onChange={(e) => setIssueLabel(e.target.value)} />
          </label>
        </div>
        <button type="button" className="print-button" onClick={() => window.print()}>
          Print / Export PDF
        </button>
      </header>

      <div className="app-body">
        <aside className="app-sidebar">
          <nav className="tab-row">
            {TABS.map((t) => (
              <button
                key={t.id}
                type="button"
                className={activeTab === t.id ? 'active' : ''}
                onClick={() => setActiveTab(t.id)}
              >
                {t.label}
              </button>
            ))}
          </nav>

          {activeTab === 'manuscript' && (
            <ManuscriptPanel manuscriptText={manuscriptText} onChange={setManuscriptText} />
          )}

          {activeTab === 'design' &&
            (showThemeBuilder ? (
              <CustomThemeBuilder onSave={saveCustomTheme} onCancel={() => setShowThemeBuilder(false)} />
            ) : (
              <ThemeSwitcher
                activeThemeId={activeThemeId}
                customThemes={customThemes}
                onSelect={setActiveThemeId}
                onNewTheme={() => setShowThemeBuilder(true)}
              />
            ))}

          {activeTab === 'recommendations' && (
            <RecommendationsPanel
              doc={doc}
              template={template}
              quoteCandidates={quoteCandidates}
              featuredQuoteIds={featuredQuoteIds}
              onToggleQuote={toggleQuote}
              chartRecs={chartRecsAll}
              chartEnabled={chartEnabled}
              onToggleChart={() => setChartEnabled((v) => !v)}
              pageCount={pages.length}
            />
          )}
        </aside>

        <main className="app-preview" {...themeProps}>
          <Magazine pages={pages} publicationName={publicationName} issueLabel={issueLabel} />
        </main>
      </div>
    </div>
  );
}

export default App;
