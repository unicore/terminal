<template>
  <div class="column flex-center pa-4">TODO HOME</div>
</template>

<script setup lang="ts">
  import { onMounted } from 'vue'
  import { useRouter } from 'vue-router'

  const router = useRouter()

  onMounted(() => {
    router.push({ name: 'public-NftMarket' })
  })
</script>

<route lang="yaml">
meta:
  hide: true
</route>
