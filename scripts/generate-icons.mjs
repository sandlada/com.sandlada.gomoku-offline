/** One-off/regenerable PWA raster icons from public/pwa-icon.svg. Usage: npm run icons */
import { readFileSync, writeFileSync } from 'node:fs'
import { Resvg } from '@resvg/resvg-js'

const src = readFileSync(new URL('../public/pwa-icon.svg', import.meta.url), 'utf8')

const render = (svg, width) =>
  new Resvg(svg, { fitTo: { mode: 'width', value: width }, background: '#f4fbf1' }).render().asPng()

/** Maskable variant: same artwork scaled to 80% for the safe zone. */
const maskable = src.replace('<g stroke=', '<g transform="translate(51.2 51.2) scale(0.8)" stroke=')

writeFileSync(new URL('../public/icon-192.png', import.meta.url), render(src, 192))
writeFileSync(new URL('../public/icon-512.png', import.meta.url), render(src, 512))
writeFileSync(new URL('../public/icon-maskable-512.png', import.meta.url), render(maskable, 512))
console.log('icons written: icon-192.png, icon-512.png, icon-maskable-512.png')
