import { useState } from 'react';
import { CUSTOM_THEME_DEFAULTS } from '../lib/themes.js';

const DISPLAY_FONTS = [
  "'Anton', sans-serif",
  "'Archivo Black', sans-serif",
  "'Playfair Display', serif",
  "'Space Grotesk', sans-serif",
  "'Libre Caslon Text', serif",
  "'Bebas Neue', sans-serif",
];

const BODY_FONTS = [
  "'PT Serif', serif",
  "'Source Serif 4', serif",
  "'Archivo', sans-serif",
  "'Space Grotesk', sans-serif",
];

const MONO_FONTS = ["'IBM Plex Mono', monospace", "'JetBrains Mono', monospace", "'Archivo', sans-serif"];

export default function CustomThemeBuilder({ onSave, onCancel }) {
  const [form, setForm] = useState({ name: 'My Theme', ...CUSTOM_THEME_DEFAULTS });

  const set = (key) => (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setForm((f) => ({ ...f, [key]: value }));
  };

  return (
    <div className="panel-section theme-builder">
      <h3>New theme</h3>
      <label>
        Name
        <input type="text" value={form.name} onChange={set('name')} />
      </label>
      <div className="color-row">
        <label>
          Canvas
          <input type="color" value={form.bg} onChange={set('bg')} />
        </label>
        <label>
          Page
          <input type="color" value={form.paper} onChange={set('paper')} />
        </label>
        <label>
          Ink
          <input type="color" value={form.ink} onChange={set('ink')} />
        </label>
        <label>
          Accent
          <input type="color" value={form.accent} onChange={set('accent')} />
        </label>
      </div>
      <label>
        Display / headline font
        <select value={form.fontDisplay} onChange={set('fontDisplay')}>
          {DISPLAY_FONTS.map((f) => (
            <option key={f} value={f}>
              {f.split(',')[0].replace(/'/g, '')}
            </option>
          ))}
        </select>
      </label>
      <label>
        Body font
        <select value={form.fontBody} onChange={set('fontBody')}>
          {BODY_FONTS.map((f) => (
            <option key={f} value={f}>
              {f.split(',')[0].replace(/'/g, '')}
            </option>
          ))}
        </select>
      </label>
      <label>
        Kicker / mono font
        <select value={form.fontMono} onChange={set('fontMono')}>
          {MONO_FONTS.map((f) => (
            <option key={f} value={f}>
              {f.split(',')[0].replace(/'/g, '')}
            </option>
          ))}
        </select>
      </label>
      <div className="color-row">
        <label>
          Rule weight
          <select value={form.ruleWeight} onChange={set('ruleWeight')}>
            <option value="1px">Hairline</option>
            <option value="2px">Thin</option>
            <option value="4px">Bold</option>
          </select>
        </label>
        <label>
          Corners
          <select value={form.radius} onChange={set('radius')}>
            <option value="0px">Sharp</option>
            <option value="4px">Soft</option>
            <option value="12px">Round</option>
          </select>
        </label>
      </div>
      <label className="checkbox-row">
        <input type="checkbox" checked={form.invertFolio} onChange={set('invertFolio')} />
        Invert folio bar (dark footer)
      </label>
      <div className="button-row">
        <button type="button" onClick={() => onSave(form)}>
          Save theme
        </button>
        <button type="button" className="ghost" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </div>
  );
}
