import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { checkWin, createBoard, isBoardFull, isEmptyAt, nextStone, opponentOf, placeStone, winningLine } from '../game/rules'
import { chooseAiMove } from '../game/ai'
import { createClocks, findPreset, flaggedPlayer, grantIncrement, tickClocks, type ClockState } from '../game/clock'
import type { Board, Difficulty, GameMode, GameResult, Position, Stone } from '../game/types'

export const THINK_DELAY_MS = 350

export interface GameSnapshot {
  readonly moves: readonly Position[]
  readonly mode: GameMode
  readonly difficulty: Difficulty
  readonly timePresetId: string
  readonly clocks: ClockState | null
  readonly tally: { readonly black: number; readonly white: number; readonly draws: number }
}

export const useGameStore = defineStore('game', () => {
  const board = ref<Board>(createBoard())
  const moves = ref<readonly Position[]>([])
  const mode = ref<GameMode>('ai')
  const result = ref<GameResult>(null)
  const aiThinking = ref(false)
  const thinkToken = ref(0)
  const difficulty = ref<Difficulty>('normal')
  const timePresetId = ref<string>('none')
  const redoStack = ref<readonly Position[]>([])
  const clocks = ref<ClockState | null>(null)
  const timeoutBy = ref<Stone | null>(null)
  const tally = ref<{ readonly black: number; readonly white: number; readonly draws: number }>({ black: 0, white: 0, draws: 0 })

  const control = computed(() => findPreset(timePresetId.value).control)
  const hasClock = computed(() => control.value !== null && clocks.value !== null)

  const current = computed<Stone>(() => nextStone(moves.value.length))
  const moveCount = computed(() => moves.value.length)
  const isOver = computed(() => result.value !== null)
  const lastMove = computed(() => moves.value[moves.value.length - 1] ?? null)
  const winLine = computed<readonly Position[]>(() => {
    if ((result.value === 'black' || result.value === 'white') && lastMove.value !== null) {
      return winningLine(board.value, lastMove.value)
    }
    return []
  })

  const settle = (decided: Exclude<GameResult, null>): void => {
    result.value = decided
    timeoutBy.value = null
    if (decided === 'draw') tally.value = { ...tally.value, draws: tally.value.draws + 1 }
    else if (decided === 'black') tally.value = { ...tally.value, black: tally.value.black + 1 }
    else tally.value = { ...tally.value, white: tally.value.white + 1 }
  }

  const settleTimeout = (loser: Stone): void => {
    settle(opponentOf(loser))
    timeoutBy.value = opponentOf(loser)
  }

  const recall = (): void => {
    const decided = result.value
    if (decided === null) return
    if (decided === 'draw') tally.value = { ...tally.value, draws: Math.max(0, tally.value.draws - 1) }
    else if (decided === 'black') tally.value = { ...tally.value, black: Math.max(0, tally.value.black - 1) }
    else tally.value = { ...tally.value, white: Math.max(0, tally.value.white - 1) }
    result.value = null
    timeoutBy.value = null
  }

  const grantMoveIncrement = (mover: Stone): void => {
    const ctrl = control.value
    if (clocks.value !== null && ctrl !== null) clocks.value = grantIncrement(clocks.value, ctrl, mover)
  }

  const refundMoveIncrement = (mover: Stone): void => {
    const ctrl = control.value
    if (clocks.value === null || ctrl === null) return
    const refunded = mover === 'black'
      ? clocks.value.blackMs - ctrl.incrementMs
      : clocks.value.whiteMs - ctrl.incrementMs
    clocks.value = mover === 'black'
      ? { ...clocks.value, blackMs: Math.max(0, refunded) }
      : { ...clocks.value, whiteMs: Math.max(0, refunded) }
  }

  const applyMove = (pos: Position, stone: Stone): void => {
    board.value = placeStone(board.value, pos, stone)
    moves.value = [...moves.value, pos]
    grantMoveIncrement(stone)
    if (checkWin(board.value, pos)) settle(stone)
    else if (isBoardFull(board.value)) settle('draw')
  }

  const cancelThinking = (): void => {
    thinkToken.value += 1
    aiThinking.value = false
  }

  const play = (pos: Position): void => {
    if (result.value !== null || aiThinking.value || !isEmptyAt(board.value, pos)) return
    redoStack.value = []
    applyMove(pos, current.value)
    if (mode.value === 'ai' && result.value === null) {
      const aiStone = current.value
      const token = thinkToken.value + 1
      thinkToken.value = token
      aiThinking.value = true
      setTimeout(() => {
        if (thinkToken.value !== token) return
        aiThinking.value = false
        if (result.value !== null) return
        const reply = chooseAiMove(board.value, aiStone, difficulty.value)
        if (reply) applyMove(reply, aiStone)
      }, THINK_DELAY_MS)
    }
  }

  const reset = (): void => {
    cancelThinking()
    board.value = createBoard()
    moves.value = []
    redoStack.value = []
    result.value = null
    timeoutBy.value = null
    clocks.value = createClocks(control.value)
  }

  const undo = (): void => {
    if (aiThinking.value || moves.value.length === 0) return
    const steps = mode.value === 'ai' ? 2 : 1
    const kept = moves.value.slice(0, Math.max(0, moves.value.length - steps))
    const undone = moves.value.slice(kept.length)
    redoStack.value = [...undone, ...redoStack.value]
    const fresh = createBoard()
    cancelThinking()
    recall()
    undone.forEach((_, k) => refundMoveIncrement(nextStone(kept.length + k)))
    board.value = kept.reduce<Board>((b, pos, i) => placeStone(b, pos, i % 2 === 0 ? 'black' : 'white'), fresh)
    moves.value = kept
  }

  const redo = (): void => {
    if (aiThinking.value || result.value !== null || redoStack.value.length === 0) return
    const steps = mode.value === 'ai' ? 2 : 1
    const chunk = redoStack.value.slice(0, steps)
    redoStack.value = redoStack.value.slice(chunk.length)
    for (const pos of chunk) {
      if (!isEmptyAt(board.value, pos)) {
        redoStack.value = []
        return
      }
      applyMove(pos, nextStone(moves.value.length))
    }
  }

  const resign = (): void => {
    if (result.value !== null) return
    settle(opponentOf(current.value))
  }

  const snapshot = (): GameSnapshot => ({
    moves: [...moves.value],
    mode: mode.value,
    difficulty: difficulty.value,
    timePresetId: timePresetId.value,
    clocks: clocks.value === null ? null : { ...clocks.value },
    tally: { ...tally.value },
  })

  const loadSnapshot = (snap: GameSnapshot): void => {
    cancelThinking()
    mode.value = snap.mode
    difficulty.value = snap.difficulty
    timePresetId.value = snap.timePresetId
    tally.value = { ...snap.tally }
    redoStack.value = []
    result.value = null
    timeoutBy.value = null
    board.value = snap.moves.reduce<Board>(
      (b, pos, i) => (isEmptyAt(b, pos) ? placeStone(b, pos, nextStone(i)) : b),
      createBoard(),
    )
    moves.value = [...snap.moves]
    clocks.value = snap.clocks === null ? null : { ...snap.clocks }
    const last = moves.value[moves.value.length - 1]
    if (last && checkWin(board.value, last)) result.value = board.value[last.row]?.[last.col] ?? null
    else if (isBoardFull(board.value)) result.value = 'draw'
  }

  const applySetup = (setup: { mode: GameMode; difficulty: Difficulty; timePresetId: string }): void => {
    mode.value = setup.mode
    difficulty.value = setup.difficulty
    timePresetId.value = setup.timePresetId
    tally.value = { black: 0, white: 0, draws: 0 }
    clocks.value = createClocks(findPreset(setup.timePresetId).control)
    timeoutBy.value = null
    reset()
  }

  const canUndo = computed(() => !aiThinking.value && moves.value.length > 0)
  const canRedo = computed(() => !aiThinking.value && result.value === null && redoStack.value.length > 0)

  /** Deterministic tick used by the interval driver and tests. */
  const advanceClock = (elapsedMs: number): void => {
    if (clocks.value === null || result.value !== null || moves.value.length === 0 || elapsedMs <= 0) return
    const next = tickClocks(clocks.value, current.value, elapsedMs)
    clocks.value = next
    const flagged = flaggedPlayer(next)
    if (flagged !== null) settleTimeout(flagged)
  }

  let clockTimer: ReturnType<typeof setInterval> | null = null
  let lastTickAt = 0

  const startClock = (): void => {
    if (clockTimer !== null) return
    lastTickAt = Date.now()
    clockTimer = setInterval(() => {
      const now = Date.now()
      advanceClock(now - lastTickAt)
      lastTickAt = now
    }, 250)
  }

  const stopClock = (): void => {
    if (clockTimer !== null) {
      clearInterval(clockTimer)
      clockTimer = null
    }
  }

  const setMode = (m: GameMode): void => {
    mode.value = m
    tally.value = { black: 0, white: 0, draws: 0 }
    reset()
  }

  const setDifficulty = (d: Difficulty): void => {
    difficulty.value = d
  }

  return { board, moves, mode, result, aiThinking, current, moveCount, isOver, lastMove, winLine, tally, difficulty, timePresetId, clocks, timeoutBy, hasClock, canUndo, canRedo, play, reset, undo, redo, resign, setMode, setDifficulty, snapshot, loadSnapshot, applySetup, advanceClock, startClock, stopClock }
})
