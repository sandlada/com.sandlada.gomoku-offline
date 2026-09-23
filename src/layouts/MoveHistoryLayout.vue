<template>
    <section
        class="history"
        :aria-label="t('game.history')"
    >
        <h3 class="title">{{ t('game.history') }}</h3>
        <ol
            ref="list"
            class="list"
        >
            <li
                v-for="(pos, i) in game.moves"
                :key="`${pos.row}:${pos.col}`"
                class="move"
                :class="{ latest: i === game.moves.length - 1 }"
            >
                <span class="num">{{ i + 1 }}</span>
                <span
                    class="dot"
                    :class="i % 2 === 0 ? 'black' : 'white'"
                />
                <span class="coord">{{ formatPosition(pos) }}</span>
            </li>
            <li
                v-if="game.moves.length === 0"
                class="empty"
            >{{ t('game.noMoves') }}</li>
        </ol>
    </section>
</template>

<script setup lang="ts">
import { useGameStore } from '@store/game'
import { ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { formatPosition } from '../game/index'

const game = useGameStore()
const { t } = useI18n()
const list = ref<HTMLOListElement | null>(null)

watch(
    () => game.moves.length,
    () => {
        const el = list.value
        if (el) el.scrollTop = el.scrollHeight
    },
)
</script>

<style scoped>
@reference "../style.css";

.history {
    @apply flex w-full flex-col gap-2 rounded-large border border-outline-variant bg-surface-container-low px-4 py-3;
}

.title {
    @apply label-small text-on-surface-variant uppercase tracking-wider;
}

.list {
    @apply flex max-h-44 flex-col gap-1 overflow-y-auto;
    list-style: none;
    margin: 0;
    padding: 0;
}

.move {
    @apply flex items-center gap-2 rounded-small px-2 py-1 text-on-surface body-medium tabular-nums;
}

.move.latest {
    @apply bg-secondary-container text-on-secondary-container;
}

.num {
    @apply w-6 text-on-surface-variant body-small;
}

.move.latest .num {
    @apply text-on-secondary-container;
}

.dot {
    width: 12px;
    height: 12px;
    border-radius: 9999px;
    flex: none;
}

.dot.black {
    background: radial-gradient(circle at 34% 30%, #5b5f66 0%, #0c0e10 100%);
}

.dot.white {
    background: radial-gradient(circle at 34% 30%, #ffffff 0%, #c3c9d1 100%);
    @apply border border-outline;
}

.empty {
    @apply body-small text-on-surface-variant;
}
</style>
