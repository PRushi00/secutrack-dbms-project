/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          main: '#09111F',
          secondary: '#101B2D',
          elevated: '#16243A',
          card: '#121F35',
          hover: '#1B2C46',
        },
        accent: {
          primary: '#38D6C5',
          secondary: '#63A5FF',
          glow: 'rgba(56, 214, 197, 0.15)',
        },
        text: {
          primary: '#F3F7FC',
          secondary: '#A3B2C6',
          muted: '#6B7D96',
        },
        status: {
          critical: '#FF626D',
          warning: '#F5B942',
          success: '#45C99A',
          info: '#63A5FF',
        },
        border: {
          subtle: '#1E2E48',
          default: '#243652',
          highlight: '#324B70',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
        display: ['Space Grotesk', 'Plus Jakarta Sans', 'sans-serif'],
      },
      boxShadow: {
        'cyber-sm': '0 2px 8px rgba(0, 0, 0, 0.4)',
        'cyber': '0 4px 20px rgba(0, 0, 0, 0.5), 0 0 1px rgba(56, 214, 197, 0.15)',
        'cyber-lg': '0 10px 30px rgba(0, 0, 0, 0.6), 0 0 25px rgba(56, 214, 197, 0.12)',
        'accent-glow': '0 0 25px rgba(56, 214, 197, 0.25)',
      },
      borderRadius: {
        'cyber': '10px',
      }
    },
  },
  plugins: [],
}

