import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { THINK_DELAY_MS, useGameStore } from './game'

const playMoves = (game: ReturnType<typeof useGameStore>, cells: readonly (readonly [number, number])[]): void => {
  for (const [row, col] of cells) game.play({ row, col })
}

describe('game store tally', () => {
  beforeEach(() => setActivePinia(createPinia()))

  it('counts a black win and keeps tally across rounds', () => {
    const game = useGameStore()
    game.setMode('local')
    playMoves(game, [
      [0, 0], [1, 0], [0, 1], [1, 1], [0, 2], [1, 2], [0, 3], [1, 3], [0, 4],
    ])
    expect(game.result).toBe('black')
    expect(game.tally).toEqual({ black: 1, white: 0, draws: 0 })
    expect(game.winLine).toHaveLength(5)

    game.reset()
    expect(game.result).toBe(null)
    expect(game.tally).toEqual({ black: 1, white: 0, draws: 0 })
  })

  it('recalls the tally when undoing a decided game', () => {
    const game = useGameStore()
    game.setMode('local')
    playMoves(game, [
      [0, 0], [1, 0], [0, 1], [1, 1], [0, 2], [1, 2], [0, 3], [1, 3], [0, 4],
    ])
    expect(game.tally.black).toBe(1)
    game.undo()
    expect(game.result).toBe(null)
    expect(game.tally.black).toBe(0)
  })

  it('counts resignation and clears tally on mode switch', () => {
    const game = useGameStore()
    game.setMode('local')
    game.play({ row: 7, col: 7 })
    game.resign()
    expect(game.result).toBe('black')
    expect(game.tally).toEqual({ black: 1, white: 0, draws: 0 })
    game.setMode('ai')
    expect(game.tally).toEqual({ black: 0, white: 0, draws: 0 })
  })

  it('replies asynchronously in ai mode and ignores input while thinking', async () => {
    vi.useFakeTimers()
    try {
      const game = useGameStore()
      game.setMode('ai')
      game.play({ row: 7, col: 7 })
      expect(game.aiThinking).toBe(true)
      expect(game.moves).toHaveLength(1)
      game.play({ row: 0, col: 0 })
      expect(game.moves).toHaveLength(1)
      await vi.advanceTimersByTimeAsync(THINK_DELAY_MS)
      expect(game.aiThinking).toBe(false)
      expect(game.moves).toHaveLength(2)
    } finally {
      vi.useRealTimers()
    }
  })

  it('defaults to normal difficulty and switches on demand', () => {
    const game = useGameStore()
    expect(game.difficulty).toBe('normal')
    game.setDifficulty('easy')
    expect(game.difficulty).toBe('easy')
    expect(game.moves).toHaveLength(0)
  })

  it('redoes undone moves and clears redo on new play', () => {
    const game = useGameStore()
    game.setMode('local')
    game.play({ row: 7, col: 7 })
    game.play({ row: 7, col: 8 })
    game.undo()
    expect(game.moves).toHaveLength(1)
    expect(game.canRedo).toBe(true)
    game.redo()
    expect(game.moves).toHaveLength(2)
    expect(game.board[7]?.[8]).toBe('white')
    expect(game.canRedo).toBe(false)
    game.undo()
    game.play({ row: 0, col: 0 })
    expect(game.canRedo).toBe(false)
  })

  it('round-trips a snapshot', () => {
    const game = useGameStore()
    game.setMode('local')
    game.play({ row: 7, col: 7 })
    game.play({ row: 3, col: 3 })
    const snap = game.snapshot()
    game.reset()
    expect(game.moves).toHaveLength(0)
    game.loadSnapshot(snap)
    expect(game.moves).toHaveLength(2)
    expect(game.board[7]?.[7]).toBe('black')
    expect(game.board[3]?.[3]).toBe('white')
    expect(game.result).toBe(null)
  })

  it('cancels a pending reply on reset', async () => {
    vi.useFakeTimers()
    try {
      const game = useGameStore()
      game.setMode('ai')
      game.play({ row: 7, col: 7 })
      game.reset()
      await vi.advanceTimersByTimeAsync(THINK_DELAY_MS * 2)
      expect(game.moves).toHaveLength(0)
      expect(game.aiThinking).toBe(false)
    } finally {
      vi.useRealTimers()
    }
  })

  it('runs X+Y clocks: increment on move, flag loses', () => {
    const game = useGameStore()
    game.applySetup({ mode: 'local', difficulty: 'normal', timePresetId: '15+5' })
    expect(game.clocks).toEqual({ blackMs: 900_000, whiteMs: 900_000 })
    game.play({ row: 7, col: 7 })
    expect(game.clocks).toEqual({ blackMs: 905_000, whiteMs: 900_000 })
    game.advanceClock(60_000)
    expect(game.clocks?.whiteMs).toBe(840_000)
    game.advanceClock(840_000)
    expect(game.result).toBe('black')
    expect(game.timeoutBy).toBe('black')
    expect(game.tally).toEqual({ black: 1, white: 0, draws: 0 })
  })

  it('refunds the increment on undo and ignores clocks when unset', () => {
    const game = useGameStore()
    game.applySetup({ mode: 'local', difficulty: 'normal', timePresetId: '15+5' })
    game.play({ row: 7, col: 7 })
    expect(game.clocks?.blackMs).toBe(905_000)
    game.undo()
    expect(game.clocks).toEqual({ blackMs: 900_000, whiteMs: 900_000 })
    game.applySetup({ mode: 'local', difficulty: 'normal', timePresetId: 'none' })
    expect(game.clocks).toBe(null)
    game.play({ row: 0, col: 0 })
    game.advanceClock(999_999)
    expect(game.result).toBe(null)
  })
})
