/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        neutral: {
          surface0: '#1A1A1A',
          surface1: '#202020',
          surface2: '#262626',
          surface3: '#2D2D2D',
          bg0: '#0F0F0F',
          bg1: '#121212',
          bg2: '#161616',
          canvas: '#E9E9EA',
        },
        text: {
          primary: 'rgba(245,246,243,0.92)',
          secondary: 'rgba(245,246,243,0.68)',
          muted: 'rgba(245,246,243,0.46)',
          disabled: 'rgba(245,246,243,0.28)',
          'inverse-accent': 'rgba(16,16,16,0.92)',
        },
        stroke: {
          subtle: 'rgba(255,255,255,0.06)',
          default: 'rgba(255,255,255,0.10)',
          strong: 'rgba(255,255,255,0.16)',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'Arial', 'sans-serif'],
      },
      fontSize: {
        display: ['44px', { lineHeight: '1.05', letterSpacing: '-0.02em', fontWeight: '700' }],
        h1: ['22px', { lineHeight: '1.2', letterSpacing: '-0.01em', fontWeight: '650' }],
        h2: ['16px', { lineHeight: '1.25', letterSpacing: '-0.005em', fontWeight: '650' }],
        body: ['13px', { lineHeight: '1.35', fontWeight: '500' }],
        caption: ['11px', { lineHeight: '1.3', fontWeight: '500', letterSpacing: '0.01em' }],
        micro: ['10px', { lineHeight: '1.2', fontWeight: '600', letterSpacing: '0.06em' }],
      },
      borderRadius: {
        xs: '10px',
        sm: '14px',
        md: '18px',
        lg: '24px',
        xl: '32px',
        '2xl': '36px',
        pill: '999px',
      },
      boxShadow: {
        canvas: '0 18px 40px rgba(0,0,0,0.55)',
        card: '0 10px 24px rgba(0,0,0,0.45)',
        'raised-control': '0 6px 14px rgba(0,0,0,0.50)',
        'hover-lift': '0 14px 30px rgba(0,0,0,0.55)',
        'accent-glow': '0 0 18px var(--glow-color, rgba(127,221,255,0.35))',
      },
      maxWidth: {
        '7xl': '80rem',
      },
    },
  },
  plugins: [],
}
