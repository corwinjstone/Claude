// Generates Material Design 3 color tokens from Housa's brand blue seed.
// Same algorithm as the Material Theme Builder. Run: npm run theme
import { argbFromHex, hexFromArgb, themeFromSourceColor } from '@material/material-color-utilities';
import { writeFileSync } from 'node:fs';

// Placeholder brand blue. Swap for the final brand hex and re-run.
const SEED = '#1F5FD6';

const theme = themeFromSourceColor(argbFromHex(SEED), [
  { name: 'success', value: argbFromHex('#2E7D32'), blend: true },
]);
const hex = (argb) => hexFromArgb(argb);
const n = theme.palettes.neutral;

// M3 surface-container roles (tones from the M3 spec).
const surfaces = {
  light: { surfaceDim: 87, surfaceBright: 98, surfaceContainerLowest: 100, surfaceContainerLow: 96, surfaceContainer: 94, surfaceContainerHigh: 92, surfaceContainerHighest: 90 },
  dark: { surfaceDim: 6, surfaceBright: 24, surfaceContainerLowest: 4, surfaceContainerLow: 10, surfaceContainer: 12, surfaceContainerHigh: 17, surfaceContainerHighest: 22 },
};

const build = (mode) => {
  const base = Object.fromEntries(Object.entries(theme.schemes[mode].toJSON()).map(([k, v]) => [k, hex(v)]));
  for (const [role, tone] of Object.entries(surfaces[mode])) base[role] = hex(n.tone(tone));
  const s = theme.customColors[0][mode];
  Object.assign(base, {
    success: hex(s.color), onSuccess: hex(s.onColor),
    successContainer: hex(s.colorContainer), onSuccessContainer: hex(s.onColorContainer),
  });
  return base;
};

const tokens = { seed: SEED, light: build('light'), dark: build('dark') };
writeFileSync(new URL('../src/theme/m3-tokens.json', import.meta.url), JSON.stringify(tokens, null, 2) + '\n');
console.log('Wrote src/theme/m3-tokens.json from seed', SEED);
