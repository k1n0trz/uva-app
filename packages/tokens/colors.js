/**
 * UVA design tokens — the single source of truth for both apps.
 *
 * Consumed by `apps/mobile/tailwind.config.js` and `apps/admin/tailwind.config.ts`.
 * Plain CommonJS on purpose: both Tailwind configs are evaluated by node at
 * build time, so this needs no bundler, no workspace wiring and no build step.
 *
 * Values come from the approved design-handoff prototype
 * (frontend/Diseño original sin Bootstrap-handoff.zip → project/UVA App.dc.html)
 * and data/prompt-claude.txt §3. Don't hardcode hex anywhere else — if a colour
 * isn't here, it isn't part of the system.
 */
const colors = {
  primary: {
    DEFAULT: '#CD2F62',
    dark: '#9E234C',
    soft: '#FBE8EF',
    xsoft: '#FFF5F8',
    border: '#F3D9E3',
  },
  ink: {
    DEFAULT: '#282326',
    secondary: '#6F666B',
    faint: '#C9BEC4',
  },
  border: {
    DEFAULT: '#EDE4E8',
  },
  surface: {
    DEFAULT: '#FCFAFB',
    content: '#FFF9FB',
    shell: '#F4EDEF',
  },
  success: {
    DEFAULT: '#5B8A72',
    soft: '#E7F0EA',
  },
  warning: {
    DEFAULT: '#C9974A',
    soft: '#FDF1E3',
  },
  danger: {
    DEFAULT: '#B8464B',
    soft: '#FBEAEA',
    border: '#F1D2D2',
  },
};

const radii = {
  xl: '12px',
  '2xl': '16px',
  '3xl': '20px',
  '4xl': '24px',
};

module.exports = { colors, radii };
