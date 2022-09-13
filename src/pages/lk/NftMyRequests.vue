<template>
  <div class="q-pa-md">
    <NftAllRequests />
  </div>
</template>

<script setup lang="ts">
  import { onMounted } from 'vue'
  import NftAllRequests from '~/components/nft/NftAllRequests.vue'

  import { useNftStore } from '~/stores/nft'

  const nftStore = useNftStore()

  const loadObjectsList = async () => {
    await nftStore.loadAvailableNfts()
  }

  onMounted(() => {
    loadObjectsList()
  })
</script>

<route lang="yaml">
meta:
  menuOrder: 3
  icon: order
</route>
