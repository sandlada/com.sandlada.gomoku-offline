import { readFileSync } from 'node:fs'

/** i18n gate: all locales must expose identical key paths. */
const keys = (obj, prefix = '') =>
  Object.entries(obj).flatMap(([k, v]) =>
    v !== null && typeof v === 'object' ? keys(v, `${prefix}${k}.`) : [`${prefix}${k}`],
  )

const locales = ['en', 'zh-Hant', 'zh-Hans']
const sets = new Map(
  locales.map((l) => {
    const json = JSON.parse(readFileSync(new URL(`../src/locales/${l}.json`, import.meta.url), 'utf8'))
    return [l, new Set(keys(json))]
  }),
)
const base = [...sets.get('en')].sort()
const bad = locales.filter((l) => {
  const s = [...sets.get(l)].sort()
  return s.length !== base.length || s.some((k, i) => k !== base[i])
})
if (bad.length > 0) {
  console.error(`i18n gate failed for: ${bad.join(', ')}`)
  process.exit(1)
}
console.log(`i18n gate passed (${base.length} keys x ${locales.length} locales)`)
