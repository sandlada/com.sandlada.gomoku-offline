import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useGameStore } from './game'
import { useSavesStore } from './saves'

const mem: Record<string, string> = {}
vi.stubGlobal('localStorage', {
  getItem: (k: string): string | null => mem[k] ?? null,
  setItem: (k: string, v: string): void => {
    mem[k] = v
  },
  removeItem: (k: string): void => {
    delete mem[k]
  },
})

describe('saves store', () => {
  beforeEach(() => {
    for (const k of Object.keys(mem)) delete mem[k]
    setActivePinia(createPinia())
  })

  it('saves, finds, resumes and deletes', () => {
    const game = useGameStore()
    game.setMode('local')
    game.play({ row: 7, col: 7 })
    const saves = useSavesStore()
    const entry = saves.save(game.snapshot())
    expect(saves.saves).toHaveLength(1)
    expect(saves.find(entry.id)?.moves).toHaveLength(1)

    game.reset()
    const loaded = saves.find(entry.id)
    expect(loaded).not.toBe(null)
    game.loadSnapshot(loaded!)
    expect(game.board[7]?.[7]).toBe('black')

    saves.remove(entry.id)
    expect(saves.saves).toHaveLength(0)
    expect(saves.find(entry.id)).toBe(null)
  })
})
