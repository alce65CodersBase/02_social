import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import environmentPlugin from 'vite-plugin-environment';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), environmentPlugin('all')],

  css: {
    modules: {
      localsConvention: 'camelCase',
    },
  },
});
