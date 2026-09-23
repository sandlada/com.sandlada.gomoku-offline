import { describe, expect, it } from 'vitest'
import { candidateMoves, chooseAiMove } from './ai'
import { createClocks, flaggedPlayer, formatClock, grantIncrement, tickClocks } from './clock'
import { formatPosition } from './coordinates'
import { checkWin, createBoard, isBoardFull, isEmptyAt, nextStone, opponentOf, placeStone, winningLine } from './rules'

describe('rules', () => {
    it('creates an empty board', () => {
        const board = createBoard(15)
        expect(board).toHaveLength(15)
        expect(board.every((row) => row.every((cell) => cell === null))).toBe(true)
    })

    it('places stones immutably', () => {
        const before = createBoard(3)
        const after = placeStone(before, { row: 1, col: 1 }, 'black')
        expect(before[1]?.[1]).toBe(null)
        expect(after[1]?.[1]).toBe('black')
        expect(isEmptyAt(after, { row: 1, col: 1 })).toBe(false)
    })

    it('detects horizontal five as win, four as not', () => {
        let win = createBoard(15)
        for (let i = 0; i < 5; i += 1) win = placeStone(win, { row: 0, col: i }, 'black')
        expect(checkWin(win, { row: 0, col: 4 })).toBe(true)

        let four = createBoard(15)
        for (let i = 0; i < 4; i += 1) four = placeStone(four, { row: 1, col: i }, 'white')
        expect(checkWin(four, { row: 1, col: 3 })).toBe(false)
    })

    it('detects diagonal win', () => {
        let board = createBoard(15)
        for (let i = 0; i < 5; i += 1) board = placeStone(board, { row: i, col: i }, 'white')
        expect(checkWin(board, { row: 4, col: 4 })).toBe(true)
    })

    it('returns the winning run, empty when no win', () => {
        let board = createBoard(15)
        for (let i = 0; i < 5; i += 1) board = placeStone(board, { row: 2, col: i }, 'black')
        expect(winningLine(board, { row: 2, col: 4 })).toHaveLength(5)
        expect(winningLine(board, { row: 2, col: 4 }).every((p) => p.row === 2)).toBe(true)

        let four = createBoard(15)
        for (let i = 0; i < 4; i += 1) four = placeStone(four, { row: 6, col: i }, 'white')
        expect(winningLine(four, { row: 6, col: 3 })).toEqual([])
        expect(winningLine(createBoard(15), { row: 0, col: 0 })).toEqual([])
    })

    it(' alternates stones and opponents', () => {
        expect(nextStone(0)).toBe('black')
        expect(nextStone(1)).toBe('white')
        expect(opponentOf('black')).toBe('white')
    })

    it('detects a full board', () => {
        const full = placeStone(placeStone(createBoard(2), { row: 0, col: 0 }, 'black'), { row: 0, col: 1 }, 'white')
        const full2 = placeStone(placeStone(full, { row: 1, col: 0 }, 'white'), { row: 1, col: 1 }, 'black')
        expect(isBoardFull(full2)).toBe(true)
        expect(isBoardFull(createBoard(2))).toBe(false)
    })
})

describe('ai', () => {
    it('opens in the center on an empty board', () => {
        const move = chooseAiMove(createBoard(15), 'black')
        expect(move).toEqual({ row: 7, col: 7 })
    })

    it('takes an immediate win', () => {
        let board = createBoard(15)
        for (let i = 0; i < 4; i += 1) board = placeStone(board, { row: 5, col: i }, 'white')
        expect(chooseAiMove(board, 'white')).toEqual({ row: 5, col: 4 })
    })

    it('blocks an immediate loss', () => {
        let board = createBoard(15)
        for (let i = 0; i < 4; i += 1) board = placeStone(board, { row: 3, col: i }, 'black')
        expect(chooseAiMove(board, 'white')).toEqual({ row: 3, col: 4 })
    })

    it('returns adjacent candidates once stones exist', () => {
        let board = createBoard(15)
        board = placeStone(board, { row: 7, col: 7 }, 'black')
        const moves = candidateMoves(board)
        expect(moves.length).toBeGreaterThan(0)
        expect(moves.every((m) => isEmptyAt(board, m))).toBe(true)
    })

    it('extends to an open four over other moves', () => {
        let board = createBoard(15)
        for (const col of [5, 6, 7]) board = placeStone(board, { row: 5, col }, 'white')
        const move = chooseAiMove(board, 'white')
        expect([{ row: 5, col: 4 }, { row: 5, col: 8 }]).toContainEqual(move)
    })

    it('blocks an open three', () => {
        let board = createBoard(15)
        for (const col of [3, 4, 5]) board = placeStone(board, { row: 3, col }, 'black')
        const move = chooseAiMove(board, 'white')
        expect([{ row: 3, col: 2 }, { row: 3, col: 6 }]).toContainEqual(move)
    })

    it('formats positions in Gomoku notation', () => {
        expect(formatPosition({ row: 0, col: 0 })).toBe('A1')
        expect(formatPosition({ row: 7, col: 7 })).toBe('H8')
        expect(formatPosition({ row: 14, col: 14 })).toBe('O15')
    })

    it('formats clocks as m:ss, clamped at zero', () => {
        expect(formatClock(15 * 60_000)).toBe('15:00')
        expect(formatClock(61_000)).toBe('1:01')
        expect(formatClock(5_000)).toBe('0:05')
        expect(formatClock(-100)).toBe('0:00')
    })

    it('ticks, increments and flags purely', () => {
        const control = { baseMs: 60_000, incrementMs: 5_000 }
        const fresh = createClocks(control)
        expect(fresh).toEqual({ blackMs: 60_000, whiteMs: 60_000 })
        expect(createClocks(null)).toBe(null)
        const ticked = tickClocks(fresh!, 'black', 10_000)
        expect(ticked).toEqual({ blackMs: 50_000, whiteMs: 60_000 })
        expect(flaggedPlayer(ticked)).toBe(null)
        expect(grantIncrement(ticked, control, 'black')).toEqual({ blackMs: 55_000, whiteMs: 60_000 })
        expect(flaggedPlayer({ blackMs: 0, whiteMs: 1 })).toBe('black')
    })

    it('plays weaker on easy but always legally', () => {
        let board = createBoard(15)
        for (let i = 0; i < 4; i += 1) board = placeStone(board, { row: 5, col: i }, 'white')
        // Rigged RNG below the blunder threshold: takes a random legal cell instead of the win.
        const blunder = chooseAiMove(board, 'white', 'easy', () => 0.1)
        expect(blunder).not.toBeNull()
        expect(isEmptyAt(board, blunder!)).toBe(true)
        // Rigged RNG above the threshold: falls back to heuristic play and still takes the win.
        expect(chooseAiMove(board, 'white', 'easy', () => 0.9)).toEqual({ row: 5, col: 4 })
    })
})
