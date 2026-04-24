import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  base: '/Claude/',
  plugins: [react(), tailwindcss()],
  server: {
    port: 4321,
    strictPort: true,
    headers: {
      // Prevent browser from caching this app
      'Cache-Control': 'no-store, no-cache, must-revalidate',
      'Clear-Site-Data': '"cache", "storage"',
    },
  },
})
