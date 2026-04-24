/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50:  '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
          950: '#052e16',
        },
        teal: {
          400: '#2dd4bf',
          500: '#14b8a6',
          600: '#0d9488',
        },
        dark: {
          900: '#0a0f1e',
          800: '#0d1526',
          700: '#111c32',
          600: '#162040',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Plus Jakarta Sans', 'Inter', 'sans-serif'],
      },
      backgroundImage: {
        'hero-gradient': 'linear-gradient(135deg, #0a0f1e 0%, #0d2818 50%, #0a0f1e 100%)',
        'card-gradient': 'linear-gradient(135deg, rgba(22,163,74,0.08) 0%, rgba(13,148,136,0.08) 100%)',
        'green-glow': 'radial-gradient(ellipse at center, rgba(34,197,94,0.15) 0%, transparent 70%)',
      },
      animation: {
        'fade-up':    'fadeUp 0.6s ease-out forwards',
        'fade-in':    'fadeIn 0.8s ease-out forwards',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4,0,0.6,1) infinite',
        'float':      'float 6s ease-in-out infinite',
        'count-up':   'countUp 2s ease-out forwards',
        'slide-right':'slideRight 0.5s ease-out forwards',
      },
      keyframes: {
        fadeUp: {
          '0%':   { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':      { transform: 'translateY(-12px)' },
        },
        slideRight: {
          '0%':   { opacity: '0', transform: 'translateX(-20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
      },
      boxShadow: {
        'glow-green': '0 0 30px rgba(34,197,94,0.25)',
        'glow-sm':    '0 0 15px rgba(34,197,94,0.15)',
        'card':       '0 4px 24px rgba(0,0,0,0.4)',
        'card-hover': '0 8px 40px rgba(34,197,94,0.2)',
      },
    },
  },
  plugins: [],
}
