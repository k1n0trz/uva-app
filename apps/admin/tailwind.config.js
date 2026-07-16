const { colors, radii } = require('../../packages/tokens/colors');

/**
 * Tailwind v4 is CSS-first, but `@config` (loaded from app/globals.css) still
 * accepts a JS config. That's deliberate here: it lets the admin and the mobile
 * app read the SAME token file instead of keeping two copies of the palette
 * that quietly drift apart.
 *
 * @type {import('tailwindcss').Config}
 */
module.exports = {
  content: ['./app/**/*.{js,ts,jsx,tsx,mdx}', './components/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors,
      borderRadius: radii,
      fontFamily: {
        sans: ['var(--font-manrope)', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
