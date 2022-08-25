<template>
  <q-card-actions v-if="!hasMarketObjects || totalPiecesInMarket < object.total_pieces">
    <NftSellButton :id="id" :remain-pieces="object.total_pieces - totalPiecesInMarket" />
    <NftCreateObject :edit-id="id" is-editing />
    <NftRemoveButton v-if="!hasMarketObjects" :id="id" />
  </q-card-actions>
  <q-card-actions v-else>
    <NftCreateObject :edit-id="id" is-editing />
  </q-card-actions>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { NftObject } from 'unicore/ts/src/blockchain/contracts/nft'

  import { useNftStore } from '~/stores/nft'

  import NftSellButton from './NftSellButton.vue'
  import NftRemoveButton from './NftRemoveButton.vue'
  import NftCreateObject from './NftCreateObject.vue'

  const props = defineProps<{
    id: number
  }>()
  const nftStore = useNftStore()

  const object = computed<NftObject>(() => nftStore.getNftById(props.id))
  const hasMarketObjects = computed(() => {
    const nftMarketId = nftStore.getNftMarketIdByNftId(props.id)
    return !!nftMarketId
  })
  const marketObjects = computed(() => {
    const nftMarketIds = nftStore.getNftMarketIdsByNftId(props.id)
    return nftMarketIds.map((id) => nftStore.getNftMarketById(id))
  })
  const totalPiecesInMarket = computed(() =>
    marketObjects.value.reduce((a, b) => a + b.blocked_pieces + b.remain_pieces, 0)
  )
</script>

<style lang="scss" scoped></style>
