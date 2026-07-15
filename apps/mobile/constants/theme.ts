/**
 * Design tokens mirrored 1:1 from the approved design-handoff prototype
 * (frontend/Diseño original sin Bootstrap-handoff.zip -> project/UVA App.dc.html)
 * and data/prompt-claude.txt section 3 (Identidad visual).
 *
 * Keep this in sync with tailwind.config.js `theme.extend.colors` — this file
 * exists for the places Tailwind classes can't reach (SVG fills, Animated
 * interpolations, chart colors, native driver values).
 */
export const colors = {
  primary: '#CD2F62',
  primaryDark: '#9E234C',
  primarySoft: '#FBE8EF',
  primaryXSoft: '#FFF5F8',
  primaryBorder: '#F3D9E3',

  ink: '#282326',
  inkSecondary: '#6F666B',
  inkFaint: '#C9BEC4',

  border: '#EDE4E8',

  surface: '#FCFAFB',
  surfaceContent: '#FFF9FB',
  white: '#FFFFFF',

  success: '#5B8A72',
  successSoft: '#E7F0EA',

  warning: '#C9974A',
  warningSoft: '#FDF1E3',

  danger: '#B8464B',
  dangerSoft: '#FBEAEA',
  dangerBorder: '#F1D2D2',
} as const;

export const radii = {
  input: 12,
  card: 16,
  cardLg: 20,
  sheet: 24,
  pill: 9999,
} as const;

export const touchTarget = {
  min: 44,
} as const;

export const fonts = {
  regular: 'Manrope_400Regular',
  medium: 'Manrope_500Medium',
  semibold: 'Manrope_600SemiBold',
  bold: 'Manrope_700Bold',
  extrabold: 'Manrope_800ExtraBold',
} as const;

export type ThemeColor = keyof typeof colors;
