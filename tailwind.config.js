/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eef4ff',
          100: '#d9e6ff',
          200: '#bcd2ff',
          300: '#8eb5ff',
          400: '#598eff',
          500: '#3665f6',
          600: '#2247e2',
          700: '#1a36bf',
          800: '#1b2e9b',
          900: '#1c2b7a',
        },
        dark: {
          900: '#0b0f1a',
          800: '#111827',
          700: '#1a2235',
        },
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['Space Grotesk', 'Inter', 'sans-serif'],
      },
      boxShadow: {
        'glow': '0 0 40px -10px rgba(54, 101, 246, 0.3)',
        'card': '0 4px 24px -4px rgba(0, 0, 0, 0.08)',
        'elevated': '0 12px 40px -8px rgba(0, 0, 0, 0.15)',
      },
    },
  },
  plugins: [],
};
