const { colors, radii } = require('../../packages/tokens/colors');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,jsx,ts,tsx}', './components/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      // Single source of truth for both apps — see packages/tokens/colors.js
      colors,
      borderRadius: radii,
      fontFamily: {
        sans: ['Manrope_500Medium'],
        regular: ['Manrope_400Regular'],
        medium: ['Manrope_500Medium'],
        semibold: ['Manrope_600SemiBold'],
        bold: ['Manrope_700Bold'],
        extrabold: ['Manrope_800ExtraBold'],
      },
    },
  },
  plugins: [],
};
