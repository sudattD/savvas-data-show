/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        // Editorial display serif with optical sizes — used for hero / story headlines
        display: ['"Fraunces"', '"Charter"', 'Georgia', 'serif'],
        // Workhorse body sans
        sans: ['"Inter"', 'system-ui', '-apple-system', 'sans-serif'],
        // Tabular numerals + code
        mono: ['"JetBrains Mono"', '"SF Mono"', 'ui-monospace', 'monospace'],
      },
      colors: {
        // Brand navy — Savvas-aligned, slightly deepened for digital
        brand: {
          50: '#F1F4FB',
          100: '#DCE3F2',
          200: '#B7C3E1',
          300: '#8C9DCB',
          400: '#5C71AC',
          500: '#39518A',
          600: '#27396B',
          700: '#1A2A52',
          800: '#101F3F',
          900: '#0A1530',
          950: '#050B1F',
        },
        // Warm amber accent — Savvas's signature highlight color
        accent: {
          50: '#FEF7E8',
          100: '#FDECC4',
          200: '#FBD78A',
          300: '#F8BC4D',
          400: '#F3A220',
          500: '#E18809',
          600: '#B96606',
          700: '#944A0A',
          800: '#7A3C0F',
          900: '#67340F',
        },
        // Warm off-white surfaces (newsprint feel, not pure white)
        surface: {
          DEFAULT: '#FAF7F1',
          raised: '#FFFFFF',
          subtle: '#F2EFE7',
          line: '#E5E0D2',
        },
        // Ink colors — dark navy / charcoal
        ink: {
          DEFAULT: '#0E1E33',
          soft: '#3A4866',
          muted: '#6A788F',
          faint: '#9CA6B8',
        },
      },
      letterSpacing: {
        widestnum: '0.18em',
      },
      boxShadow: {
        editorial: '0 1px 0 rgba(10, 21, 48, 0.04), 0 6px 14px -8px rgba(10, 21, 48, 0.10)',
        masthead: '0 1px 0 rgba(10, 21, 48, 0.06)',
      },
      animation: {
        marquee: 'marquee 18s linear infinite',
      },
      maxWidth: {
        prose: '65ch',
        article: '40rem',
      },
    },
  },
  plugins: [],
}
