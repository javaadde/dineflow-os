/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,jsx,ts,tsx}', './components/**/*.{js,jsx,ts,tsx}', './features/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        background: '#f9f9f9',
        surface: '#ffffff',
        'surface-container': '#eeeeee',
        'surface-container-low': '#f3f3f3',
        'surface-container-high': '#e8e8e8',
        primary: '#B00012',
        'primary-pressed': '#84000a',
        'primary-soft': '#ffdad6',
        secondary: '#a43a43',
        coral: '#fe7f86',
        'text-primary': '#1a1c1c',
        'text-secondary': '#5c403d',
        outline: '#906f6b',
        'outline-soft': '#e5bdb9',
      },
      borderRadius: {
        card: 24,
        tray: 18,
        pill: 999,
      },
      fontFamily: {
        sans: ['PlusJakartaSans'],
      },
      spacing: {
        touch: 56,
      },
    },
  },
  plugins: [],
};
