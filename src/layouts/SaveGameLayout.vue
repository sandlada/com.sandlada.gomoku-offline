<template>
  <SaveButton @press="saveAndGo" />
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { SaveButton } from '@components/index'
import { useGameStore } from '@store/game'
import { useSavesStore } from '@store/saves'

const router = useRouter()
const game = useGameStore()
const saves = useSavesStore()

const saveAndGo = async (): Promise<void> => {
  saves.save(game.snapshot())
  await router.push('/saves')
}
</script>
