import { readFileSync } from 'node:fs'

/** SEO gate: crawlers must see these in dist/index.html without JS. Usage: npm run check:seo (after build) */
const required = ['<title>', 'name="description"', 'rel="canonical"', 'og:locale:alternate', 'application/ld+json', '<h1>', 'theme-color', 'manifest']
const h = readFileSync(new URL('../dist/index.html', import.meta.url), 'utf8')
const missing = required.filter((s) => !h.includes(s))

const manifest = readFileSync(new URL('../dist/manifest.webmanifest', import.meta.url), 'utf8')
if (!manifest.includes('五子棋')) missing.push('manifest-cjk')

if (missing.length > 0) {
  console.error(`SEO gate failed, missing: ${missing.join(', ')}`)
  process.exit(1)
}
console.log('SEO gate passed')
