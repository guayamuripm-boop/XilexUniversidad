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
          DEFAULT: '#00b4d8',
          dark: '#0891b2',
          light: '#e0f7fa',
          50: '#ecfeff',
          100: '#cffafe',
          200: '#a5f3fc',
          300: '#67e8f9',
          400: '#22d3ee',
          500: '#00b4d8',
          600: '#0891b2',
          700: '#0e7490',
          800: '#155e75',
          900: '#164e63',
          950: '#083344',
        },
        graphite: {
          50: '#f6f7f9',
          100: '#eceef1',
          200: '#d5d8e0',
          300: '#b0b6c5',
          400: '#858ea5',
          500: '#66708a',
          600: '#515a72',
          700: '#434a5d',
          800: '#3a3f4f',
          900: '#1e2028',
          925: '#16181d',
          950: '#0f1117',
        },
        accent: {
          emerald: '#34d399',
          amber: '#fbbf24',
          rose: '#fb7185',
          violet: '#a78bfa',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
      },
      backgroundImage: {
        'dark-gradient': 'linear-gradient(135deg, #0f1117 0%, #16181d 50%, #0f1117 100%)',
        'dark-radial': 'radial-gradient(ellipse at 20% 50%, rgba(0,180,216,0.08) 0%, transparent 50%), radial-gradient(ellipse at 80% 20%, rgba(52,211,153,0.05) 0%, transparent 50%)',
        'glass-gradient': 'linear-gradient(135deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%)',
        'glass-border': 'linear-gradient(135deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.04) 100%)',
      },
      boxShadow: {
        'glass': '0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.06)',
        'glass-sm': '0 4px 16px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.04)',
        'glass-lg': '0 12px 48px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.08)',
        'glow': '0 0 20px rgba(0, 180, 216, 0.15)',
        'glow-sm': '0 0 10px rgba(0, 180, 216, 0.1)',
      },
    },
  },
  plugins: [],
}
