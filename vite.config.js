import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import FullReload from 'vite-plugin-full-reload'

// Use repo name as base for GitHub Pages. Can override via BASE_PATH env var.
const base = process.env.BASE_PATH || '/mcclelland/'

// https://vite.dev/config/
export default defineConfig({
  base,
  plugins: [
    vue(),
    FullReload([
      'public/**/*.json',
      'public/**/*.js',
      'public/**/*.css',
      'public/**/*.html',
      'src/**/*.css'
    ])
  ],
  server: {
    watch: {
      ignored: ['!**/public/**']
    }
  }
})
