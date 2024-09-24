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
      ...require('tailwindcss/colors'),
      text: {
        primary: '#49535b',
      },
    },
    extend: {
      fontFamily: {
        mono: 'SFMono-Regular,Consolas,Liberation Mono,Menlo,monospace',
      },
    },
  },
  plugins: [
    require('@tailwindcss/container-queries'),
    // ...
  ],
};
