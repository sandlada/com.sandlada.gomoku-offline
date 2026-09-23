<template>
    <canvas
        v-if="!reducedMotion"
        ref="canvasRef"
        class="confetti"
        aria-hidden="true"
    />
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import {
    DRAW_BURST_COUNT,
    WIN_BURST_COUNT,
    createPieces,
    flipScale,
    updatePieces,
    type ConfettiPiece,
} from '../game/index'

const props = defineProps<{ readonly variant: 'win' | 'draw' }>()

const canvasRef = ref<HTMLCanvasElement | null>(null)
const reducedMotion = ref(false)
let rafId = 0
let resizeCleanup: (() => void) | null = null

const BURST_MS = 9000
const FADE_MS = 1500

/**
 * Decorative party palette (deliberate exception to the MD3-token rule:
 * a single tonal-spot scheme cannot supply rainbow party hues, and canvas
 * `fillStyle` needs resolved color strings — CSS `var()` references stay
 * black when assigned to a 2D context).
 */
const WIN_PALETTE = [
    '#f94144',
    '#f3722c',
    '#f9c74f',
    '#90be6d',
    '#43aa8b',
    '#577590',
    '#9b5de5',
    '#f15bb5',
] as const

const DRAW_PALETTE = ['#ffffff', '#f4fbf1', '#e3eae1', '#dde4db'] as const

const resolvePalette = (variant: 'win' | 'draw'): readonly string[] =>
    variant === 'win' ? [...WIN_PALETTE] : [...DRAW_PALETTE]

const fitCanvas = (canvas: HTMLCanvasElement): { width: number; height: number } => {
    const dpr = Math.min(2, window.devicePixelRatio || 1)
    const width = window.innerWidth
    const height = window.innerHeight
    canvas.width = Math.floor(width * dpr)
    canvas.height = Math.floor(height * dpr)
    return { width, height }
}

const drawPieces = (
    ctx: CanvasRenderingContext2D,
    pieces: readonly ConfettiPiece[],
    dpr: number,
    alpha: number,
    elapsedSec: number,
): void => {
    ctx.save()
    ctx.scale(dpr, dpr)
    ctx.globalAlpha = alpha
    for (const piece of pieces) {
        ctx.save()
        ctx.translate(piece.x, piece.y)
        ctx.rotate(piece.rotation)
        // Tumbling fragment: squash horizontally as it flips through the air.
        ctx.scale(Math.max(0.12, Math.abs(flipScale(piece, elapsedSec))), 1)
        ctx.fillStyle = piece.color
        if (piece.round) {
            ctx.beginPath()
            ctx.arc(0, 0, piece.w / 2, 0, Math.PI * 2)
            ctx.fill()
        } else {
            ctx.fillRect(-piece.w / 2, -piece.h / 3, piece.w, piece.h / 1.5)
        }
        // White-on-light stays visible with a hairline outline.
        if (props.variant === 'draw') {
            ctx.strokeStyle = 'rgba(109, 122, 110, 0.55)'
            ctx.lineWidth = 1
            if (piece.round) {
                ctx.beginPath()
                ctx.arc(0, 0, piece.w / 2, 0, Math.PI * 2)
                ctx.stroke()
            } else {
                ctx.strokeRect(-piece.w / 2, -piece.h / 3, piece.w, piece.h / 1.5)
            }
        }
        ctx.restore()
    }
    ctx.restore()
}

onMounted(() => {
    reducedMotion.value = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reducedMotion.value) return
    const canvas = canvasRef.value
    if (canvas === null) return
    const ctx = canvas.getContext('2d')
    if (ctx === null) return

    const dpr = Math.min(2, window.devicePixelRatio || 1)
    let width = window.innerWidth
    let height = window.innerHeight
    const applySize = (): void => {
        const size = fitCanvas(canvas)
        width = size.width
        height = size.height
    }
    applySize()
    const palette = resolvePalette(props.variant)
    let pieces = createPieces(
        props.variant === 'win' ? WIN_BURST_COUNT : DRAW_BURST_COUNT,
        { width, height },
        palette,
        Math.random,
    )

    const startedAt = performance.now()
    let lastAt = startedAt

    const onResize = (): void => {
        applySize()
    }
    window.addEventListener('resize', onResize)
    resizeCleanup = (): void => window.removeEventListener('resize', onResize)

    const frame = (now: number): void => {
        const elapsedMs = now - startedAt
        const dtSec = Math.min(0.05, Math.max(0, (now - lastAt) / 1000))
        lastAt = now
        const elapsedSec = elapsedMs / 1000
        pieces = updatePieces(pieces, dtSec, elapsedSec, height)
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        const alpha = elapsedMs > BURST_MS - FADE_MS
            ? Math.max(0, 1 - (elapsedMs - (BURST_MS - FADE_MS)) / FADE_MS)
            : 1
        drawPieces(ctx, pieces, dpr, alpha, elapsedSec)
        // Single burst: stop after the window elapses or everything fell through.
        if (elapsedMs >= BURST_MS || pieces.length === 0) {
            resizeCleanup = null
            window.removeEventListener('resize', onResize)
            return
        }
        rafId = requestAnimationFrame(frame)
    }
    rafId = requestAnimationFrame(frame)
})

onUnmounted(() => {
    if (rafId !== 0) cancelAnimationFrame(rafId)
    resizeCleanup?.()
})
</script>

<style scoped>
@reference "../style.css";

.confetti {
    @apply pointer-events-none fixed inset-0;
    z-index: 60;
    width: 100vw;
    height: 100vh;
}
</style>
