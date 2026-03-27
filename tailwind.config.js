/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        forest: {
          DEFAULT: '#1F4D3A',
          light: '#2A6B50',
          dark: '#163828',
        },
        gold: {
          DEFAULT: '#C9A227',
          light: '#D4B44A',
          dark: '#A8861E',
        },
        slate: {
          bg: '#0F1720',
          surface: '#18222D',
          card: '#1E2A38',
          border: '#2A3A4D',
        },
        ivory: {
          bg: '#F7F4EC',
          surface: '#EEE9DD',
          card: '#E8E2D4',
          border: '#D9D1C1',
        },
        success: '#2E7D5A',
        warning: '#B78103',
        error: '#A94A4A',
        info: '#3E647F',
        ink: '#D9E1E8',
        graphite: '#1C2430',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      fontSize: {
        h1: ['2.25rem', { lineHeight: '1.2', fontWeight: '700' }],
        h2: ['1.75rem', { lineHeight: '1.25', fontWeight: '650' }],
        h3: ['1.375rem', { lineHeight: '1.3', fontWeight: '600' }],
        h4: ['1.125rem', { lineHeight: '1.35', fontWeight: '600' }],
        'body-lg': ['1rem', { lineHeight: '1.65', fontWeight: '400' }],
        body: ['0.9375rem', { lineHeight: '1.6', fontWeight: '400' }],
        caption: ['0.8125rem', { lineHeight: '1.5', fontWeight: '500' }],
        micro: ['0.75rem', { lineHeight: '1.4', fontWeight: '500' }],
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
      },
      gridTemplateColumns: {
        '13': 'repeat(13, minmax(0, 1fr))',
      },
      borderRadius: {
        DEFAULT: '8px',
      },
      transitionDuration: {
        DEFAULT: '250ms',
      },
      animation: {
        'fade-in': 'fadeIn 250ms ease-out',
        'slide-up': 'slideUp 250ms ease-out',
        'slide-in': 'slideIn 280ms ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideIn: {
          '0%': { opacity: '0', transform: 'translateX(-8px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
      },
    },
  },
  plugins: [],
}
