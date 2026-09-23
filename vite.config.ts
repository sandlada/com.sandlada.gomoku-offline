import tailwindcss from '@tailwindcss/vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'pwa-icon.svg', 'apple-touch-icon.png', 'icon-192.png', 'icon-512.png', 'icon-maskable-512.png', 'robots.txt', 'sitemap.xml'],
      manifest: {
        name: 'Gomoku Offline — Five in a Row',
        short_name: 'Gomoku',
        description: 'Free offline Gomoku (five in a row): vs AI or local 2-player. 免費離線五子棋。',
        categories: ['games', 'entertainment'],
        lang: 'en',
        dir: 'ltr',
        start_url: '.',
        scope: '.',
        display: 'standalone',
        orientation: 'any',
        background_color: '#f4fbf1',
        theme_color: '#006d38',
        icons: [
          { src: 'pwa-icon.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'any' },
          { src: 'icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
          { src: 'icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
          { src: 'icon-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
        screenshots: [
          { src: 'og-cover.png', sizes: '1200x630', type: 'image/png', form_factor: 'wide' },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,woff2,woff,json}'],
        cleanupOutdatedCaches: true,
        navigateFallback: 'index.html',
        navigateFallbackDenylist: [/^\/sitemap\.xml$/, /^\/robots\.txt$/, /^\/manifest\.webmanifest$/],
      },
    }),
  ],
  resolve: {
    alias: {
      '@components': fileURLToPath(new URL('./src/components', import.meta.url)),
      '@store': fileURLToPath(new URL('./src/store', import.meta.url)),
      '@layouts': fileURLToPath(new URL('./src/layouts', import.meta.url)),
    },
  },
})
