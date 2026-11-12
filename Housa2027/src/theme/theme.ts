'use client';
import { createTheme, type PaletteOptions } from '@mui/material/styles';
import tokens from './m3-tokens.json';

export type M3Scheme = typeof tokens.light;

// Fee-chart series colors. Dark = the Housa splash look, so cash is brand lime on navy panels.
// Checked for color-blind separation and contrast on each surface (dataviz palette validator).
export interface ChartColors { cash: string; agent: string; buyerAgent: string; platform: string; closing: string }
const chart: Record<'light' | 'dark', ChartColors> = {
  light: { cash: '#2f8000', agent: '#2a78d6', buyerAgent: '#eb6834', platform: '#6250d6', closing: '#8f9099' },
  dark: { cash: '#85ff00', agent: '#3987e5', buyerAgent: '#d95926', platform: '#9085e9', closing: '#6b7a95' },
};

// The Housa slider rail from the Figma file: yellow, lime, green, then red at the expensive end.
const RAIL = {
  dark: 'linear-gradient(90deg, #fcff00 0%, #e3fc02 19%, #02fa03 25%, #96fb05 76%, #f90303 92%)',
  light: 'linear-gradient(90deg, #b8a600 0%, #7aa000 19%, #2f8000 25%, #5a9a00 76%, #d0021b 92%)', // darker so it still shows on white
};

declare module '@mui/material/styles' {
  interface Palette { m3: M3Scheme; chart: ChartColors }
  interface PaletteOptions { m3?: M3Scheme; chart?: ChartColors }
  interface TypographyVariants { display: React.CSSProperties; moneyHero: React.CSSProperties }
  interface TypographyVariantsOptions { display?: React.CSSProperties; moneyHero?: React.CSSProperties }
}
declare module '@mui/material/Typography' {
  interface TypographyPropsVariantOverrides { display: true; moneyHero: true }
}

const palette = (s: M3Scheme, mode: 'light' | 'dark'): PaletteOptions => ({
  mode,
  m3: s,
  chart: chart[mode],
  primary: { main: s.primary, contrastText: s.onPrimary, light: s.primaryContainer, dark: s.onPrimaryContainer },
  secondary: { main: s.secondary, contrastText: s.onSecondary, light: s.secondaryContainer, dark: s.onSecondaryContainer },
  error: { main: s.error, contrastText: s.onError, light: s.errorContainer, dark: s.onErrorContainer },
  success: { main: s.success, contrastText: s.onSuccess, light: s.successContainer, dark: s.onSuccessContainer },
  info: { main: s.tertiary, contrastText: s.onTertiary },
  background: { default: s.surface, paper: s.surfaceContainerLow },
  text: { primary: s.onSurface, secondary: s.onSurfaceVariant },
  divider: s.outlineVariant,
});

// Type scale, in rem so it follows the user's browser font size.
const rem = (px: number) => `${px / 16}rem`;
const type = (size: number, line: number, weight = 400, tracking = 0) => ({
  fontSize: rem(size), lineHeight: rem(line), fontWeight: weight, letterSpacing: `${tracking / size}em`,
});

// Housa brand type is Avenir (Heavy for labels and numbers, Book for sentences). Avenir ships on Apple devices;
// everywhere else the closest free match, Nunito Sans, is loaded in layout.tsx.
const FONT = 'Avenir, "Avenir Next", "Nunito Sans", "Segoe UI", system-ui, -apple-system, "Helvetica Neue", Arial, sans-serif';
const HEAVY = 800;

export const theme = createTheme({
  cssVariables: { colorSchemeSelector: 'class' },
  colorSchemes: { light: { palette: palette(tokens.light, 'light') }, dark: { palette: palette(tokens.dark, 'dark') } },
  shape: { borderRadius: 5 }, // Housa panels are 5px; sx radius units multiply this (2 = 10px, the field radius)
  typography: {
    fontFamily: FONT,
    display: { ...type(45, 52, HEAVY), fontVariantNumeric: 'tabular-nums' },
    moneyHero: { ...type(57, 64, HEAVY, -0.25), fontVariantNumeric: 'tabular-nums' },
    h1: type(36, 44, HEAVY),
    h2: type(32, 40, HEAVY),
    h3: type(28, 36, HEAVY),
    h4: type(24, 32, HEAVY),
    h5: type(22, 28, HEAVY),
    h6: type(16, 24, HEAVY, 0.15),
    subtitle1: type(16, 24, HEAVY, 0.15),
    subtitle2: type(14, 20, HEAVY, 0.1),
    body1: type(16, 24, 400, 0.3),
    body2: type(14, 20, 400, 0.2),
    button: { ...type(14, 20, HEAVY, 0.1), textTransform: 'none' },
    caption: type(12, 16, 600, 0.3),
    overline: { ...type(12, 16, HEAVY, 0.4), textTransform: 'none' },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: (t) => ({
        body: { backgroundColor: t.vars?.palette.m3.surface, WebkitFontSmoothing: 'antialiased' },
        a: { color: t.vars?.palette.success.main },
        // Lime shows on both the blue page and the navy panels.
        ':focus-visible': { outline: `3px solid ${t.vars?.palette.success.main}`, outlineOffset: 2 },
      }),
    },
    MuiButtonBase: { defaultProps: { disableRipple: false } },
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: {
        root: { borderRadius: 7, minHeight: 48, paddingInline: 24 },
        sizeSmall: { minHeight: 40, paddingInline: 16 },
        // Text and outlined buttons use the accent, not the brand blue: blue on navy is too faint to read as text.
        text: ({ theme: t }) => ({ color: t.vars?.palette.success.main }),
        outlined: ({ theme: t }) => ({ color: t.vars?.palette.m3.onSurface, borderColor: t.vars?.palette.m3.outline, borderWidth: 1.5 }),
      },
    },
    MuiIconButton: { styleOverrides: { root: { minWidth: 48, minHeight: 48 } } },
    MuiToggleButton: {
      styleOverrides: {
        root: ({ theme: t }) => ({
          minHeight: 48, textTransform: 'none', fontSize: rem(14), fontWeight: HEAVY,
          color: t.vars?.palette.m3.onSurface, borderColor: t.vars?.palette.m3.outline,
          '&.Mui-selected, &.Mui-selected:hover': { backgroundColor: t.vars?.palette.m3.secondaryContainer, color: t.vars?.palette.m3.onSecondaryContainer },
        }),
      },
    },
    MuiCard: {
      defaultProps: { variant: 'outlined' },
      styleOverrides: {
        root: ({ theme: t }) => ({
          borderRadius: 5,
          backgroundColor: t.vars?.palette.m3.surfaceContainerLow,
          borderColor: t.vars?.palette.m3.outlineVariant,
        }),
      },
    },
    MuiPaper: { styleOverrides: { rounded: { borderRadius: 5 } } },
    MuiChip: { styleOverrides: { root: { borderRadius: 10, height: 32, fontWeight: 700 } } },
    MuiTextField: { defaultProps: { variant: 'outlined', fullWidth: true } },
    MuiOutlinedInput: {
      styleOverrides: {
        // Filled fields, like the Figma inputs: a lighter panel with a 10px radius.
        root: ({ theme: t }) => ({
          borderRadius: 10, minHeight: 48, backgroundColor: t.vars?.palette.m3.surfaceContainerHighest,
          '& .MuiOutlinedInput-notchedOutline': { borderColor: t.vars?.palette.m3.outlineVariant },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: t.vars?.palette.success.main, borderWidth: 2 },
        }),
      },
    },
    MuiSlider: {
      defaultProps: { track: false },
      styleOverrides: {
        root: { height: 3, paddingBlock: 22 },
        rail: ({ theme: t }) => ({ opacity: 1, height: 3, borderRadius: 2, background: RAIL.light, ...t.applyStyles('dark', { background: RAIL.dark }) }),
        thumb: ({ theme: t }) => ({
          width: 24, height: 24, backgroundColor: t.vars?.palette.m3.onSurface, border: `3px solid ${t.vars?.palette.m3.surfaceContainerLow}`,
          boxShadow: '0 1px 5px rgba(0,0,0,0.45)', '&::before': { boxShadow: 'none' },
          '&:hover, &.Mui-focusVisible': { boxShadow: `0 0 0 6px color-mix(in srgb, ${t.vars?.palette.success.main} 35%, transparent)` },
        }),
      },
    },
    MuiAppBar: {
      defaultProps: { elevation: 0, color: 'inherit' },
      // Transparent on the blue page, like the Figma header, with a thin line under it.
      styleOverrides: { root: ({ theme: t }) => ({ backgroundColor: t.vars?.palette.m3.surface, color: t.vars?.palette.m3.onSurface, borderBottom: `1px solid ${t.vars?.palette.m3.outline}` }) },
    },
    MuiTooltip: {
      defaultProps: { arrow: false, enterTouchDelay: 0, leaveTouchDelay: 6000 },
      styleOverrides: {
        tooltip: ({ theme: t }) => ({
          backgroundColor: t.vars?.palette.m3.inverseSurface,
          color: t.vars?.palette.m3.inverseOnSurface,
          fontSize: rem(14), lineHeight: rem(20), padding: '8px 12px', borderRadius: 5, maxWidth: 320,
        }),
      },
    },
    MuiDialog: { styleOverrides: { paper: { borderRadius: 10 } } },
    MuiAlert: { styleOverrides: { root: { borderRadius: 5 } } },
  },
});
