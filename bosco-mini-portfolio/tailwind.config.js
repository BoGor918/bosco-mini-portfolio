const { color } = require('./src/globalVariable/colorPalette');

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'dark-blue': color.darkBlue,
        'light-blue': color.lightBlue,
        cyan: color.cyan,
        white: color.white,
        black: color.black,
        'slate-900': color.slate900,
        'slate-800': color.slate800,
        'slate-700': color.slate700,
        'slate-600': color.slate600,
        'slate-500': color.slate500,
        'slate-400': color.slate400,
        'slate-300': color.slate300,
        'gray-500': color.gray500,
        'gray-400': color.gray400,
        'gray-300': color.gray300,
        'gray-200': color.gray200,
        'gray-100': color.gray100,
        red: color.red,
      },
    },
  },
  plugins: [
    require('tailwindcss-animated')
  ],
}