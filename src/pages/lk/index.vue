<template>
  <div class="q-pa-md">
    <AccountEvents v-if="userStore.username" :username="userStore.username" />
  </div>
</template>

<script setup lang="ts">
  import { onMounted } from 'vue'

  import { useUserStore } from '~/stores/user'
  import { useNftStore } from '~/stores/nft'
  import AccountEvents from '~/components/explorer/AccountEvents.vue'

  const nftStore = useNftStore()
  const loadRequests = async () => {
    await nftStore.loadAvailableNfts()
  }

  onMounted(() => {
    loadRequests()
  })

  const userStore = useUserStore()
</script>

<route lang="yaml">
meta:
  menuOrder: 4
  icon: history
</route>
