<template>
  <div class="lang" :aria-label="t('lang.label')">
    <button
      v-for="l in LOCALES"
      :key="l.code"
      type="button"
      :class="{ active: locale === l.code }"
      @click="switchTo(l.code)"
    >
      {{ t(l.labelKey) }}
    </button>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { LOCALES, type AppLocale } from '../locales/index'
import { useSettingsStore } from '@store/settings'
import { storeToRefs } from 'pinia'

const { t, locale } = useI18n()
const settings = useSettingsStore()
const { locale: saved } = storeToRefs(settings)

const switchTo = (code: AppLocale): void => {
  settings.setLocale(code)
  locale.value = code
  saved.value = code
}
</script>

<style scoped>
@reference "../style.css";

.lang {
  @apply inline-flex gap-1 rounded-full border border-outline-variant p-1;
}
.lang button {
  @apply rounded-full px-3 py-1 text-sm text-on-surface-variant;
}
.lang button.active {
  @apply bg-secondary-container text-on-secondary-container;
}
</style>
