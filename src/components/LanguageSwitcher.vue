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
@reference "tailwindcss";

.lang {
  @apply inline-flex gap-1 rounded-full border p-1;
  border-color: var(--md-sys-color-outline-variant);
}
.lang button {
  @apply rounded-full px-3 py-1 text-sm;
  color: var(--md-sys-color-on-surface-variant);
}
.lang button.active {
  background: var(--md-sys-color-secondary-container);
  color: var(--md-sys-color-on-secondary-container);
}
</style>
