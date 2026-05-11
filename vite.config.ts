import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// GitHub Pages のプロジェクトサイト (https://<user>.github.io/task-board-/) に
// 配信するため、本番ビルド時のみアセットパスを /task-board-/ にする。
// dev サーバーはルート (/) のままで動かす。
export default defineConfig(({ command }) => ({
  base: command === 'build' ? '/task-board-/' : '/',
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'apple-touch-icon.png'],
      manifest: {
        name: 'Task Board',
        short_name: 'Tasks',
        description: 'シンプルなタスク管理ボード(オフライン対応)',
        theme_color: '#4a90e2',
        background_color: '#ffffff',
        display: 'standalone',
        orientation: 'portrait',
        lang: 'ja',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable',
          },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,ico,webp,woff,woff2}'],
      },
    }),
  ],
}))
