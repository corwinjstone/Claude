// Builds the Housa color tokens. Run: npm run theme
//
// Brand source: the "Housa - Splash Blue" Figma file (frame "My listings").
//   Splash blue  #005FF2   page background, buttons
//   Navy panels  black at 80% over the blue, about #001330
//   Fields       white at 16% over a panel, about #293951
//   Lime         #85FF00   accent (active state, good news, cash)
//   Red          #D0021B   destructive (used for fills; text uses a lighter red to pass contrast)
//
// The "dark" scheme is the Housa brand look (blue page, navy panels) and is the default.
// The "light" scheme is a daytime variant generated from the same blue with Google's Material
// color algorithm, with a darker green standing in for lime so text stays readable.
import { argbFromHex, hexFromArgb, themeFromSourceColor } from '@material/material-color-utilities';
import { writeFileSync } from 'node:fs';

const BRAND = { blue: '#005FF2', lime: '#85FF00', navy: '#001330', field: '#293951' };

const theme = themeFromSourceColor(argbFromHex(BRAND.blue), [{ name: 'success', value: argbFromHex('#3A8A00'), blend: true }]);
const hex = (argb) => hexFromArgb(argb);
const n = theme.palettes.neutral;
const surfaceTones = { surfaceDim: 87, surfaceBright: 98, surfaceContainerLowest: 100, surfaceContainerLow: 96, surfaceContainer: 94, surfaceContainerHigh: 92, surfaceContainerHighest: 90 };

const light = Object.fromEntries(Object.entries(theme.schemes.light.toJSON()).map(([k, v]) => [k, hex(v)]));
for (const [role, tone] of Object.entries(surfaceTones)) light[role] = hex(n.tone(tone));
const s = theme.customColors[0].light;
Object.assign(light, { success: hex(s.color), onSuccess: hex(s.onColor), successContainer: hex(s.colorContainer), onSuccessContainer: hex(s.onColorContainer) });

const dark = {
  primary: BRAND.blue, onPrimary: '#ffffff', primaryContainer: BRAND.blue, onPrimaryContainer: '#ffffff',
  secondary: '#b3c6e6', onSecondary: BRAND.navy, secondaryContainer: BRAND.field, onSecondaryContainer: '#ffffff',
  tertiary: BRAND.lime, onTertiary: BRAND.navy, tertiaryContainer: '#1f3a00', onTertiaryContainer: BRAND.lime,
  error: '#ff6b78', onError: '#2d0006', errorContainer: '#5c0f1a', onErrorContainer: '#ffdadd',
  background: BRAND.blue, onBackground: '#ffffff',
  surface: BRAND.blue, onSurface: '#ffffff', surfaceVariant: BRAND.field, onSurfaceVariant: '#c4cfe2',
  outline: '#7d93bd', outlineVariant: '#1e3a6e', shadow: '#000000', scrim: '#000000',
  inverseSurface: '#ffffff', inverseOnSurface: BRAND.navy, inversePrimary: BRAND.blue,
  surfaceDim: '#00102a', surfaceBright: '#0a3d99', surfaceContainerLowest: '#000a1f',
  surfaceContainerLow: BRAND.navy, surfaceContainer: '#031a3d', surfaceContainerHigh: '#0b2550', surfaceContainerHighest: BRAND.field,
  success: BRAND.lime, onSuccess: BRAND.navy, successContainer: BRAND.navy, onSuccessContainer: '#ffffff',
};

writeFileSync(new URL('../src/theme/m3-tokens.json', import.meta.url), JSON.stringify({ brand: BRAND, light, dark }, null, 2) + '\n');
console.log('Wrote src/theme/m3-tokens.json (Housa brand dark + generated light)');
