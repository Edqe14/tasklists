/** @type {import('tailwindcss').Config} */

module.exports = {
  darkMode: 'class',
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        jetBrainsMono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        gray: {
          50: '#ffffff',
          100: '#d6d6d6',
          200: '#adadad',
          300: '#848484',
          400: '#5b5b5b',
          500: '#323232',
          600: '#282828',
          700: '#1e1e1e',
          800: '#141414',
          900: '#0a0a0a'
        },
        scheme: 'var(--color-scheme)',
      }
    },
  },
  plugins: [],
};
