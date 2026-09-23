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
@reference "../style.css";

.controls {
  @apply flex flex-col items-center gap-3;
}
.seg {
  @apply inline-flex gap-1 rounded-full border border-outline-variant p-1;
}
.seg button {
  @apply rounded-full px-4 py-1.5 text-sm text-on-surface-variant;
}
.seg button.active {
  @apply bg-primary-container text-on-primary-container;
}
.row {
  @apply flex flex-wrap justify-center gap-2;
}
.btn {
  @apply inline-flex items-center gap-1.5 rounded-full border border-outline px-4 py-1.5 text-sm text-on-surface;
}
.btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}
.btn.primary {
  @apply border-transparent bg-primary text-on-primary;
}
</style>
