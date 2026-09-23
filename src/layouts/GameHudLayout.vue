<template>
    <section
        class="hud"
        aria-live="polite"
    >
        <div class="turn">
            <span
                class="pip"
                :class="game.result ?? game.current"
            />
            <p class="status">{{ status }}</p>
        </div>
        <div class="meta">
            <p class="moves">{{ t('game.moves', { count: game.moveCount }) }}</p>
            <p class="score">{{ t('game.score', { b: game.tally.black, w: game.tally.white, d: game.tally.draws }) }}
            </p>
        </div>
        <div
            v-if="game.isOver"
            class="banner"
        >
            <p class="banner-title">{{ status }}</p>
            <button
                type="button"
                class="again"
                @click="game.reset()"
            >
                <GameIcon name="restart" />{{ t('game.restart') }}
            </button>
        </div>
        <div
            v-if="game.hasClock"
            class="clocks"
        >
            <p
                class="clock"
                :class="{ active: isMover('black'), low: isLow('black') }"
            >
                <span class="pip black sm" />{{ formatClock(game.clocks?.blackMs ?? 0) }}
            </p>
            <p
                class="clock"
                :class="{ active: isMover('white'), low: isLow('white') }"
            >
                <span class="pip white sm" />{{ formatClock(game.clocks?.whiteMs ?? 0) }}
            </p>
        </div>
    </section>
</template>

<script setup lang="ts">
import { GameIcon } from '@components/index'
import { useGameStore } from '@store/game'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import type { Stone } from '../game/index'
import { formatClock } from '../game/index'

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
@reference "../style.css";

.hud {
    @apply flex w-full flex-wrap items-center justify-between gap-3 rounded-large border border-outline-variant bg-surface-container-low px-4 py-3;
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
    @apply border border-outline;
}

.pip.draw {
    background: linear-gradient(135deg, #23262b 50%, #ffffff 50%);
    @apply border border-outline;
}

.status {
    @apply body-medium text-on-surface;
}

.moves {
    @apply body-small text-on-surface-variant tabular-nums;
}

.meta {
    @apply flex flex-col items-end gap-0.5;
}

.score {
    @apply body-small text-on-surface-variant tabular-nums;
}

.banner {
    @apply flex items-center gap-3;
}

.banner-title {
    @apply title-small text-primary;
}

.again {
    @apply inline-flex items-center gap-1.5 rounded-full bg-primary px-4 py-1.5 text-on-primary label-large;
}

.clocks {
    @apply flex items-center gap-2;
}

.clock {
    @apply flex items-center gap-1.5 rounded-full border border-outline-variant px-3 py-1 text-on-surface-variant body-small tabular-nums;
}

.clock.active {
    @apply border-transparent bg-primary-container text-on-primary-container;
}

.clock.low {
    @apply text-error;
}

.pip.sm {
    width: 14px;
    height: 14px;
}
</style>
