import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// GitHub Pages のプロジェクトサイト (https://<user>.github.io/task-board-/) に
// 配信するため、本番ビルド時のみアセットパスを /task-board-/ にする。
// dev サーバーはルート (/) のままで動かす。
export default defineConfig(({ command }) => ({
  plugins: [react()],
  base: command === 'build' ? '/task-board-/' : '/',
}))
