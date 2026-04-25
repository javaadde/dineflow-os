/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,jsx,ts,tsx}', './components/**/*.{js,jsx,ts,tsx}', './features/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        background: '#f5f0df',
        surface: '#fdf9f2',
        'surface-container': '#ebe4d4',
        'surface-container-low': '#f2ece2',
        'surface-container-high': '#e4dcc8',
        primary: '#d94624',
        'primary-pressed': '#a9351b',
        'primary-soft': '#ffdcce',
        secondary: '#8b3a35',
        coral: '#e87f86',
        'text-primary': '#1a1614',
        'text-secondary': '#5c4845',
        outline: '#8b756b',
        'outline-soft': '#d4b59f',
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
