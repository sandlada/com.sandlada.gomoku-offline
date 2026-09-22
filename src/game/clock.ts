import type { Stone } from './types'

/** Chess-like X+Y time control: X total time per player + Y increment per move. Null = no clock. */
export interface TimeControl {
  readonly baseMs: number
  readonly incrementMs: number
}

export interface TimePreset {
  readonly id: string
  readonly label: string
  readonly control: TimeControl | null
}

export const TIME_PRESETS: readonly TimePreset[] = [
  { id: 'none', label: '∞', control: null },
  { id: '5+3', label: '5+3', control: { baseMs: 5 * 60_000, incrementMs: 3_000 } },
  { id: '10+5', label: '10+5', control: { baseMs: 10 * 60_000, incrementMs: 5_000 } },
  { id: '15+5', label: '15+5', control: { baseMs: 15 * 60_000, incrementMs: 5_000 } },
]

export const findPreset = (id: string): TimePreset => TIME_PRESETS.find((p) => p.id === id) ?? TIME_PRESETS[0]!

/** Pure: mm:ss display for a remaining-time value. */
export const formatClock = (ms: number): string => {
  const total = Math.max(0, Math.ceil(ms / 1000))
  const m = Math.floor(total / 60)
  const s = total % 60
  return `${m}:${s.toString().padStart(2, '0')}`
}

export interface ClockState {
  readonly blackMs: number
  readonly whiteMs: number
}

/** Pure: fresh clocks from a control (null when no clock). */
export const createClocks = (control: TimeControl | null): ClockState | null =>
  control === null ? null : { blackMs: control.baseMs, whiteMs: control.baseMs }

/** Pure: subtract elapsed time from the player to move. */
export const tickClocks = (clocks: ClockState, mover: Stone, elapsedMs: number): ClockState =>
  mover === 'black'
    ? { ...clocks, blackMs: clocks.blackMs - elapsedMs }
    : { ...clocks, whiteMs: clocks.whiteMs - elapsedMs }

/** Pure: grant the increment to the player who just moved. */
export const grantIncrement = (clocks: ClockState, control: TimeControl, mover: Stone): ClockState =>
  mover === 'black'
    ? { ...clocks, blackMs: clocks.blackMs + control.incrementMs }
    : { ...clocks, whiteMs: clocks.whiteMs + control.incrementMs }

/** Pure: the player whose total time ran out, if any. */
export const flaggedPlayer = (clocks: ClockState): Stone | null => {
  if (clocks.blackMs <= 0) return 'black'
  if (clocks.whiteMs <= 0) return 'white'
  return null
}
