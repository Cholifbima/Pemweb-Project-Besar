/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#e6ffec',
          100: '#b3ffcc',
          200: '#80ffad',
          300: '#4dff8d',
          400: '#1aff6e',
          500: '#22c55e', // Main green
          600: '#16a34a', // Darker green
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
        },
        secondary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8', // Soft blue
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        },
        accent: {
          yellow: '#fbbf24', // Gold/Yellow accent
          yellowDark: '#f59e42',
        },
        neutral: {
          50: '#f9fafb', // Off-white
          100: '#f3f4f6',
          200: '#e5e7eb', // Soft gray
          800: '#1f2937', // Text primary
          500: '#6b7280', // Text secondary
        },
        dark: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
          950: '#020617',
        },
        gaming: {
          purple: '#8b5cf6',
          pink: '#ec4899',
          orange: '#f97316',
          green: '#10b981',
        }
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'gaming-gradient': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        'green-gradient': 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
        'dark-gradient': 'linear-gradient(to bottom, #1e293b 0%, #0f172a 100%)',
        'dark-green-gradient': 'linear-gradient(to bottom, #166534 0%, #064e3b 100%)',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        }
      }
    },
  },
  plugins: [],
} 