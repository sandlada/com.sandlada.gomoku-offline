<template>
  <section class="hud" aria-live="polite">
    <div class="turn">
      <span class="pip" :class="game.result ?? game.current" />
      <p class="status">{{ status }}</p>
    </div>
    <div class="meta">
      <p class="moves">{{ t('game.moves', { count: game.moveCount }) }}</p>
      <p class="score">{{ t('game.score', { b: game.tally.black, w: game.tally.white, d: game.tally.draws }) }}</p>
    </div>
    <div v-if="game.isOver" class="banner">
      <p class="banner-title">{{ status }}</p>
      <button type="button" class="again" @click="game.reset()">
        <GameIcon name="restart" />{{ t('game.restart') }}
      </button>
    </div>
    <div v-if="game.hasClock" class="clocks">
      <p class="clock" :class="{ active: isMover('black'), low: isLow('black') }">
        <span class="pip black sm" />{{ formatClock(game.clocks?.blackMs ?? 0) }}
      </p>
      <p class="clock" :class="{ active: isMover('white'), low: isLow('white') }">
        <span class="pip white sm" />{{ formatClock(game.clocks?.whiteMs ?? 0) }}
      </p>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { formatClock } from '../game/index'
import type { Stone } from '../game/index'
import { useGameStore } from '@store/game'
import GameIcon from './GameIcon.vue'

const game = useGameStore()
const { t } = useI18n()

const stoneName = (s: 'black' | 'white'): string => t(s === 'black' ? 'game.black' : 'game.white')

const status = computed(() => {
  if (game.result === 'draw') return t('game.draw')
  if (game.timeoutBy !== null) return t('game.timeout', { stone: stoneName(game.timeoutBy) })
  if (game.result === 'black') return t('game.blackWins')
  if (game.result === 'white') return t('game.whiteWins')
  if (game.aiThinking) return t('game.thinking')
  return t('game.turn', { stone: stoneName(game.current) })
})

const isMover = (stone: Stone): boolean => !game.isOver && game.current === stone

const msOf = (stone: Stone): number =>
  stone === 'black' ? (game.clocks?.blackMs ?? 0) : (game.clocks?.whiteMs ?? 0)

const isLow = (stone: Stone): boolean => game.hasClock && msOf(stone) < 60_000
</script>

<style scoped>
@reference "tailwindcss";

.hud {
  @apply flex w-full flex-wrap items-center justify-between gap-3 border px-4 py-3;
  border-radius: var(--md-sys-shape-corner-value-large, 16px);
  border-color: var(--md-sys-color-outline-variant);
  border-width: 1px;
  background: var(--md-sys-color-surface-container-low);
}
.turn {
  @apply flex items-center gap-2.5;
}
.pip {
  width: 22px;
  height: 22px;
  border-radius: 9999px;
  flex: none;
}
.pip.black {
  background: radial-gradient(circle at 34% 30%, #5b5f66 0%, #0c0e10 100%);
  box-shadow: 0 1px 3px rgb(0 0 0 / 0.4);
}
.pip.white {
  background: radial-gradient(circle at 34% 30%, #ffffff 0%, #c3c9d1 100%);
  border: 1px solid var(--md-sys-color-outline);
}
.pip.draw {
  background: linear-gradient(135deg, #23262b 50%, #ffffff 50%);
  border: 1px solid var(--md-sys-color-outline);
}
.status {
  @apply text-sm font-medium;
  color: var(--md-sys-color-on-surface);
}
.moves {
  @apply text-xs tabular-nums;
  color: var(--md-sys-color-on-surface-variant);
}
.meta {
  @apply flex flex-col items-end gap-0.5;
}
.score {
  @apply text-xs tabular-nums;
  color: var(--md-sys-color-on-surface-variant);
}
.banner {
  @apply flex items-center gap-3;
}
.banner-title {
  @apply text-sm font-semibold;
  color: var(--md-sys-color-primary);
}
.again {
  @apply inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm;
  background: var(--md-sys-color-primary);
  color: var(--md-sys-color-on-primary);
}
.clocks {
  @apply flex items-center gap-2;
}
.clock {
  @apply flex items-center gap-1.5 rounded-full border px-3 py-1 text-sm tabular-nums;
  border-color: var(--md-sys-color-outline-variant);
  color: var(--md-sys-color-on-surface-variant);
}
.clock.active {
  background: var(--md-sys-color-primary-container);
  color: var(--md-sys-color-on-primary-container);
  border-color: transparent;
}
.clock.low {
  color: var(--md-sys-color-error);
}
.pip.sm {
  width: 14px;
  height: 14px;
}
</style>
