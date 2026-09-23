<template>
    <div class="page-narrow setup">
        <BackButtonLayout />
        <h2 class="heading">{{ t('setup.title') }}</h2>

        <section class="group">
            <h3>{{ t('setup.mode') }}</h3>
            <SegmentedControl
                :model-value="setup.mode"
                :options="modeOptions"
                :aria-label="t('setup.mode')"
                class="self-start"
                @update:model-value="setup.setMode"
            />
        </section>

        <section
            v-if="setup.mode === 'ai'"
            class="group"
        >
            <h3>{{ t('setup.difficulty') }}</h3>
            <SegmentedControl
                :model-value="setup.difficulty"
                :options="difficultyOptions"
                :aria-label="t('setup.difficulty')"
                class="self-start"
                @update:model-value="setup.setDifficulty"
            />
        </section>

        <section class="group">
            <h3>{{ t('setup.time') }}</h3>
            <SegmentedControl
                :model-value="setup.timePresetId"
                :options="timeOptions"
                :aria-label="t('setup.time')"
                wrap
                class="self-start"
                @update:model-value="setup.setTimePreset"
            />
            <p class="hint">{{ t('setup.timeHint') }}</p>
        </section>

        <button
            type="button"
            class="start"
            @click="start"
        >
            <GameIcon name="play" />{{ t('menu.start') }}
        </button>
    </div>
</template>

<script setup lang="ts">
import { GameIcon, SegmentedControl, type SegmentedOption } from '@components/index'
import { BackButtonLayout } from '@layouts/index'
import { useGameStore } from '@store/game'
import { useSetupStore } from '@store/setup'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { TIME_PRESETS, type Difficulty, type GameMode } from '../game/index'

const { t } = useI18n()
const router = useRouter()
const setup = useSetupStore()
const game = useGameStore()

const modeOptions = computed<readonly SegmentedOption<GameMode>[]>(() => [
    { value: 'ai', label: t('game.modeAi') },
    { value: 'local', label: t('game.modeLocal') },
])

const difficultyOptions = computed<readonly SegmentedOption<Difficulty>[]>(() => [
    { value: 'easy', label: t('game.easy') },
    { value: 'normal', label: t('game.normal') },
])

const timeOptions = computed<readonly SegmentedOption<string>[]>(() =>
    TIME_PRESETS.map((preset) => ({
        value: preset.id,
        label: preset.id === 'none' ? t('time.none') : preset.label,
    })),
)

const start = async (): Promise<void> => {
    game.applySetup({ mode: setup.mode, difficulty: setup.difficulty, timePresetId: setup.timePresetId })
    await router.push('/game')
}
</script>

<style scoped>
@reference "../style.css";

.setup {
    @apply flex flex-col gap-5;
}

.heading {
    @apply title-large text-on-surface;
}

.group {
    @apply flex flex-col gap-2;
}

.group h3 {
    @apply title-small text-on-surface-variant;
}

.hint {
    @apply body-small text-on-surface-variant;
}

.start {
    @apply flex items-center justify-center gap-2 rounded-full bg-primary px-4 py-3 text-on-primary body-large;
}
</style>
