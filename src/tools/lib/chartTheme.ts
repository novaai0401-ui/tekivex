// Chart theme tokens for the CSV→Chart tool.
//
// Categorical palettes are the validated reference sets (light and dark are
// separately selected steps, not an automatic flip) — validator results:
// light worst adjacent CVD ΔE 24.2 (pass); dark 10.3 (floor band, mitigated by
// the always-on legend, 2px surface gaps between marks, and the data table
// below the chart). Three light slots sit under 3:1 contrast on the surface —
// the table view is the required relief.
//
// Colors are resolved to hex in JS (not CSS vars) so exported SVG/PNG files
// are standalone and identical to what the visitor sees.

export interface ChartTheme {
  surface: string;
  inkPrimary: string;
  inkSecondary: string;
  inkMuted: string;
  grid: string;
  baseline: string;
  series: string[];
}

export const LIGHT_THEME: ChartTheme = {
  surface: '#fcfcfb',
  inkPrimary: '#0b0b0b',
  inkSecondary: '#52514e',
  inkMuted: '#898781',
  grid: '#e1e0d9',
  baseline: '#c3c2b7',
  series: ['#2a78d6', '#1baf7a', '#eda100', '#008300', '#4a3aa7', '#e34948', '#e87ba4', '#eb6834'],
};

export const DARK_THEME: ChartTheme = {
  surface: '#1a1a19',
  inkPrimary: '#ffffff',
  inkSecondary: '#c3c2b7',
  inkMuted: '#898781',
  grid: '#2c2c2a',
  baseline: '#383835',
  series: ['#3987e5', '#199e70', '#c98500', '#008300', '#9085e9', '#e66767', '#d55181', '#d95926'],
};

export function currentTheme(): ChartTheme {
  if (typeof document === 'undefined') return LIGHT_THEME;
  return document.documentElement.dataset.hubTheme === 'dark' ? DARK_THEME : LIGHT_THEME;
}
