/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['var(--font-playfair)', 'Georgia', 'serif'],
        body: ['var(--font-dm-sans)', 'sans-serif'],
        mono: ['var(--font-dm-mono)', 'monospace'],
      },
      colors: {
        brand: {
          gold: '#C9A84C',
          'gold-light': '#F0D080',
          dark: '#0A0A0A',
          charcoal: '#1A1A1A',
          gray: '#2A2A2A',
          muted: '#888888',
          cream: '#FAF7F2',
        },
      },
      typography: {
        DEFAULT: {
          css: {
            color: '#1A1A1A',
            a: { color: '#C9A84C', '&:hover': { color: '#F0D080' } },
            h1: { fontFamily: 'var(--font-playfair)' },
            h2: { fontFamily: 'var(--font-playfair)' },
            h3: { fontFamily: 'var(--font-playfair)' },
          },
        },
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
};
