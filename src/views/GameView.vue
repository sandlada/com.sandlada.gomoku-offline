<template>
  <div class="game-screen" :class="{ compact }">
    <BackButton />
    <GomokuBoard />
    <div class="panel">
      <GameHud />
      <GameControls />
      <button type="button" class="save-btn" @click="saveAndGo">
        <GameIcon name="save" />{{ t('saves.save') }}
      </button>
      <MoveHistory />
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { BackButton, GameControls, GameHud, GameIcon, GomokuBoard, MoveHistory } from '@components/index'
import { useGameStore } from '@store/game'
import { useSavesStore } from '@store/saves'

defineProps<{ readonly compact: boolean }>()

const { t } = useI18n()
const router = useRouter()
const game = useGameStore()
const saves = useSavesStore()

onMounted(() => game.startClock())
onUnmounted(() => game.stopClock())

const saveAndGo = async (): Promise<void> => {
  saves.save(game.snapshot())
  await router.push('/saves')
}
</script>

<style scoped>
@reference "../style.css";

.game-screen {
  @apply flex w-full flex-col items-center gap-4;
}
.panel {
  @apply flex w-full max-w-md flex-col gap-4;
}
.game-screen:not(.compact) .panel {
  @apply max-w-md;
  display: grid;
  grid-template-columns: 1fr 1fr;
  align-items: start;
}
.game-screen:not(.compact) .panel > :first-child {
  grid-column: 1 / -1;
}
.save-btn {
  @apply flex items-center justify-center gap-2 rounded-full border border-outline px-4 py-1.5 text-on-surface label-large;
}
</style>
