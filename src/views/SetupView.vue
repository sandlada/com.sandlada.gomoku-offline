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
@reference "tailwindcss";

.setup {
  @apply flex flex-col gap-5;
}
.heading {
  @apply text-xl font-semibold;
  color: var(--md-sys-color-on-surface);
}
.group {
  @apply flex flex-col gap-2;
}
.group h3 {
  @apply text-sm font-medium;
  color: var(--md-sys-color-on-surface-variant);
}
.seg {
  @apply inline-flex rounded-full border p-1 gap-1 self-start;
  border-color: var(--md-sys-color-outline-variant);
}
.seg.wrap {
  @apply flex-wrap;
  border-radius: var(--md-sys-shape-corner-value-large, 16px);
}
.seg button {
  @apply rounded-full px-4 py-1.5 text-sm;
  color: var(--md-sys-color-on-surface-variant);
}
.seg button.active {
  background: var(--md-sys-color-primary-container);
  color: var(--md-sys-color-on-primary-container);
}
.hint {
  @apply text-xs;
  color: var(--md-sys-color-on-surface-variant);
}
.start {
  @apply flex items-center justify-center gap-2 rounded-full px-4 py-3 text-base;
  background: var(--md-sys-color-primary);
  color: var(--md-sys-color-on-primary);
}
</style>
