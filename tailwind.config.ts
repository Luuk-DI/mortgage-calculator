import { Config } from 'tailwindcss';

export default {
  content: ['./src/**/*.{vue,html}', './*.html'],
  theme: {
    screens: {
      xs: '480px',
      sm: '672px',
      md: '768px',
      lg: '1024px',
    },
    extend: {},
  },
  plugins: [],
} satisfies Config;
