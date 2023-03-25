/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{vue,html}', './*.html'],
  theme: {
    screens: {
      'sm': '640px',
      'md': '896px',
    },
    extend: {},
  },
  plugins: [],
};
