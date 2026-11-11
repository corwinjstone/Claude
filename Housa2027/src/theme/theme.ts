'use client';
import { createTheme, type PaletteOptions } from '@mui/material/styles';
import tokens from './m3-tokens.json';

export type M3Scheme = typeof tokens.light;

// Fee-chart series colors (validated for CVD separation on each surface; see dataviz palette check).
export interface ChartColors { cash: string; agent: string; buyerAgent: string; platform: string; closing: string }
const chart: Record<'light' | 'dark', ChartColors> = {
  light: { cash: '#008300', agent: '#2a78d6', buyerAgent: '#eb6834', platform: '#6250d6', closing: '#8f9099' },
  dark: { cash: '#1d9a4f', agent: '#3987e5', buyerAgent: '#d95926', platform: '#9085e9', closing: '#5d5e66' },
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

// M3 type scale, in rem so it follows the user's browser font size (dynamic type).
const rem = (px: number) => `${px / 16}rem`;
const type = (size: number, line: number, weight = 400, tracking = 0) => ({
  fontSize: rem(size), lineHeight: rem(line), fontWeight: weight, letterSpacing: `${tracking / size}em`,
});

export const theme = createTheme({
  cssVariables: { colorSchemeSelector: 'class' },
  colorSchemes: { light: { palette: palette(tokens.light, 'light') }, dark: { palette: palette(tokens.dark, 'dark') } },
  shape: { borderRadius: 12 },
  typography: {
    fontFamily: 'Roboto, "Roboto Flex", "Segoe UI", system-ui, -apple-system, "Helvetica Neue", Arial, sans-serif',
    display: { ...type(45, 52), fontVariantNumeric: 'tabular-nums' },
    moneyHero: { ...type(57, 64, 500, -0.25), fontVariantNumeric: 'tabular-nums' },
    h1: type(36, 44),
    h2: type(32, 40),
    h3: type(28, 36),
    h4: type(24, 32),
    h5: type(22, 28),
    h6: type(16, 24, 500, 0.15),
    subtitle1: type(16, 24, 500, 0.15),
    subtitle2: type(14, 20, 500, 0.1),
    body1: type(16, 24, 400, 0.5),
    body2: type(14, 20, 400, 0.25),
    button: { ...type(14, 20, 500, 0.1), textTransform: 'none' },
    caption: type(12, 16, 400, 0.4),
    overline: { ...type(12, 16, 500, 0.5), textTransform: 'none' },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: (t) => ({
        body: { backgroundColor: t.vars?.palette.m3.surface },
        ':focus-visible': { outline: `3px solid ${t.vars?.palette.m3.primary}`, outlineOffset: 2 },
      }),
    },
    MuiButtonBase: { defaultProps: { disableRipple: false } },
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: {
        root: { borderRadius: 999, minHeight: 48, paddingInline: 24 },
        sizeSmall: { minHeight: 40, paddingInline: 16 },
      },
    },
    MuiIconButton: { styleOverrides: { root: { minWidth: 48, minHeight: 48 } } },
    // M3 segmented button colors.
    MuiToggleButton: {
      styleOverrides: {
        root: ({ theme: t }) => ({
          minHeight: 48, textTransform: 'none', fontSize: rem(14), fontWeight: 500,
          color: t.vars?.palette.m3.onSurface, borderColor: t.vars?.palette.m3.outline,
          '&.Mui-selected, &.Mui-selected:hover': { backgroundColor: t.vars?.palette.m3.secondaryContainer, color: t.vars?.palette.m3.onSecondaryContainer },
        }),
      },
    },
    MuiCard: {
      defaultProps: { variant: 'outlined' },
      styleOverrides: {
        root: ({ theme: t }) => ({
          borderRadius: 12,
          backgroundColor: t.vars?.palette.m3.surfaceContainerLow,
          borderColor: t.vars?.palette.m3.outlineVariant,
        }),
      },
    },
    MuiPaper: { styleOverrides: { rounded: { borderRadius: 12 } } },
    MuiChip: { styleOverrides: { root: { borderRadius: 8, height: 32 } } },
    MuiTextField: { defaultProps: { variant: 'outlined', fullWidth: true } },
    MuiOutlinedInput: { styleOverrides: { root: { borderRadius: 4, minHeight: 56 } } },
    MuiSlider: {
      styleOverrides: {
        root: { height: 4, paddingBlock: 22 },
        thumb: { width: 20, height: 20, '&::before': { boxShadow: 'none' } },
        rail: ({ theme: t }) => ({ opacity: 1, backgroundColor: t.vars?.palette.m3.secondaryContainer }),
      },
    },
    MuiAppBar: {
      defaultProps: { elevation: 0, color: 'inherit' },
      styleOverrides: { root: ({ theme: t }) => ({ backgroundColor: t.vars?.palette.m3.surfaceContainer, color: t.vars?.palette.m3.onSurface }) },
    },
    MuiTooltip: {
      defaultProps: { arrow: false, enterTouchDelay: 0, leaveTouchDelay: 6000 },
      styleOverrides: {
        tooltip: ({ theme: t }) => ({
          backgroundColor: t.vars?.palette.m3.inverseSurface,
          color: t.vars?.palette.m3.inverseOnSurface,
          fontSize: rem(14), lineHeight: rem(20), padding: '8px 12px', borderRadius: 4, maxWidth: 320,
        }),
      },
    },
    MuiDialog: { styleOverrides: { paper: { borderRadius: 28 } } },
    MuiAlert: { styleOverrides: { root: { borderRadius: 12 } } },
  },
});
