import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
  },
  publicDir: 'public',
  server: {
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true,
        headers: {
          Accept: 'application/json',
        },
      },
      // '/storage/': {
      //   target: 'http://127.0.0.1:8000', // รองรับไฟล์ทีเ่ก็บใน public storage
      //   changeOrigin: true,
      // }
    }
  }
})