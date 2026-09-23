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
@reference "../style.css";

.back-btn {
  @apply inline-flex items-center gap-1.5 self-start rounded-full border border-outline-variant px-4 py-1.5 text-sm text-on-surface-variant;
}
</style>
