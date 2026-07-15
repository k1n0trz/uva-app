/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,jsx,ts,tsx}', './components/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      // Tokens mirrored 1:1 from the approved design-handoff prototype
      // (frontend/Diseño original sin Bootstrap-handoff.zip -> UVA App.dc.html)
      // and data/prompt-claude.txt section 3 (Identidad visual).
      colors: {
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
      },
      borderRadius: {
        xl: '12px',
        '2xl': '16px',
        '3xl': '20px',
        '4xl': '24px',
      },
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
