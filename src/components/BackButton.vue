<template>
    <button
        type="button"
        class="back-btn"
        @click="emit('press')"
    >
        <GameIcon name="back" />{{ label ?? t('nav.back') }}
    </button>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import GameIcon from './GameIcon.vue'

defineProps<{ readonly label?: string }>()

const emit = defineEmits<{ press: [] }>()

const { t } = useI18n()
</script>

<style scoped>
@reference "../style.css";

.back-btn {
    @apply inline-flex items-center gap-1.5 self-start rounded-full border border-outline-variant px-4 py-1.5 text-sm text-on-surface-variant;
}
</style>
