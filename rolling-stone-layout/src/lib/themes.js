// A CSS Zen Garden-style theme registry: the manuscript and layout structure
// never change, only the token set applied to the page. Swap the theme, get
// an entirely reimagined publication around the same content.

export const THEMES = [
  {
    id: 'gonzo',
    name: 'Gonzo',
    tagline: 'Bold, black-and-red newsstand rock — the default house style.',
    swatch: ['#f3efe6', '#121212', '#e0122c'],
  },
  {
    id: 'atelier',
    name: 'Atelier',
    tagline: 'Glossy fashion-book elegance — whitespace, serif, restraint.',
    swatch: ['#faf7f2', '#20140f', '#b8905a'],
  },
  {
    id: 'circuit',
    name: 'Circuit',
    tagline: 'Dark-mode tech quarterly — mono type, acid-green accents.',
    swatch: ['#0c0f0d', '#e9fbee', '#39ff8f'],
  },
  {
    id: 'ledger',
    name: 'Ledger',
    tagline: 'Literary broadsheet — warm paper, classic caslon, ink green.',
    swatch: ['#f4ecd8', '#2b2620', '#2f5233'],
  },
];

export const DEFAULT_THEME = 'gonzo';

export function buildCustomThemeVars(custom) {
  return {
    '--bg': custom.bg,
    '--paper': custom.paper,
    '--ink': custom.ink,
    '--ink-soft': custom.ink + 'b3',
    '--accent': custom.accent,
    '--accent-contrast': custom.accentContrast,
    '--rule': custom.ink,
    '--font-display': custom.fontDisplay,
    '--font-kicker': custom.fontMono,
    '--font-body': custom.fontBody,
    '--font-mono': custom.fontMono,
    '--display-tracking': '0em',
    '--kicker-tracking': '0.2em',
    '--kicker-transform': custom.kickerTransform,
    '--rule-weight': custom.ruleWeight,
    '--radius': custom.radius,
    '--folio-bg': custom.invertFolio ? custom.ink : 'transparent',
    '--folio-fg': custom.invertFolio ? custom.paper : custom.ink,
    '--hero-gradient': `linear-gradient(135deg, ${custom.paper} 0%, ${custom.accent}55 60%, ${custom.accent} 100%)`,
  };
}

export const CUSTOM_THEME_DEFAULTS = {
  bg: '#e7e2d6',
  paper: '#fffdf8',
  ink: '#1b1b1b',
  accent: '#a3123a',
  accentContrast: '#fffdf8',
  fontDisplay: "'Playfair Display', serif",
  fontBody: "'PT Serif', serif",
  fontMono: "'IBM Plex Mono', monospace",
  ruleWeight: '2px',
  radius: '0px',
  kickerTransform: 'uppercase',
  invertFolio: false,
};
