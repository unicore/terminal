<template>
  <div>
    <q-card :class="owned && 'bg-light-green-1'">
      <NftImages :id="props.id" />

      <q-card-section class="q-py-sm">
        <div class="text-h6">{{ object.title }}</div>
        <NftObjectPieces :id="id" :with-market="withMarket" :market-id="props.marketId" />
      </q-card-section>

      <q-card-section v-if="object.description" class="q-py-sm pre-wrap">{{
        object.description
      }}</q-card-section>

      <q-card-section class="q-py-sm">
        NFT разместил: {{ object.creator }} <span v-if="owned">(это вы)</span>
      </q-card-section>

      <NftControlButtons v-if="withOwnerControls" :id="id" />

      <NftMarketObject v-if="props.withMarket" :id="marketId" :readmore="readmore" />
    </q-card>
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { NftObject } from 'unicore/ts/src/blockchain/contracts/nft'
  import { useUserStore } from '~/stores/user'
  import { useNftStore } from '~/stores/nft'
  import NftImages from './NftImages.vue'
  import NftControlButtons from './NftControlButtons.vue'
  import NftMarketObject from './NftMarketObject.vue'
  import NftObjectPieces from './NftObjectPieces.vue'

  const props = defineProps<{
    id: number
    withOwnerControls?: boolean
    withMarket?: boolean
    marketId?: number
    readmore?: boolean
  }>()
  const nftStore = useNftStore()
  const userStore = useUserStore()

  const object = computed<NftObject>(() => nftStore.getNftById(props.id))
  const marketId = computed(() => props.marketId as number)

  const owned = computed(() => object.value.creator === userStore.username)
</script>

<style lang="scss" scoped>
  .pre-wrap {
    white-space: pre-wrap;
  }
</style>
