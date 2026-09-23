<template>
  <div class="page-narrow setup">
    <BackButton />
    <h2 class="heading">{{ t('setup.title') }}</h2>

    <section class="group">
      <h3>{{ t('setup.mode') }}</h3>
      <div class="seg" role="group" :aria-label="t('setup.mode')">
        <button type="button" :class="{ active: setup.mode === 'ai' }" @click="setup.setMode('ai')">
          {{ t('game.modeAi') }}
        </button>
        <button type="button" :class="{ active: setup.mode === 'local' }" @click="setup.setMode('local')">
          {{ t('game.modeLocal') }}
        </button>
      </div>
    </section>

    <section v-if="setup.mode === 'ai'" class="group">
      <h3>{{ t('setup.difficulty') }}</h3>
      <div class="seg" role="group" :aria-label="t('setup.difficulty')">
        <button type="button" :class="{ active: setup.difficulty === 'easy' }" @click="setup.setDifficulty('easy')">
          {{ t('game.easy') }}
        </button>
        <button type="button" :class="{ active: setup.difficulty === 'normal' }" @click="setup.setDifficulty('normal')">
          {{ t('game.normal') }}
        </button>
      </div>
    </section>

    <section class="group">
      <h3>{{ t('setup.time') }}</h3>
      <div class="seg wrap" role="group" :aria-label="t('setup.time')">
        <button
          v-for="preset in TIME_PRESETS"
          :key="preset.id"
          type="button"
          :class="{ active: setup.timePresetId === preset.id }"
          @click="setup.setTimePreset(preset.id)"
        >
          {{ preset.id === 'none' ? t('time.none') : preset.label }}
        </button>
      </div>
      <p class="hint">{{ t('setup.timeHint') }}</p>
    </section>

    <button type="button" class="start" @click="start">
      <GameIcon name="play" />{{ t('menu.start') }}
    </button>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { BackButton, GameIcon } from '@components/index'
import { TIME_PRESETS } from '../game/index'
import { useGameStore } from '@store/game'
import { useSetupStore } from '@store/setup'

const { t } = useI18n()
const router = useRouter()
const setup = useSetupStore()
const game = useGameStore()

const start = async (): Promise<void> => {
  game.applySetup({ mode: setup.mode, difficulty: setup.difficulty, timePresetId: setup.timePresetId })
  await router.push('/game')
}
</script>

<style scoped>
@reference "../style.css";

.setup {
  @apply flex flex-col gap-5;
}
.heading {
  @apply title-large text-on-surface;
}
.group {
  @apply flex flex-col gap-2;
}
.group h3 {
  @apply title-small text-on-surface-variant;
}
.seg {
  @apply inline-flex gap-1 self-start rounded-full border border-outline-variant p-1;
}
.seg.wrap {
  @apply flex-wrap rounded-large;
}
.seg button {
  @apply rounded-full px-4 py-1.5 text-on-surface-variant label-large;
}
.seg button.active {
  @apply bg-primary-container text-on-primary-container;
}
.hint {
  @apply body-small text-on-surface-variant;
}
.start {
  @apply flex items-center justify-center gap-2 rounded-full bg-primary px-4 py-3 text-on-primary body-large;
}
</style>
