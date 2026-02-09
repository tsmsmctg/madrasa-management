import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // আপনার রিপোজিটরি নাম অনুযায়ী বেস পাথ
  base: '/madrasa-management/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    emptyOutDir: true,
    sourcemap: false
  },
  resolve: {
    alias: {
      '@': '/src',
    },
  },
})