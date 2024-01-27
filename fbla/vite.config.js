import { fileURLToPath, URL } from 'node:url'
import rewriteAll from 'vite-plugin-rewrite-all';
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5173', // Adjust this to your backend API if applicable
        changeOrigin: true,
      },
    },
    historyApiFallback: true,
  },
  plugins: [
    rewriteAll(),
    vue(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})

