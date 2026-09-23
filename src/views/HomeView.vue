<template>
    <div class="page-narrow home">
        <header class="brand">
            <h1 class="title">{{ t('app.title') }}</h1>
        </header>
        <p class="subtitle">{{ t('app.subtitle') }}</p>
        <nav class="menu">
            <RouterLink
                to="/setup"
                class="menu-btn primary"
            >
                <GameIcon name="play" />{{ t('menu.start') }}
            </RouterLink>
            <RouterLink
                to="/saves"
                class="menu-btn"
            >
                <GameIcon name="save" />{{ t('menu.saves') }}
            </RouterLink>
            <RouterLink
                to="/settings"
                class="menu-btn"
            >
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
import { GameIcon } from '@components/index'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>

<style scoped>
@reference "../style.css";

.home {
    @apply flex flex-col gap-6;
}

.brand {
    @apply text-center;
}

.title {
    @apply headline-medium text-center text-on-surface;
    font-family: 'Noto Sans', system-ui, sans-serif;
}

.subtitle {
    @apply text-center text-on-surface-variant body-medium;
}

.menu {
    @apply flex flex-col gap-3;
}

.menu-btn {
    @apply flex items-center justify-center gap-2 rounded-full border border-outline px-4 py-3 text-on-surface body-large;
    text-decoration: none;
}

.menu-btn.primary {
    @apply border-transparent bg-primary text-on-primary;
}

.rules {
    @apply rounded-large border border-outline-variant p-4 text-on-surface-variant body-medium leading-relaxed;
}

.rules h2 {
    @apply mb-1 text-on-surface title-small;
}
</style>
