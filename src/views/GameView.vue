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
            <button
                type="button"
                class="save-btn"
                @click="saveAndGo"
            >
                <GameIcon name="save" />{{ t('saves.save') }}
            </button>
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
import { GameIcon, SegmentedControl, type SegmentedOption } from '@components/index'
import { BackButtonLayout, GameControlsLayout, GameHudLayout, GomokuBoardLayout, MoveHistoryLayout } from '@layouts/index'
import { useGameStore } from '@store/game'
import { useSavesStore } from '@store/saves'
import { computed, onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import type { Difficulty, GameMode } from '../game/index'

defineProps<{ readonly compact: boolean }>()

const { t } = useI18n()
const router = useRouter()
const game = useGameStore()
const saves = useSavesStore()

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

const saveAndGo = async (): Promise<void> => {
    saves.save(game.snapshot())
    await router.push('/saves')
}
</script>

<style scoped>
@reference "../style.css";

.game-screen {
    @apply flex w-full flex-col items-center gap-4;
}

.topbar {
    @apply flex w-full flex-wrap items-center gap-2;
}

.topbar :deep(.back-btn) {
    align-self: center;
    flex: none;
}

.topbar :deep(.seg button) {
    @apply text-sm;
}

.game-screen.compact .topbar :deep(.seg button) {
    @apply px-3;
}

.panel {
    @apply flex w-full max-w-md flex-col gap-4;
}

.game-screen:not(.compact) .panel {
    @apply max-w-md;
    display: grid;
    grid-template-columns: 1fr 1fr;
    align-items: start;
}

.game-screen:not(.compact) .panel> :first-child {
    grid-column: 1 / -1;
}

.save-btn {
    @apply flex flex-none items-center justify-center gap-2 rounded-full border border-outline px-4 py-1.5 text-on-surface label-large;
    margin-left: auto;
}
</style>
