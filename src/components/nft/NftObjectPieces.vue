<template>
  <div class="text-subtitle2">
    {{ t('numbers.piece', (withMarket && marketPieces) || object.total_pieces)
    }}{{ withMarket ? ` к продаже из ${object.total_pieces}` : '' }}
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { useI18n } from 'vue-i18n'
  import { NftObject, NftMarketObject } from 'unicore/ts/src/blockchain/contracts/nft'

  import { useNftStore } from '~/stores/nft'

  const props = defineProps<{
    id: number
    marketId?: number
    withMarket?: boolean
  }>()
  const nftStore = useNftStore()
  const { t } = useI18n()

  const object = computed<NftObject>(() => nftStore.getNftById(props.id))
  const marketObject = computed<NftMarketObject | null>(() => {
    const nftMarketId = props.marketId || nftStore.getNftMarketIdByNftId(props.id)
    return nftMarketId ? nftStore.getNftMarketById(nftMarketId) : null
  })
  const marketPieces = computed(() => {
    return marketObject.value?.remain_pieces
  })
</script>

<style lang="scss" scoped></style>
