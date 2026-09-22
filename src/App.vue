<template>
  <div class="app">
    <AppLayout>
      <template #default="{ compact }">
        <router-view v-slot="{ Component }">
          <Transition name="view" mode="out-in">
            <component :is="Component" :compact="compact" />
          </Transition>
        </router-view>
      </template>
    </AppLayout>
  </div>
</template>

<script setup lang="ts">
import { AppLayout } from '@layouts/index'
</script>

<style scoped>
@reference "tailwindcss";

.app {
  @apply relative;
}
.view-enter-active,
.view-leave-active {
  transition:
    opacity 200ms ease,
    transform 200ms ease;
}
.view-enter-from,
.view-leave-to {
  opacity: 0;
  transform: translateY(8px);
}
@media (prefers-reduced-motion: reduce) {
  .view-enter-active,
  .view-leave-active {
    transition: none;
  }
  .view-enter-from,
  .view-leave-to {
    transform: none;
  }
}
</style>
