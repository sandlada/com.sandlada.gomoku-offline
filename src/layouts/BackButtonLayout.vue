<template>
    <BackButton @press="goBack" />
</template>

<script setup lang="ts">
import { BackButton } from '@components/index'
import { useRouter } from 'vue-router'

const router = useRouter()

/** Back in history; home when the page was opened directly. */
const goBack = async (): Promise<void> => {
    if (window.history.state?.back) router.back()
    else await router.push('/')
}
</script>
