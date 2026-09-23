<template>
  <div class="controls">
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
import { GameIcon } from '@components/index'

const game = useGameStore()
const { t } = useI18n()
</script>

<style scoped>
@reference "../style.css";

.controls {
  @apply flex justify-center;
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
