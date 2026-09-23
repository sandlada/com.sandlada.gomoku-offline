<template>
    <SegmentedControl
        :model-value="settings.locale"
        :options="options"
        :aria-label="t('lang.label')"
        variant="secondary"
        @update:model-value="switchTo"
    />
</template>

<script setup lang="ts">
import { SegmentedControl, type SegmentedOption } from '@components/index'
import { useSettingsStore } from '@store/settings'
import { storeToRefs } from 'pinia'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { LOCALES, type AppLocale } from '../locales/index'

const { t, locale } = useI18n()
const settings = useSettingsStore()
const { locale: saved } = storeToRefs(settings)

const options = computed<readonly SegmentedOption<AppLocale>[]>(() =>
    LOCALES.map((l) => ({ value: l.code, label: t(l.labelKey) })),
)

const switchTo = (code: AppLocale): void => {
    settings.setLocale(code)
    locale.value = code
    saved.value = code
}
</script>
