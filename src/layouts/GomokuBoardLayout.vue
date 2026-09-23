<template>
    <div
        class="board-frame"
        :class="{ thinking: game.aiThinking }"
    >
        <div
            class="coords-row"
            aria-hidden="true"
        >
            <span
                v-for="label in COL_LABELS"
                :key="label"
                class="coord col"
            >{{ label }}</span>
        </div>
        <div class="board-body">
            <div
                class="coords-col"
                aria-hidden="true"
            >
                <span
                    v-for="n in size"
                    :key="n"
                    class="coord row"
                >{{ n }}</span>
            </div>
            <div
                class="grid"
                role="grid"
                :aria-label="t('app.title')"
                tabindex="0"
                :aria-activedescendant="cursorId ?? undefined"
                @keydown="onKey"
            >
                <div
                    class="lines"
                    aria-hidden="true"
                />
                <span
                    v-for="([r, c], i) in STARS"
                    :key="i"
                    class="star"
                    aria-hidden="true"
                    :style="{ top: `calc(var(--cell) * (${r} + 0.5))`, left: `calc(var(--cell) * (${c} + 0.5))` }"
                />
                <template
                    v-for="(row, r) in game.board"
                    :key="r"
                >
                    <button
                        v-for="(cell, c) in row"
                        :key="`${r}-${c}`"
                        :id="`cell-${r}-${c}`"
                        type="button"
                        role="gridcell"
                        tabindex="-1"
                        class="cell"
                        :class="{ played: cell !== null, last: isLast(r, c), won: wonKeys.has(`${r}:${c}`), cursor: isCursor(r, c), pending: isPending(r, c) }"
                        :aria-label="`${COL_LABELS[c]}${r + 1}`"
                        @click="confirm({ row: r, col: c })"
                        @focus="cursor = { row: r, col: c }"
                    >
                        <span
                            v-if="cell !== null"
                            class="stone"
                            :class="cell"
                        />
                        <span
                            v-else
                            class="ghost"
                            :class="game.current"
                        />
                    </button>
                </template>
            </div>
        </div>
        <p
            v-if="pending !== null"
            class="confirm-hint"
        >{{ t('game.confirm') }}</p>
        <p
            class="sr-only"
            aria-live="polite"
        >{{ announcement }}</p>
    </div>
</template>

<script setup lang="ts">
import { useGameStore } from '@store/game'
import { computed, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import type { Position } from '../game/index'
import { COL_LABELS, formatPosition } from '../game/index'

/** Star points (0-indexed) for a 15x15 board. */
const STARS: readonly (readonly [number, number])[] = [
    [3, 3],
    [3, 11],
    [11, 3],
    [11, 11],
    [7, 7],
]

const game = useGameStore()
const { t } = useI18n()
const cursor = ref<Position | null>(null)
/** First-tap preview awaiting a second tap to confirm. */
const pending = ref<Position | null>(null)

watch(
    () => game.moves.length,
    () => {
        pending.value = null
    },
)

const isPending = (row: number, col: number): boolean =>
    pending.value !== null && pending.value.row === row && pending.value.col === col

const samePos = (a: Position, b: Position): boolean => a.row === b.row && a.col === b.col

/** Two-tap placement: first tap previews (dashed ring), second confirms. */
const confirm = (pos: Position): void => {
    if (game.isOver || game.aiThinking || game.board[pos.row]?.[pos.col] != null) {
        pending.value = null
        return
    }
    if (pending.value !== null && samePos(pending.value, pos)) {
        pending.value = null
        game.play(pos)
    } else {
        pending.value = { ...pos }
    }
}

const size = computed(() => game.board.length)

const wonKeys = computed(() => new Set(game.winLine.map((p) => `${p.row}:${p.col}`)))

const cursorId = computed(() => (cursor.value === null ? null : `cell-${cursor.value.row}-${cursor.value.col}`))

const isCursor = (row: number, col: number): boolean =>
    cursor.value !== null && cursor.value.row === row && cursor.value.col === col

const clampTo = (n: number): number => Math.min(Math.max(n, 0), size.value - 1)

/** HOF: move the cursor one step along an axis. */
const stepCursor =
    (dRow: number, dCol: number) =>
        (from: Position | null): Position => ({
            row: clampTo((from?.row ?? Math.floor(size.value / 2)) + dRow),
            col: clampTo((from?.col ?? Math.floor(size.value / 2)) + dCol),
        })

const onKey = (e: KeyboardEvent): void => {
    const steps: Record<string, (p: Position | null) => Position> = {
        ArrowUp: stepCursor(-1, 0),
        ArrowDown: stepCursor(1, 0),
        ArrowLeft: stepCursor(0, -1),
        ArrowRight: stepCursor(0, 1),
    }
    const step = steps[e.key]
    if (step) {
        e.preventDefault()
        cursor.value = step(cursor.value)
        document.getElementById(`cell-${cursor.value.row}-${cursor.value.col}`)?.focus({ preventScroll: false })
        return
    }
    if ((e.key === 'Enter' || e.key === ' ') && cursor.value !== null) {
        // Focused cell buttons fire click on Enter/Space themselves — don't double-handle.
        if ((e.target as HTMLElement | null)?.getAttribute?.('role') === 'gridcell') return
        e.preventDefault()
        confirm(cursor.value)
        return
    }
    if (e.key === 'Escape') pending.value = null
}

const announcement = computed(() => {
    const last = game.lastMove
    if (last === null) return ''
    const stone = game.board[last.row]?.[last.col]
    if (stone == null) return ''
    return t('game.announce', {
        stone: t(stone === 'black' ? 'game.black' : 'game.white'),
        pos: formatPosition(last),
    })
})

const isLast = (row: number, col: number): boolean => {
    const last = game.lastMove
    return last !== null && last.row === row && last.col === col
}
</script>

<style scoped>
@reference "../style.css";

.board-frame {
    /* Fallback when container units are unsupported. */
    --cell: clamp(18px, calc(6.25vw - 3px), 40px);
    @apply block select-none rounded-large bg-surface-container-lowest;
    --line: var(--md-sys-color-outline-variant);
    width: 100%;
    margin-inline: auto;
    container-type: inline-size;
    /* Exact fit: 15 cells + coord gutter + 2px label gap = content width. */
    --cell: max(18px, calc((100cqw - var(--coord-w, 10px) - 2px) / 15));
    /* border: 1px solid var(--md-sys-color-outline-variant); */
    /* padding: clamp(2px, 1vw, 4px); */
    box-shadow: var(--md-sys-elevation-level1, 0 1px 3px rgb(0 0 0 / 0.12));
}

.coords-row {
    @apply flex;
    height: var(--coord-h, 10px);
    /* Label centers track the intersections (grid has no padding). */
    margin-left: calc(var(--coord-w, 10px) + 2px);
    /* 2px gap between labels and the first line. */
    margin-bottom: 2px;
}

.board-body {
    @apply flex;
}

.coords-col {
    @apply flex flex-col;
    width: var(--coord-w, 10px);
    /* 2px gap between labels and the first line. */
    margin-right: 2px;
}

.coord {
    @apply grid place-items-center text-on-surface-variant;
    width: var(--cell);
    height: var(--cell);
    font-size: 9px;
}

.coords-col .coord {
    width: var(--coord-w, 10px);
    height: var(--cell);
}

.coords-row .coord {
    height: var(--coord-h, 10px);
}

.grid {
    @apply relative grid;
    grid-template-columns: repeat(15, var(--cell));
    padding: 0;
}

/* Lines start half a cell in so crossings land on cell centers. */
.lines {
    @apply pointer-events-none absolute;
    top: calc(var(--cell) / 2);
    left: calc(var(--cell) / 2);
    width: calc(var(--cell) * 14 + 1px);
    height: calc(var(--cell) * 14 + 1px);
    background-image:
        linear-gradient(var(--line) 1px, transparent 1px),
        linear-gradient(90deg, var(--line) 1px, transparent 1px);
    background-size: var(--cell) var(--cell);
    background-position: 0 0;
}

.star {
    @apply absolute bg-on-surface-variant;
    width: 7px;
    height: 7px;
    border-radius: 9999px;
    transform: translate(-50%, -50%);
}

.cell {
    @apply relative grid cursor-pointer place-items-center;
    width: var(--cell);
    height: var(--cell);
    border-radius: 9999px;
    z-index: 1;
    touch-action: manipulation;
    -webkit-tap-highlight-color: transparent;
}

.cell:focus-visible {
    @apply outline-2 outline-primary;
    outline-style: solid;
    outline-offset: -2px;
}

.board-frame.thinking .grid {
    cursor: wait;
}

.board-frame.thinking .ghost {
    display: none;
}

.cell.cursor:not(.played)::before,
.cell.pending:not(.played)::before {
    content: '';
    position: absolute;
    inset: 8%;
    border-radius: 9999px;
    @apply border-2 border-dashed border-primary;
}

.confirm-hint {
    @apply mt-2 text-center text-primary body-small;
}

.sr-only {
    @apply sr-only;
}

.stone {
    width: 86%;
    height: 86%;
    border-radius: 9999px;
}

.stone.black {
    background: radial-gradient(circle at 34% 30%, #5b5f66 0%, #23262b 55%, #0c0e10 100%);
    box-shadow:
        inset 0 -2px 4px rgb(0 0 0 / 0.55),
        0 2px 4px rgb(0 0 0 / 0.4);
}

.stone.white {
    background: radial-gradient(circle at 34% 30%, #ffffff 0%, #e8ebee 55%, #c3c9d1 100%);
    @apply border border-outline;
    box-shadow:
        inset 0 -2px 4px rgb(0 0 0 / 0.12),
        0 2px 4px rgb(0 0 0 / 0.3);
}

.cell.last .stone {
    animation: drop 180ms cubic-bezier(0.2, 0, 0, 1);
}

@keyframes drop {
    from {
        transform: scale(0.3);
        opacity: 0.4;
    }

    to {
        transform: scale(1);
        opacity: 1;
    }
}

@media (prefers-reduced-motion: reduce) {
    .cell.last .stone {
        animation: none;
    }
}

.cell.last .stone::after {
    content: '';
    display: block;
    width: 34%;
    height: 34%;
    margin: 33% auto 0;
    border-radius: 9999px;
    @apply bg-primary;
}

.ghost {
    width: 86%;
    height: 86%;
    border-radius: 9999px;
    opacity: 0;
}

.cell:not(.played):hover .ghost,
.cell:not(.played):focus-visible .ghost {
    opacity: 0.38;
}

.ghost.black {
    background: #23262b;
}

.ghost.white {
    background: #ffffff;
    @apply border border-outline;
}

.cell.won .stone {
    @apply outline-primary;
    outline-width: 2.5px;
    outline-style: solid;
    outline-offset: 2px;
}
</style>
