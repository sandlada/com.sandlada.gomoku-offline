import { createLineCounter, DIRECTIONS, isEmptyAt, opponentOf } from './rules'
import type { Board, Difficulty, Position, Stone } from './types'

/** All empty cells adjacent (Chebyshev distance 1) to an existing stone, else center. */
export const candidateMoves = (board: Board): Position[] => {
    const size = board.length
    const center = Math.floor(size / 2)
    const hasStone = board.some((row) => row.some((c) => c != null))
    if (!hasStone) return [{ row: center, col: center }]
    const seen = new Set<string>()
    const out: Position[] = []
    board.forEach((row, r) =>
        row.forEach((cell, c) => {
            if (cell == null) return
            for (let dr = -1; dr <= 1; dr += 1)
                for (let dc = -1; dc <= 1; dc += 1) {
                    if (dr === 0 && dc === 0) continue
                    const pos = { row: r + dr, col: c + dc }
                    const key = `${pos.row}:${pos.col}`
                    if (!seen.has(key) && isEmptyAt(board, pos)) {
                        seen.add(key)
                        out.push(pos)
                    }
                }
        }),
    )
    return out
}

/** HOF: build a positional scorer; higher weight rewards longer lines. */
export const createPositionScorer =
    (weights: { readonly line: (n: number) => number } = { line: (n) => n * n }) =>
        (board: Board, pos: Position, stone: Stone): number =>
            DIRECTIONS.reduce((sum, [dr, dc]) => sum + weights.line(createLineCounter(dr, dc)(boardWith(board, pos, stone), pos, stone)), 0)

export interface LineShape {
    readonly count: number
    readonly openEnds: 0 | 1 | 2
}

/** Pure: consecutive stones through pos plus open ends along one axis. */
export const lineShape = (
    board: Board,
    pos: Position,
    stone: Stone,
    dRow: number,
    dCol: number,
): LineShape => {
    const size = board.length
    let count = 1
    let open = 0
    for (const step of [1, -1] as const) {
        let r = pos.row + dRow * step
        let c = pos.col + dCol * step
        while (r >= 0 && c >= 0 && r < size && c < board[r]!.length && board[r]![c] === stone) {
            count += 1
            r += dRow * step
            c += dCol * step
        }
        if (r >= 0 && c >= 0 && r < size && c < board[r]!.length && board[r]![c] == null) open += 1
    }
    return { count, openEnds: open as 0 | 1 | 2 }
}

export const WIN_VALUE = 1_000_000

const defaultShapeValue = ({ count, openEnds }: LineShape): number => {
    if (count >= 5) return WIN_VALUE
    if (count === 4) return openEnds === 2 ? 100_000 : 10_000
    if (count === 3) return openEnds === 2 ? 5_000 : 500
    if (count === 2) return openEnds === 2 ? 200 : 50
    return openEnds > 0 ? 10 : 1
}

/** HOF: build a shape-aware scorer; open lines outrank blocked ones. */
export const createShapeScorer =
    (value: (shape: LineShape) => number = defaultShapeValue) =>
        (board: Board, pos: Position, stone: Stone): number => {
            const placed = boardWith(board, pos, stone)
            return DIRECTIONS.reduce((sum, [dr, dc]) => sum + value(lineShape(placed, pos, stone, dr, dc)), 0)
        }

const boardWith = (board: Board, pos: Position, stone: Stone): Board =>
    board.map((row, r) => (r === pos.row ? row.map((cell, c) => (c === pos.col ? stone : cell)) : row))

/** Greedy 1-ply AI: win if possible, block loss, else maximize shape heuristic. Pure function. */
export const chooseAiMove = (
    board: Board,
    aiStone: Stone,
    difficulty: Difficulty = 'normal',
    random: () => number = Math.random,
): Position | null => {
    const moves = candidateMoves(board)
    if (moves.length === 0) return null
    if (difficulty === 'easy' && random() < 0.3) {
        return moves[Math.floor(random() * moves.length)] ?? null
    }
    const score = difficulty === 'easy' ? createPositionScorer() : createShapeScorer()
    const tacticalBar = difficulty === 'easy' ? Number.POSITIVE_INFINITY : WIN_VALUE
    const findTactical = (stone: Stone): Position | undefined =>
        moves.find((pos) => score(board, pos, stone) >= tacticalBar)
    return (
        findTactical(aiStone) ??
        findTactical(opponentOf(aiStone)) ??
        moves.map((pos) => ({ pos, v: score(board, pos, aiStone) + score(board, pos, opponentOf(aiStone)) * 0.9 })).sort((a, b) => b.v - a.v)[0]?.pos ??
        null
    )
}
