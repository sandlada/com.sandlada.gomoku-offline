import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Difficulty, GameMode } from '../game/types'

export const useSetupStore = defineStore('setup', () => {
  const mode = ref<GameMode>('ai')
  const difficulty = ref<Difficulty>('normal')
  const timePresetId = ref<string>('none')

  const setMode = (m: GameMode): void => {
    mode.value = m
  }
  const setDifficulty = (d: Difficulty): void => {
    difficulty.value = d
  }
  const setTimePreset = (id: string): void => {
    timePresetId.value = id
  }

  return { mode, difficulty, timePresetId, setMode, setDifficulty, setTimePreset }
})
