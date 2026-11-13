/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // ReportSaathi brand palette (Task 3.1)
        teal: { DEFAULT: '#0F766E' },
        amber: { DEFAULT: '#B45309' },
        green: { DEFAULT: '#15803D' },
        canvas: { DEFAULT: '#F8FAFC' },
      },
      lineHeight: {
        // Required for Devanagari vowel matra rendering (Task 3.1)
        devanagari: '1.6',
      },
      minHeight: {
        touch: '56px', // WCAG AAA min touch target
      },
      minWidth: {
        touch: '56px',
      },
    },
  },
  plugins: [],
};
