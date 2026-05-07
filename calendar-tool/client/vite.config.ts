import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/auth': 'http://localhost:3001',
      '/calendar': 'http://localhost:3001',
      '/availability': 'http://localhost:3001',
    },
  },
});
