<template>
    <section
        class="hud"
        aria-live="polite"
    >
        <div
            class="side black"
            :class="{ active: isMover('black'), low: isLow('black') }"
            :aria-current="isMover('black') ? 'true' : undefined"
        >
            <span
                class="pip black"
                aria-hidden="true"
            />
            <span class="side-info">
                <span class="name">{{ t('game.black') }}</span>
                <span class="time">{{ clockText('black') }}</span>
            </span>
        </div>
        <div class="meta">
            <p class="status">{{ status }}</p>
            <p class="moves">{{ t('game.moves', { count: game.moveCount }) }}</p>
            <p class="score">{{ t('game.score', { b: game.tally.black, w: game.tally.white, d: game.tally.draws }) }}</p>
            <button
                v-if="game.isOver"
                type="button"
                class="again"
                @click="game.reset()"
            >
                <GameIcon name="restart" />{{ t('game.restart') }}
            </button>
        </div>
        <div
            class="side white"
            :class="{ active: isMover('white'), low: isLow('white') }"
            :aria-current="isMover('white') ? 'true' : undefined"
        >
            <span
                class="pip white"
                aria-hidden="true"
            />
            <span class="side-info">
                <span class="name">{{ t('game.white') }}</span>
                <span class="time">{{ clockText('white') }}</span>
            </span>
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

const clockText = (stone: Stone): string => (game.hasClock ? formatClock(msOf(stone)) : '∞')
</script>

<style scoped>
@reference "../style.css";

.hud {
    @apply grid w-full items-stretch gap-2 rounded-large border border-outline-variant bg-surface-container-low p-2;
    grid-template-columns: 1fr auto 1fr;
}

.side {
    @apply flex items-center gap-2.5 rounded-medium border border-outline-variant px-3 py-2 text-on-surface-variant;
    min-width: 0;
}

.side.black {
    justify-content: flex-start;
}

.side.white {
    flex-direction: row-reverse;
    text-align: right;
}

.side.active {
    @apply border-transparent bg-primary-container text-on-primary-container;
}

.side-info {
    @apply flex min-w-0 flex-col gap-0.5 leading-tight;
}

.name {
    @apply label-large;
}

.time {
    @apply title-large tabular-nums;
}

.side.low .time {
    @apply text-error;
}

.meta {
    @apply flex min-w-24 flex-col items-center justify-center gap-0.5 px-1 text-center;
}

.status {
    @apply body-medium text-on-surface;
}

.moves,
.score {
    @apply body-small text-on-surface-variant tabular-nums;
}

.again {
    @apply mt-1 inline-flex items-center gap-1.5 rounded-full bg-primary px-4 py-1.5 text-on-primary label-large;
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

/* Narrow screens: keep the versus row on top, drop the match report below. */
:root[data-bp-width='compact'] .hud {
    grid-template-columns: 1fr 1fr;
}

:root[data-bp-width='compact'] .meta {
    grid-column: 1 / -1;
}
</style>
