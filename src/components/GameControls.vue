<template>
  <div class="controls">
    <div class="seg" role="group" aria-label="mode">
      <button type="button" :class="{ active: game.mode === 'ai' }" @click="game.setMode('ai')">
        {{ t('game.modeAi') }}
      </button>
      <button type="button" :class="{ active: game.mode === 'local' }" @click="game.setMode('local')">
        {{ t('game.modeLocal') }}
      </button>
    </div>
    <div v-if="game.mode === 'ai'" class="seg" role="group" :aria-label="t('game.difficulty')">
      <button type="button" :class="{ active: game.difficulty === 'easy' }" @click="game.setDifficulty('easy')">
        {{ t('game.easy') }}
      </button>
      <button type="button" :class="{ active: game.difficulty === 'normal' }" @click="game.setDifficulty('normal')">
        {{ t('game.normal') }}
      </button>
    </div>
    <div class="row">
      <button type="button" class="btn" :disabled="!game.canUndo" @click="game.undo()">
        <GameIcon name="undo" />{{ t('game.undo') }}
      </button>
      <button type="button" class="btn" :disabled="!game.canRedo" @click="game.redo()">
        <GameIcon name="redo" />{{ t('game.redo') }}
      </button>
      <button type="button" class="btn" :disabled="game.isOver" @click="game.resign()">
        <GameIcon name="resign" />{{ t('game.resign') }}
      </button>
      <button type="button" class="btn primary" @click="game.reset()">
        <GameIcon name="restart" />{{ t('game.restart') }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useGameStore } from '@store/game'
import GameIcon from './GameIcon.vue'

const game = useGameStore()
const { t } = useI18n()
</script>

<style scoped>
@reference "tailwindcss";

.controls {
  @apply flex flex-col items-center gap-3;
}
.seg {
  @apply inline-flex rounded-full border p-1 gap-1;
  border-color: var(--md-sys-color-outline-variant);
}
.seg button {
  @apply rounded-full px-4 py-1.5 text-sm;
  color: var(--md-sys-color-on-surface-variant);
}
.seg button.active {
  background: var(--md-sys-color-primary-container);
  color: var(--md-sys-color-on-primary-container);
}
.row {
  @apply flex gap-2 flex-wrap justify-center;
}
.btn {
  @apply rounded-full border px-4 py-1.5 text-sm inline-flex items-center gap-1.5;
  border-color: var(--md-sys-color-outline);
  color: var(--md-sys-color-on-surface);
}
.btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}
.btn.primary {
  background: var(--md-sys-color-primary);
  color: var(--md-sys-color-on-primary);
  border-color: transparent;
}
</style>
