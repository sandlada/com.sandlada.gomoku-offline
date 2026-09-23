# AGENTS.md — com.sandlada.gomoku-offline

Vue 3 SPA: offline Gomoku web game (solo vs AI + local 2-player). No backend. Must work fully offline after first load.

## Commands

- `npm run dev` — Vite dev server
- `npm test` — Vitest suites (`src/game/` logic/AI/clock, `src/store/` tally/redo/saves flow); run before finishing logic changes
- `npm run check:seo` — SEO gate on `dist/` (run after `build`)
- `npm run check:i18n` — locale key-parity gate (`en` / `zh-Hant` / `zh-Hans`)
- `npm run build` — typecheck (`vue-tsc -b`) then `vite build`; always run before finishing
- `npm run preview` — serve `dist/` to verify production build
- No lint / CI configured.
- Offline PWA via `vite-plugin-pwa` (`generateSW`, precaches dist incl. fonts). Icons: `public/pwa-icon.svg` source + generated `icon-192/512.png` + `icon-maskable-512.png`; regen with `npm run icons` (`scripts/generate-icons.mjs`, `@resvg/resvg-js`).

## Current state (verified 2026-09-22)

- Entry `index.html` → `src/main.ts` → `src/App.vue`; global CSS imported in `main.ts` via `./style.css`.
- Deps installed: `pinia`, `vue-i18n`, `vue-router`, `@sandlada/material-design-css`, `@sandlada/breakpoint`, `@material-design-icons/svg`, `tailwindcss` + `@tailwindcss/vite`, `@fontsource/noto-sans`, `rxjs`, `vite-plugin-pwa`, `vitest`.
- Aliases `@components` / `@store` / `@layouts` wired in `vite.config.ts` (`resolve.alias`) + `tsconfig.app.json` (`paths` with `./src/...`, no `baseUrl` — TS 6.0 treats `baseUrl` as error TS5101).
- `tsconfig.app.json` is strict: `noUnusedLocals`, `noUnusedParameters`, `noFallthroughCasesInSwitch`, `erasableSyntaxOnly` (no enums, namespaces, or TS parameter properties).

## Target stack (installed)

- `vue@^3` + `typescript` + `pinia` + `vue-i18n` (trilingual UI)
- `three` removed (spinning GridHelper backdrop confused players); board is pure CSS. Game logic stays framework-free TS so it is testable without WebGL.
- `@sandlada/material-design-css` (MD3 tokens), `@sandlada/breakpoint` (breakpoints), `tailwindcss` (Vite plugin)
- Font: Noto Sans (self-host, no Google Fonts CDN — offline requirement). Icons: `@material-design-icons/svg` (inline SVG, never icon fonts)

## Conventions

- Vue SFCs: always `<script setup lang="ts">`. Prefer pure functions + higher-order functions over classes/mutation. Game rules / AI in plain `src/game/*.ts` (no Vue imports); state in `src/store/*.ts` (Pinia).
- Each module barrel-exports via its own `index.ts`; import from the barrel, never deep relative paths across modules.
- Path aliases (`vite.config.ts` `resolve.alias` + `tsconfig.app.json` `paths`, no `baseUrl` — TS 6 errors on it): `@components/*` → `src/components/*`, `@store/*` → `src/store/*`, `@layouts/*` → `src/layouts/*`.
- Board geometry: stones sit ON line intersections. `.lines` is full-bleed with `background-position: pad + cell/2` so crossings land on cell centers; coords/stars derive from the same `--pad`/`--cell` vars — never hardcode offsets.
- Root breakpoints: `src/rootBreakpoints.ts` mirrors @sandlada defaults onto `<html data-bp-width>` + `data-bp-active`; root CSS in `src/style.css` keys off those attributes. Components may still use `matchesBreakpointCondition` locally.
- Routes in `src/views/` (vue-router): `/` home, `/setup` mode+difficulty+time select, `/game`, `/settings`. Home (non-game) screens share one uniform width.
- Clocks: pure X+Y helpers in `src/game/clock.ts`; live state in game store (`advanceClock` is the deterministic entry — interval in `GameView` only drives it).

## Styling — strict order

1. MD3 tokens from `@sandlada/material-design-css` are the source of truth for color/typography/shape. Minimalist thin-line aesthetic; do not hardcode palette values. The package ships Tailwind v4 support via `*/tw.css` (already imported in `src/style.css`): use `bg-primary` / `text-on-primary` / `bg-surface-container-lowest`, `rounded-medium` / `rounded-large`, `body-large` / `title-large` / `label-large`, etc. directly in templates or `@apply`.
2. Breakpoints only via `@sandlada/breakpoint`, never raw `@media (max-width: ...)` for layout breakpoints.
3. Tailwind: use `@reference "../style.css"` (or `./style.css` from `src/`) + `@apply` inside `<style>` / CSS files, not long utility strings in templates. Template classes only for trivial layout. `@reference "tailwindcss"` alone does NOT see MD3 `@theme`/`@utility` tokens — always reference `style.css` so `@apply bg-primary rounded-medium body-large` resolves.

## i18n (product requirement)

- Locales: `en` (default) + `zh-Hant` + `zh-Hans`. Traditional Chinese label must render literally as `傳統漢字` in the language switcher (not `繁體中文`).
- Default locale `en` on first visit; persist choice in `localStorage`; set `<html lang>` per locale (`en` / `zh-Hant` / `zh-TW` mapping — use `zh-Hant`).
- Locale files under `src/locales/<en|zh-Hant|zh-Hans>.json` with identical keys; game terminology (e.g. Black/Black stone先手, draw, resign, undo) must be fully translated, no hardcoded strings in components.

## SEO (SPA — high priority)

- All meta in `index.html` + per-locale `og:locale:alternate`, canonical, `og:*` / Twitter cards, JSON-LD `VideoGame`/`WebApplication` (offline, single/multiplayer modes), `theme-color`, `description` in all 3 languages or per-route alternates.
- Prerender or SSG the landing content so crawlers see text without JS; game canvas mounts client-only. Keep one crawlable H1 + rules/how-to-play copy; add `sitemap.xml` + `robots.txt` in `public/`.
- Title/description must not regress to `com.sandlada.gomoku-offline` placeholder.
