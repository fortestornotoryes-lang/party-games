// Цвета premium-* генерируются из src/shared/theme/colors.ts — npm run theme:gen
const premiumColors = require('./tailwind.colors.json');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        ...premiumColors,
        // Корневой тёмный фон (--color-bg веб-версии)
        bg: '#0b0915',
      },
      // Токены из @theme веб-версии (src/app/styles/index.css)
      borderRadius: {
        'premium-3xl': '40px',
        'premium-2xl': '32px',
        'premium-xl': '28px',
        'premium-lg': '20px',
        'premium-md': '16px',
        'premium-sm': '12px',
        'premium-xs': '6px',
      },
      fontSize: {
        pico: '6px',
        micro: '8px',
        tag: '10px',
        label: '12px',
        card: '16px',
        'sub-heading': '24px',
        heading: '28px',
        big: '32px',
        logo: '56px',
        'display-xl': '70px',
        'display-2xl': '88px',
      },
    },
  },
  plugins: [],
};
