import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],

  server: {
    proxy: {
      // In development: forward /api calls to Express
      // This means you don't need full URL in fetch()
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true
      }
    }
  }
})
