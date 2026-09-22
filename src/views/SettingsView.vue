<template>
  <div class="page-narrow settings">
    <BackButton />
    <h2 class="heading">{{ t('menu.settings') }}</h2>
    <section class="group">
      <h3>{{ t('settings.theme') }}</h3>
      <div class="seg" role="group" :aria-label="t('settings.theme')">
        <button type="button" :class="{ active: settings.theme === 'light' }" @click="settings.setTheme('light')">
          {{ t('settings.light') }}
        </button>
        <button type="button" :class="{ active: settings.theme === 'dark' }" @click="settings.setTheme('dark')">
          {{ t('settings.dark') }}
        </button>
      </div>
    </section>
    <section class="group">
      <h3>{{ t('lang.label') }}</h3>
      <LanguageSwitcher />
    </section>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { BackButton, LanguageSwitcher } from '@components/index'
import { useSettingsStore } from '@store/settings'

const { t } = useI18n()
const settings = useSettingsStore()
</script>

<style scoped>
@reference "tailwindcss";

.settings {
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
.seg button {
  @apply rounded-full px-4 py-1.5 text-sm;
  color: var(--md-sys-color-on-surface-variant);
}
.seg button.active {
  background: var(--md-sys-color-primary-container);
  color: var(--md-sys-color-on-primary-container);
}
</style>
