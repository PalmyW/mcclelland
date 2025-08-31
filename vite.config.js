import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import FullReload from 'vite-plugin-full-reload'

const base = process.env.BASE_PATH || '/'

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
