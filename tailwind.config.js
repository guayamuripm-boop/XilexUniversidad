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
        primary: '#0EA5A0',
        'primary-dark': '#0B6E6B',
        'primary-light': '#E3F5F3',
        'dark-bg': '#0B1F1E',
        'dark-surface': '#0F2D2B',
        'dark-border': '#1A3A37',
        'dark-text': '#E0F5F3',
        'dark-muted': '#6BAA9E',
        'light-bg': '#F0FDFB',
        'light-surface': '#FFFFFF',
        'light-border': '#CCF2EE',
        'light-text': '#0B1F1E',
        'light-muted': '#5D9E93',
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
      },
    },
  },
  plugins: [],
}