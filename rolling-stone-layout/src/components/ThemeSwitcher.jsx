import { THEMES } from '../lib/themes.js';

export default function ThemeSwitcher({ activeThemeId, customThemes, onSelect, onNewTheme }) {
  const all = [...THEMES, ...customThemes];
  return (
    <div className="panel-section">
      <h3>Theme</h3>
      <p className="panel-hint">
        Same manuscript, same layout logic, a completely different publication — pick a preset or
        design your own.
      </p>
      <div className="theme-grid">
        {all.map((t) => (
          <button
            type="button"
            key={t.id}
            className={`theme-card ${t.id === activeThemeId ? 'active' : ''}`}
            onClick={() => onSelect(t.id)}
          >
            <span className="theme-swatch">
              {t.swatch.map((c, i) => (
                <span key={i} style={{ background: c }} />
              ))}
            </span>
            <span className="theme-name">{t.name}</span>
            <span className="theme-tagline">{t.tagline}</span>
          </button>
        ))}
        <button type="button" className="theme-card theme-card--new" onClick={onNewTheme}>
          <span className="theme-name">+ New theme</span>
          <span className="theme-tagline">Build a custom palette &amp; type system.</span>
        </button>
      </div>
    </div>
  );
}
