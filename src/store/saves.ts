import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { GameSnapshot } from './game'

export interface SaveEntry extends GameSnapshot {
  readonly id: string
  readonly savedAt: string
}

const STORAGE_KEY = 'gomoku:saves'
const MAX_SAVES = 20

const readAll = (): SaveEntry[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed: unknown = JSON.parse(raw)
    return Array.isArray(parsed) ? (parsed as SaveEntry[]) : []
  } catch {
    return []
  }
}

export const useSavesStore = defineStore('saves', () => {
  const saves = ref<SaveEntry[]>(readAll())

  const persist = (): void => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(saves.value))
  }

  const save = (entry: Omit<SaveEntry, 'id' | 'savedAt'>): SaveEntry => {
    const full: SaveEntry = {
      ...entry,
      moves: [...entry.moves],
      id: `${Date.now().toString(36)}-${Math.floor(Math.random() * 1_000_000).toString(36)}`,
      savedAt: new Date().toISOString(),
    }
    saves.value = [full, ...saves.value].slice(0, MAX_SAVES)
    persist()
    return full
  }

  const remove = (id: string): void => {
    saves.value = saves.value.filter((s) => s.id !== id)
    persist()
  }

  const find = (id: string): SaveEntry | null => saves.value.find((s) => s.id === id) ?? null

  return { saves, save, remove, find }
})
