const colors = require('tailwindcss/colors');

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    screens: {
      xs: '480px',
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1536px',
    },
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      ...colors,
      text: {
        primary: '#49535b',
      },
    },
    extend: {
      fontFamily: {
        mono: 'SFMono-Regular,Consolas,Liberation Mono,Menlo,monospace',
      },
      animation: {
        'wipe-right': 'wipe-right 0.3s ease-out',
      },
      keyframes: {
        'wipe-right': {
          '0%': { transform: 'translateX(10%)', opacity: 0 },
          '100%': { transform: 'translateX(0)', opacity: 1 },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/container-queries'),
    // ...
  ],
};
