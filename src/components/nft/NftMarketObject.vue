<template>
  <q-badge size="lg" floating color="teal" style="font-size: 14px" class="q-pa-sm">
    от {{ object.min_piece_price }} за одну часть
  </q-badge>

  <q-card-actions>
    <NftMarketBuy :id="props.id" />
  </q-card-actions>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { NftMarketObject } from 'unicore/ts/src/blockchain/contracts/nft'
  import { useNftStore } from '~/stores/nft'
  import NftMarketBuy from './NftMarketBuy.vue'

  const props = defineProps<{
    id: number
    readmore?: boolean
  }>()
  const nftStore = useNftStore()

  const object = computed<NftMarketObject>(() => nftStore.getNftMarketById(props.id))
</script>

<style lang="scss" scoped>
  .text-link {
    color: #028dc8;
    display: inline;
  }
</style>
