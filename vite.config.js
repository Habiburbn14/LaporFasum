import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://98rp1d00-8000.asse.devtunnels.ms',
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
