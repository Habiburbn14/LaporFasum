import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './',
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'esbuild',
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom') || id.includes('react-router')) {
              return 'vendor';
            }
            if (id.includes('lucide-react') || id.includes('react-hot-toast')) {
              return 'ui';
            }
            if (id.includes('leaflet') || id.includes('react-leaflet')) {
              return 'maps';
            }
            if (id.includes('axios') || id.includes('zustand') || id.includes('moment')) {
              return 'utils';
            }
            return 'vendor';
          }
        },
      },
    },
  },
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
