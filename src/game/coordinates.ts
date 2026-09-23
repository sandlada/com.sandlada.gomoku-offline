import type { Position } from './types'

/** Column labels A-O for a 15x15 board. */
export const COL_LABELS: readonly string[] = 'ABCDEFGHIJKLMNO'.split('')

/** Pure: human notation for a position, e.g. {row:7,col:7} -> "H8". */
export const formatPosition = ({ row, col }: Position): string => `${COL_LABELS[col] ?? '?'}${row + 1}`
