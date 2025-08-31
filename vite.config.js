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
    },
    proxy: {
      '/api/afl': {
        target: 'https://aflapi.afl.com.au',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/afl/, '/afl'),
        configure: (proxy, options) => {
          proxy.on('proxyReq', (proxyReq, req, res) => {
            // Add required headers for AFL API
            proxyReq.setHeader('accept', '*/*');
            proxyReq.setHeader('accept-language', 'en-US,en;q=0.9');
            proxyReq.setHeader('account', 'afl');
            proxyReq.setHeader('cache-control', 'no-cache');
            proxyReq.setHeader('dnt', '1');
            proxyReq.setHeader('origin', 'https://www.afl.com.au');
            proxyReq.setHeader('pragma', 'no-cache');
            proxyReq.setHeader('referer', 'https://www.afl.com.au/');
            proxyReq.setHeader('user-agent', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36');
          });
        }
      }
    }
  }
})
