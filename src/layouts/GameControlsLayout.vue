<template>
    <div class="controls">
        <div class="row">
            <button
                type="button"
                class="btn"
                :disabled="!game.canUndo"
                @click="game.undo()"
            >
                <GameIcon name="undo" />{{ t('game.undo') }}
            </button>
            <button
                type="button"
                class="btn"
                :disabled="!game.canRedo"
                @click="game.redo()"
            >
                <GameIcon name="redo" />{{ t('game.redo') }}
            </button>
            <button
                type="button"
                class="btn"
                :disabled="game.isOver"
                @click="game.resign()"
            >
                <GameIcon name="resign" />{{ t('game.resign') }}
            </button>
            <button
                type="button"
                class="btn primary"
                @click="game.reset()"
            >
                <GameIcon name="restart" />{{ t('game.restart') }}
            </button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { GameIcon } from '@components/index'
import { useGameStore } from '@store/game'
import { useI18n } from 'vue-i18n'

const game = useGameStore()
const { t } = useI18n()
</script>

<style scoped>
@reference "../style.css";

.controls {
    @apply flex w-full;
}

.row {
    @apply flex flex-wrap gap-0.5;
}

.btn {
    @apply grow flex items-center justify-center gap-1 rounded-full border border-outline px-4 py-1 text-sm text-on-surface;
    height: 48px;
}

.btn:disabled {
    cursor: not-allowed;
    @apply bg-outline-variant/25 border-outline-variant text-outline/75;
}

.btn.primary {
    @apply border-transparent bg-primary text-on-primary;
}
</style>
