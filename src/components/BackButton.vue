<template>
  <button type="button" class="back-btn" @click="goBack">
    <GameIcon name="back" />{{ t('nav.back') }}
  </button>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import GameIcon from './GameIcon.vue'

const { t } = useI18n()
const router = useRouter()

/** Back in history; home when the page was opened directly. */
const goBack = async (): Promise<void> => {
  if (window.history.state?.back) router.back()
  else await router.push('/')
}
</script>

<style scoped>
@reference "tailwindcss";

.back-btn {
  @apply inline-flex items-center gap-1.5 self-start rounded-full border px-4 py-1.5 text-sm;
  border-color: var(--md-sys-color-outline-variant);
  color: var(--md-sys-color-on-surface-variant);
}
</style>
