/** Pure confetti physics for the single-burst victory effect (framework-free, no Vue imports). */

export interface ConfettiPiece {
    readonly x: number
    readonly y: number
    readonly vx: number
    readonly vy: number
    readonly w: number
    readonly h: number
    readonly rotation: number
    readonly spin: number
    readonly color: string
    readonly round: boolean
    readonly swayPhase: number
    readonly swayAmp: number
    readonly swaySpeed: number
    readonly flipPhase: number
    readonly flipSpeed: number
    /** Explosive burst velocity: large at t=0, decays exponentially. */
    readonly bvx: number
    readonly bvy: number
}

export type ConfettiRng = () => number

export interface ConfettiViewport {
    readonly width: number
    readonly height: number
}

export const WIN_BURST_COUNT = 220
export const DRAW_BURST_COUNT = 130
/** Slow fall: vertical speed eases toward terminal velocity instead of accelerating. */
export const CONFETTI_TERMINAL_VY = 150
export const CONFETTI_EASE = 0.9
/** Opening pop: burst velocity decays with this rate (≈1.5s of explosion). */
export const CONFETTI_BURST_DECAY = 1.8
/** Radial burst speeds: max reach ≈ MAX / DECAY covers half a phone screen. */
export const CONFETTI_BURST_MIN_SPEED = 250
export const CONFETTI_BURST_MAX_SPEED = 950

const pick = (palette: readonly string[], rng: ConfettiRng): string =>
    palette[Math.floor(rng() * palette.length) ?? 0] ?? '#ffffff'

/** HOF: build a piece factory bound to a palette + viewport. All pieces start
 * at the top-center burst origin with radial explosive velocity. */
const makePiece =
    (palette: readonly string[], viewport: ConfettiViewport, rng: ConfettiRng) =>
    (): ConfettiPiece => {
        const angle = rng() * Math.PI * 2
        const speed = CONFETTI_BURST_MIN_SPEED + rng() * (CONFETTI_BURST_MAX_SPEED - CONFETTI_BURST_MIN_SPEED)
        return {
            x: viewport.width / 2 + (rng() - 0.5) * 120,
            y: viewport.height * 0.08 + (rng() - 0.5) * 28,
            vx: (rng() - 0.5) * 70,
            vy: 40 + rng() * 80,
            bvx: Math.cos(angle) * speed,
            bvy: Math.sin(angle) * speed,
        w: 6 + rng() * 7,
        h: 8 + rng() * 8,
        rotation: rng() * Math.PI * 2,
        spin: (rng() - 0.5) * 9,
        color: pick(palette, rng),
        round: rng() < 0.3,
        swayPhase: rng() * Math.PI * 2,
        swayAmp: 40 + rng() * 70,
        swaySpeed: 1 + rng() * 2.5,
        flipPhase: rng() * Math.PI * 2,
        flipSpeed: 2 + rng() * 4,
        }
    }

export const createPieces = (
    count: number,
    viewport: ConfettiViewport,
    palette: readonly string[],
    rng: ConfettiRng = Math.random,
): readonly ConfettiPiece[] => {
    if (count <= 0 || viewport.width <= 0 || viewport.height <= 0 || palette.length === 0) return []
    const build = makePiece(palette, viewport, rng)
    return Array.from({ length: Math.floor(count) }, build)
}

export const stepPiece = (piece: ConfettiPiece, dtSec: number, elapsedSec: number): ConfettiPiece => {
    const dt = Math.max(0, dtSec)
    const decay = Math.exp(-CONFETTI_BURST_DECAY * dt)
    const bvx = piece.bvx * decay
    const bvy = piece.bvy * decay
    const vy = piece.vy + (CONFETTI_TERMINAL_VY - piece.vy) * Math.min(1, dt * CONFETTI_EASE)
    return {
        ...piece,
        x: piece.x + (piece.vx + bvx + Math.sin(elapsedSec * piece.swaySpeed + piece.swayPhase) * piece.swayAmp) * dt,
        y: piece.y + (vy + bvy) * dt,
        vy,
        bvx,
        bvy,
        rotation: piece.rotation + piece.spin * dt,
    }
}

/** Horizontal squash factor simulating a tumbling fragment (-1..1). */
export const flipScale = (piece: ConfettiPiece, elapsedSec: number): number =>
    Math.cos(elapsedSec * piece.flipSpeed + piece.flipPhase)

export const isPieceAlive = (piece: ConfettiPiece, height: number): boolean =>
    piece.y < height + 48

export const updatePieces = (
    pieces: readonly ConfettiPiece[],
    dtSec: number,
    elapsedSec: number,
    height: number,
): readonly ConfettiPiece[] => {
    if (pieces.length === 0) return pieces
    const next: ConfettiPiece[] = []
    for (const piece of pieces) {
        const moved = stepPiece(piece, dtSec, elapsedSec)
        if (isPieceAlive(moved, height)) next.push(moved)
    }
    return next
}
