<template>
  <div class="page-narrow saves">
    <BackButton />
    <h2 class="heading">{{ t('menu.saves') }}</h2>
    <p v-if="saves.saves.length === 0" class="empty">{{ t('saves.empty') }}</p>
    <ul v-else class="list">
      <li v-for="entry in saves.saves" :key="entry.id" class="item">
        <div class="meta">
          <p class="title">{{ describe(entry) }}</p>
          <p class="date">{{ formatDate(entry.savedAt) }}</p>
        </div>
        <div class="row">
          <button type="button" class="btn primary" @click="resume(entry.id)">
            {{ t('saves.resume') }}
          </button>
          <button type="button" class="btn" @click="saves.remove(entry.id)">
            {{ t('saves.delete') }}
          </button>
        </div>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import type { SaveEntry } from '@store/saves'
import { BackButton } from '@components/index'
import { useGameStore } from '@store/game'
import { useSavesStore } from '@store/saves'

const { t } = useI18n()
const router = useRouter()
const saves = useSavesStore()
const game = useGameStore()

const modeName = (entry: SaveEntry): string => t(entry.mode === 'ai' ? 'game.modeAi' : 'game.modeLocal')

const describe = (entry: SaveEntry): string =>
  t('saves.summary', { mode: modeName(entry), count: entry.moves.length })

const formatDate = (iso: string): string => {
  const d = new Date(iso)
  return Number.isNaN(d.getTime()) ? iso : d.toLocaleString()
}

const resume = async (id: string): Promise<void> => {
  const entry = saves.find(id)
  if (!entry) return
  game.loadSnapshot(entry)
  await router.push('/game')
}
</script>

<style scoped>
@reference "tailwindcss";

.saves {
  @apply flex flex-col gap-4;
}
.heading {
  @apply text-xl font-semibold;
  color: var(--md-sys-color-on-surface);
}
.empty {
  @apply text-sm;
  color: var(--md-sys-color-on-surface-variant);
}
.list {
  @apply flex flex-col gap-3;
  list-style: none;
  margin: 0;
  padding: 0;
}
.item {
  @apply flex flex-col gap-3 border p-4;
  border-radius: var(--md-sys-shape-corner-value-large, 16px);
  border-color: var(--md-sys-color-outline-variant);
  border-width: 1px;
  background: var(--md-sys-color-surface-container-low);
}
.meta .title {
  @apply text-sm font-medium;
  color: var(--md-sys-color-on-surface);
}
.meta .date {
  @apply text-xs;
  color: var(--md-sys-color-on-surface-variant);
}
.row {
  @apply flex gap-2;
}
.btn {
  @apply rounded-full border px-4 py-1.5 text-sm;
  border-color: var(--md-sys-color-outline);
  color: var(--md-sys-color-on-surface);
}
.btn.primary {
  background: var(--md-sys-color-primary);
  color: var(--md-sys-color-on-primary);
  border-color: transparent;
}
</style>
