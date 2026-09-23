import { describe, expect, it } from 'vitest'
import {
    CONFETTI_BURST_DECAY,
    createPieces,
    flipScale,
    isPieceAlive,
    stepPiece,
    updatePieces,
    type ConfettiPiece,
} from './confetti'

const seq = (): (() => number) => {
    let n = 0
    return () => {
        n += 1
        return (n % 100) / 100
    }
}

/** Cycles through quadrants so burst directions spread radially. */
const quadrants = (): (() => number) => {
    const values = [0.05, 0.3, 0.55, 0.8]
    let n = 0
    return () => values[n++ % values.length] ?? 0
}

const VIEWPORT = { width: 800, height: 600 }

describe('confetti', () => {
    it('bursts from the top-center origin', () => {
        const pieces = createPieces(10, VIEWPORT, ['#111111', '#ffffff'], seq())
        expect(pieces).toHaveLength(10)
        for (const piece of pieces) {
            expect(piece.x).toBeGreaterThanOrEqual(VIEWPORT.width / 2 - 64)
            expect(piece.x).toBeLessThanOrEqual(VIEWPORT.width / 2 + 64)
            expect(piece.y).toBeGreaterThanOrEqual(-48)
            expect(piece.y).toBeLessThanOrEqual(VIEWPORT.height * 0.25)
        }
    })

    it('throws fragments far enough to fill the screen width', () => {
        const phone = { width: 390, height: 844 }
        const pieces = createPieces(4, phone, ['#fff'], () => 0.99)
        const reach = Math.max(...pieces.map((p) => Math.abs(p.bvx) / CONFETTI_BURST_DECAY))
        expect(reach).toBeGreaterThanOrEqual(phone.width / 2)
    })

    it('shoots fragments radially in all directions', () => {
        const pieces = createPieces(8, VIEWPORT, ['#fff'], quadrants())
        const left = pieces.filter((p) => p.bvx < 0)
        const right = pieces.filter((p) => p.bvx > 0)
        const up = pieces.filter((p) => p.bvy < 0)
        const down = pieces.filter((p) => p.bvy > 0)
        expect(left.length).toBeGreaterThan(0)
        expect(right.length).toBeGreaterThan(0)
        expect(up.length).toBeGreaterThan(0)
        expect(down.length).toBeGreaterThan(0)
    })

    it('returns empty for invalid input', () => {
        expect(createPieces(0, VIEWPORT, ['#fff'], seq())).toEqual([])
        expect(createPieces(10, { width: 0, height: 600 }, ['#fff'], seq())).toEqual([])
        expect(createPieces(10, { width: 800, height: 0 }, ['#fff'], seq())).toEqual([])
        expect(createPieces(10, VIEWPORT, [], seq())).toEqual([])
    })

    it('falls downward once the burst decays', () => {
        const calm: ConfettiPiece = {
            x: 400, y: 100, vx: 0, vy: 100, w: 8, h: 12,
            rotation: 0, spin: 2, color: '#fff', round: false,
            swayPhase: 0, swayAmp: 0, swaySpeed: 1,
            flipPhase: 0, flipSpeed: 3, bvx: 0, bvy: 0,
        }
        const moved = stepPiece(calm, 0.5, 5)
        expect(moved.y).toBeGreaterThan(calm.y)
        expect(moved.rotation).not.toBe(calm.rotation)
    })

    it('explodes outward then decays into the fall', () => {
        const [first] = createPieces(1, VIEWPORT, ['#fff'], seq())
        if (!first) throw new Error('expected one piece')
        const hasBurst = Math.abs(first.bvx) + Math.abs(first.bvy) > 0
        expect(hasBurst).toBe(true)
        const moved = stepPiece(first, 0.5, 0.25)
        expect(Math.abs(moved.bvx)).toBeLessThan(Math.abs(first.bvx))
        expect(Math.abs(moved.bvy)).toBeLessThan(Math.abs(first.bvy))
    })

    it('filters out pieces below the viewport', () => {
        const pieces = createPieces(5, VIEWPORT, ['#fff'], seq())
        const fallen = updatePieces(pieces, 10, 10, 600)
        expect(fallen.length).toBeLessThan(pieces.length)
        expect(isPieceAlive({ ...pieces[0]!, y: 10_000 }, 600)).toBe(false)
    })

    it('tumbles fragments through a flip cycle', () => {
        const [first] = createPieces(1, VIEWPORT, ['#fff'], seq())
        if (!first) throw new Error('expected one piece')
        const start = flipScale(first, 0)
        expect(Math.abs(start)).toBeLessThanOrEqual(1)
        const later = flipScale(first, Math.PI / first.flipSpeed)
        expect(later).not.toBe(start)
    })
})
