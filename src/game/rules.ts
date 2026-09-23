import { BOARD_SIZE, WIN_LENGTH, type Board, type Cell, type Position, type Stone } from './types'

export const DIRECTIONS: readonly (readonly [number, number])[] = [
    [0, 1],
    [1, 0],
    [1, 1],
    [1, -1],
] as const

export const createBoard = (size: number = BOARD_SIZE): Board =>
    Array.from({ length: size }, () => Array.from({ length: size }, () => null as Cell))

export const isInside = (board: Board, { row, col }: Position): boolean =>
    row >= 0 && col >= 0 && row < board.length && col < (board[0]?.length ?? 0)

export const isEmptyAt = (board: Board, pos: Position): boolean =>
    isInside(board, pos) && board[pos.row]?.[pos.col] == null

export const placeStone = (board: Board, pos: Position, stone: Stone): Board =>
    board.map((row, r) => (r === pos.row ? row.map((cell, c) => (c === pos.col ? stone : cell)) : row))

/** HOF: build a line counter for one direction pair. */
export const createLineCounter =
    (dRow: number, dCol: number) =>
        (board: Board, pos: Position, stone: Stone): number => {
            const count = (step: 1 | -1): number => {
                let n = 0
                let r = pos.row + dRow * step
                let c = pos.col + dCol * step
                while (board[r]?.[c] === stone) {
                    n += 1
                    r += dRow * step
                    c += dCol * step
                }
                return n
            }
            return 1 + count(1) + count(-1)
        }

/** HOF: compose win-checker from a direction list (default: 4 Gomoku directions). */
export const createWinChecker =
    (directions: readonly (readonly [number, number])[] = DIRECTIONS) =>
        (board: Board, pos: Position): boolean => {
            const stone = board[pos.row]?.[pos.col]
            if (stone == null) return false
            return directions.some(([dr, dc]) => createLineCounter(dr, dc)(board, pos, stone) >= WIN_LENGTH)
        }

export const checkWin = createWinChecker()

/** Pure: full consecutive run through pos along its winning axis (empty unless win). */
export const winningLine = (board: Board, pos: Position): Position[] => {
    const stone = board[pos.row]?.[pos.col]
    if (stone == null) return []
    for (const [dr, dc] of DIRECTIONS) {
        const run: Position[] = [{ ...pos }]
        for (const step of [1, -1] as const) {
            let r = pos.row + dr * step
            let c = pos.col + dc * step
            while (board[r]?.[c] === stone) {
                run.push({ row: r, col: c })
                r += dr * step
                c += dc * step
            }
        }
        if (run.length >= WIN_LENGTH) return run
    }
    return []
}

export const isBoardFull = (board: Board): boolean => board.every((row) => row.every((cell) => cell != null))

export const opponentOf = (stone: Stone): Stone => (stone === 'black' ? 'white' : 'black')

export const nextStone = (moves: number): Stone => (moves % 2 === 0 ? 'black' : 'white')
