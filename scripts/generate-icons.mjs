import { mkdirSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const here = dirname(fileURLToPath(import.meta.url))
const publicDir = resolve(here, '..', 'public')
mkdirSync(publicDir, { recursive: true })

const BG = '#4a90e2'

// 512x512 ベース。チェックマークはマスカブル安全領域 (中心 80%) に収まるサイズにしている。
const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
  <rect width="512" height="512" fill="${BG}"/>
  <path d="M 150 262 L 226 338 L 366 198"
        stroke="white"
        stroke-width="46"
        stroke-linecap="round"
        stroke-linejoin="round"
        fill="none"/>
</svg>
`.trim()

const sizes = [192, 512]
for (const size of sizes) {
  const out = resolve(publicDir, `pwa-${size}x${size}.png`)
  await sharp(Buffer.from(svg)).resize(size, size).png().toFile(out)
  console.log(`wrote ${out}`)
}

// favicon と Apple Touch Icon も同じ素材から生成
await sharp(Buffer.from(svg))
  .resize(180, 180)
  .png()
  .toFile(resolve(publicDir, 'apple-touch-icon.png'))
console.log('wrote apple-touch-icon.png')

writeFileSync(resolve(publicDir, 'favicon.svg'), svg)
console.log('wrote favicon.svg')
