<template>
  <NftRequests
    v-if="nftRequestIdsAsSeller.length > 0"
    :ids="nftRequestIdsAsSeller"
    title="Входящие заявки на покупку" />
  <NftRequests
    v-if="nftRequestIdsAsBuyer.length > 0"
    :ids="nftRequestIdsAsBuyer"
    title="Ваши заявки на покупку" />
</template>

<script setup lang="ts">
  import { computed } from 'vue'

  import { useUserStore } from '~/stores/user'
  import { useNftStore } from '~/stores/nft'

  import NftRequests from './NftRequests.vue'

  const userStore = useUserStore()
  const nftStore = useNftStore()

  const nftRequestIdsAsSeller = computed<number[]>(() =>
    nftStore.getNftMarketRequestIdsBySeller(userStore.username!)
  )
  const nftRequestIdsAsBuyer = computed<number[]>(() =>
    nftStore.getNftMarketRequestIdsByBuyer(userStore.username!)
  )
</script>

<style lang="scss" scoped></style>
