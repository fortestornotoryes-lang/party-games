// Цвета premium-* генерируются из src/shared/theme/colors.ts — npm run theme:gen
const premiumColors = require('./tailwind.colors.json');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: premiumColors,
    },
  },
  plugins: [],
};
