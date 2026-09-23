<template>
    <div
        class="layout"
        :class="{ compact }"
    >
        <main class="main">
            <slot :compact="compact" />
        </main>
    </div>
</template>

<script setup lang="ts">
import { matchesBreakpointCondition } from '@sandlada/breakpoint'
import { onMounted, onUnmounted, ref } from 'vue'

const compact = ref(false)

const isCompact = matchesBreakpointCondition('< 600px')

const onResize = (): void => {
    compact.value = isCompact(window.innerWidth)
}

onMounted(() => {
    onResize()
    window.addEventListener('resize', onResize)
})
onUnmounted(() => window.removeEventListener('resize', onResize))
</script>

<style scoped>
@reference "../style.css";

.layout {
    @apply mx-auto flex min-h-svh w-full max-w-5xl flex-col gap-6 px-4 py-6;
}

.top {
    @apply flex flex-wrap items-center justify-center gap-4;
}

.main {
    @apply flex flex-col items-center gap-4;
}
</style>
