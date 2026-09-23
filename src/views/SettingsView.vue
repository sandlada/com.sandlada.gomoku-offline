<template>
  <div class="page-narrow settings">
    <BackButtonLayout />
    <h2 class="heading">{{ t('menu.settings') }}</h2>
    <section class="group">
      <h3>{{ t('settings.theme') }}</h3>
      <SegmentedControl
        :model-value="settings.theme"
        :options="themeOptions"
        :aria-label="t('settings.theme')"
        class="self-start"
        @update:model-value="settings.setTheme"
      />
    </section>
    <section class="group">
      <h3>{{ t('lang.label') }}</h3>
      <LanguageSwitcherLayout />
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { SegmentedControl, type SegmentedOption } from '@components/index'
import { BackButtonLayout, LanguageSwitcherLayout } from '@layouts/index'
import { useSettingsStore, type Theme } from '@store/settings'

const { t } = useI18n()
const settings = useSettingsStore()

const themeOptions = computed<readonly SegmentedOption<Theme>[]>(() => [
  { value: 'light', label: t('settings.light') },
  { value: 'dark', label: t('settings.dark') },
])
</script>

<style scoped>
@reference "../style.css";

.settings {
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
</style>
