import { defineConfig } from 'vite';
import WindiCSS from 'vite-plugin-windicss';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        entryFileNames: `kloud.js`,
        chunkFileNames: `kloud.chunk.js`,
        assetFileNames: 'kloud.[ext]',
      },
    },
  },
  plugins: [react(), WindiCSS()],
});

