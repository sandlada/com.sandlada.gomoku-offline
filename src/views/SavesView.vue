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
@reference "../style.css";

.saves {
  @apply flex flex-col gap-4;
}
.heading {
  @apply title-large text-on-surface;
}
.empty {
  @apply body-medium text-on-surface-variant;
}
.list {
  @apply flex flex-col gap-3;
  list-style: none;
  margin: 0;
  padding: 0;
}
.item {
  @apply flex flex-col gap-3 rounded-large border border-outline-variant bg-surface-container-low p-4;
}
.meta .title {
  @apply title-small text-on-surface;
}
.meta .date {
  @apply body-small text-on-surface-variant;
}
.row {
  @apply flex gap-2;
}
.btn {
  @apply rounded-full border border-outline px-4 py-1.5 text-on-surface label-large;
}
.btn.primary {
  @apply border-transparent bg-primary text-on-primary;
}
</style>
