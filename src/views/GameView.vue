<template>
    <div
        class="game-screen"
        :class="{ compact }"
    >
        <div class="topbar">
            <BackButtonLayout />
            <SegmentedControl
                :model-value="game.mode"
                :options="modeOptions"
                :aria-label="t('setup.mode')"
                class="flex-none"
                @update:model-value="game.setMode"
            />
            <SegmentedControl
                v-if="game.mode === 'ai'"
                :model-value="game.difficulty"
                :options="difficultyOptions"
                :aria-label="t('game.difficulty')"
                class="flex-none"
                @update:model-value="game.setDifficulty"
            />
            <SaveGameLayout />
        </div>
        <GomokuBoardLayout />
        <div class="panel">
            <GameHudLayout />
            <GameControlsLayout />
            <MoveHistoryLayout />
        </div>
    </div>
</template>

<script setup lang="ts">
import { SegmentedControl, type SegmentedOption } from '@components/index'
import { BackButtonLayout, GameControlsLayout, GameHudLayout, GomokuBoardLayout, MoveHistoryLayout, SaveGameLayout } from '@layouts/index'
import { useGameStore } from '@store/game'
import { computed, onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
import type { Difficulty, GameMode } from '../game/index'

defineProps<{ readonly compact: boolean }>()

const { t } = useI18n()
const game = useGameStore()

const modeOptions = computed<readonly SegmentedOption<GameMode>[]>(() => [
    { value: 'ai', label: t('game.modeAi') },
    { value: 'local', label: t('game.modeLocal') },
])

const difficultyOptions = computed<readonly SegmentedOption<Difficulty>[]>(() => [
    { value: 'easy', label: t('game.easy') },
    { value: 'normal', label: t('game.normal') },
])

onMounted(() => game.startClock())
onUnmounted(() => game.stopClock())
</script>

<style scoped>
@reference "../style.css";

.game-screen {
    @apply flex w-full flex-col items-center gap-2;
}

.topbar {
    @apply flex w-full flex-wrap items-center gap-0.5;
}

.topbar :deep(.back-btn) {
    align-self: center;
    flex: none;
}

.topbar :deep(.seg button) {
    @apply text-sm;
}

.panel {
    @apply flex w-full flex-col gap-2;
}
</style>
