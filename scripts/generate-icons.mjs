/** Regenerable brand raster assets from SVG sources. Usage: npm run icons */
import { readFileSync, writeFileSync } from 'node:fs'
import { Resvg } from '@resvg/resvg-js'

const src = readFileSync(new URL('../public/pwa-icon.svg', import.meta.url), 'utf8')

const render = (svg, width) =>
  new Resvg(svg, { fitTo: { mode: 'width', value: width }, background: '#f4fbf1' }).render().asPng()

/** Maskable variant: whole artwork group scaled to 80% for the safe zone (background stays full-bleed). */
const maskable = src.replace('<g id="artwork">', '<g id="artwork" transform="translate(51.2 51.2) scale(0.8)">')

writeFileSync(new URL('../public/icon-192.png', import.meta.url), render(src, 192))
writeFileSync(new URL('../public/icon-512.png', import.meta.url), render(src, 512))
writeFileSync(new URL('../public/icon-maskable-512.png', import.meta.url), render(maskable, 512))
writeFileSync(new URL('../public/apple-touch-icon.png', import.meta.url), render(src, 180))

/** Social cover: source art carries its own background, render at exact og:image size. */
const cover = readFileSync(new URL('../public/og-cover.svg', import.meta.url), 'utf8')
writeFileSync(
  new URL('../public/og-cover.png', import.meta.url),
  new Resvg(cover, { fitTo: { mode: 'width', value: 1200 } }).render().asPng(),
)
console.log('icons written: icon-192.png, icon-512.png, icon-maskable-512.png, apple-touch-icon.png, og-cover.png')
