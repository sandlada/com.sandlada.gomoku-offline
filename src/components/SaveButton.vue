<template>
    <button
        type="button"
        class="save-btn"
        @click="emit('press')"
    >
        <GameIcon name="save" />{{ label ?? t('saves.save') }}
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

.save-btn {
    @apply flex flex-none items-center justify-center gap-1 rounded-full border border-outline px-2 text-on-surface label-large;
    margin-left: auto;
    height: 48px;
}
</style>
