<template>
  <div class="page-narrow home">
    <header class="brand">
      <h1 class="title">{{ t('app.title') }}</h1>
    </header>
    <p class="subtitle">{{ t('app.subtitle') }}</p>
    <nav class="menu">
      <RouterLink to="/setup" class="menu-btn primary">
        <GameIcon name="play" />{{ t('menu.start') }}
      </RouterLink>
      <RouterLink to="/saves" class="menu-btn">
        <GameIcon name="save" />{{ t('menu.saves') }}
      </RouterLink>
      <RouterLink to="/settings" class="menu-btn">
        <GameIcon name="settings" />{{ t('menu.settings') }}
      </RouterLink>
    </nav>
    <section class="rules">
      <h2>{{ t('app.rulesTitle') }}</h2>
      <p>{{ t('app.rules') }}</p>
    </section>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { GameIcon } from '@components/index'

const { t } = useI18n()
</script>

<style scoped>
@reference "tailwindcss";

.home {
  @apply flex flex-col gap-6;
}
.brand {
  @apply text-center;
}
.title {
  @apply text-3xl font-semibold tracking-tight;
  color: var(--md-sys-color-on-surface);
  font-family: 'Noto Sans', system-ui, sans-serif;
}
.subtitle {
  @apply text-center text-sm;
  color: var(--md-sys-color-on-surface-variant);
}
.menu {
  @apply flex flex-col gap-3;
}
.menu-btn {
  @apply flex items-center justify-center gap-2 rounded-full border px-4 py-3 text-base;
  border-color: var(--md-sys-color-outline);
  color: var(--md-sys-color-on-surface);
  text-decoration: none;
}
.menu-btn.primary {
  background: var(--md-sys-color-primary);
  color: var(--md-sys-color-on-primary);
  border-color: transparent;
}
.rules {
  @apply border p-4 text-sm leading-relaxed;
  border-radius: var(--md-sys-shape-corner-value-large, 16px);
  border-color: var(--md-sys-color-outline-variant);
  color: var(--md-sys-color-on-surface-variant);
  border-width: 1px;
}
.rules h2 {
  @apply mb-1 text-base font-medium;
  color: var(--md-sys-color-on-surface);
}
</style>
