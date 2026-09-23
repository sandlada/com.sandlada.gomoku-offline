<template>
    <div
        class="seg"
        :class="[{ wrap }, variant]"
        role="group"
        :aria-label="ariaLabel"
    >
        <button
            v-for="opt in options"
            :key="opt.value"
            type="button"
            :class="{ active: opt.value === modelValue }"
            :disabled="opt.disabled"
            :aria-pressed="opt.value === modelValue"
            @click="emit('update:modelValue', opt.value)"
        >
            {{ opt.label }}
        </button>
    </div>
</template>

<script setup lang="ts" generic="T extends string">

export interface SegmentedOption<T extends string> {
    readonly value: T
    readonly label: string
    readonly disabled?: boolean
}

const props = defineProps<{
    readonly modelValue: T
    readonly options: readonly SegmentedOption<T>[]
    readonly ariaLabel?: string
    readonly wrap?: boolean
    readonly variant?: 'primary' | 'secondary'
}>()

const emit = defineEmits<{
    'update:modelValue': [value: T]
}>()

</script>

<style scoped>
@reference "../style.css";

.seg {
    @apply inline-flex gap-0.5 rounded-full border border-outline-variant w-fit;
    height: 48px;
    padding-inline: 4px;
    padding-block: 4px;
}

.seg.wrap {
    @apply flex-wrap rounded-large;
}

.seg button {
    @apply select-none rounded-full px-2 inline-flex items-center text-on-surface-variant label-large;
    line-height: 1;
}

.seg button.active {
    @apply bg-primary-container text-on-primary-container;
}

.seg.secondary button.active {
    @apply bg-secondary-container text-on-secondary-container;
}

.seg button:disabled {
    @apply opacity-50;
}
</style>
