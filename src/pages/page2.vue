<template>
  <div class="column flex-center pa-4">
    [PAGE2]
    {{ msg }}
    <AsyncInput v-model="msg" />
  </div>
</template>

<script setup lang="ts">
  import { defineAsyncComponent, ref } from 'vue'

  const AsyncInput = defineAsyncComponent(() => import('~/components/CustomInput.vue'))
  const msg = ref<string | null>(null)
</script>
