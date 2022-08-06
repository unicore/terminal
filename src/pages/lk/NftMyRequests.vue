<template>
  <div class="q-pa-md">
    <h5 class="text-h5">Мои заявки на покупку</h5>

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
