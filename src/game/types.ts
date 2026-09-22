export type Stone = 'black' | 'white'
export type Cell = Stone | null
export type Board = readonly (readonly Cell[])[]

export interface Position {
  readonly row: number
  readonly col: number
}

export type GameMode = 'ai' | 'local'
export type GameResult = Stone | 'draw' | null
export type Difficulty = 'easy' | 'normal'

export const BOARD_SIZE = 15
export const WIN_LENGTH = 5
