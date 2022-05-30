import { defineConfig } from 'vite-plugin-windicss';
import colors from 'windicss/colors';

export default defineConfig({
  theme: {
    extend: {
      colors: {
        gray: colors.zinc,
      },
    },
  },
});
