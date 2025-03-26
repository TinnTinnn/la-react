import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/',
  build: {
    outDir: 'dist'
  },
  publicDir: 'public',
  server: {
    // Proxy configuration for local development only
    // This helps avoid CORS issues when testing locally
    // Production environment will use direct API calls
    proxy: {
      '^https://la-react-backend.onrender.com/api': {
        target: 'https://la-react-backend.onrender.com',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^https:\/\/la-react-backend\.onrender\.com/, '')
      }
    }
  }
})