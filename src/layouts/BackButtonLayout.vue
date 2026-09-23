<template>
  <BackButton @press="goBack" />
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { BackButton } from '@components/index'

const router = useRouter()

/** Back in history; home when the page was opened directly. */
const goBack = async (): Promise<void> => {
  if (window.history.state?.back) router.back()
  else await router.push('/')
}
</script>
