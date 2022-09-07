<template>
  <q-list v-if="hasMarketObjects" padding dense separator>
    <q-item>
      <q-item-section>
        <q-item-label overline>Всего частей: {{ object.total_pieces }}</q-item-label>
      </q-item-section>
    </q-item>
    <q-item>
      <q-item-section>
        <q-item-label overline>В продаже:</q-item-label>
      </q-item-section>
    </q-item>
    <q-item v-for="i in marketObjects" :key="i.id">
      <q-item-section>
        <q-item-label> Продаётся {{ t('numbers.piece', i.remain_pieces) }} </q-item-label>
        <q-item-label> Куплено {{ t('numbers.piece', i.blocked_pieces) }} </q-item-label>
      </q-item-section>
      <q-item-section side>
        <q-item-label caption>
          <q-badge size="lg" color="teal" style="font-size: 14px" class="q-pa-sm">
            от {{ i.min_piece_price }}
          </q-badge>
        </q-item-label>
      </q-item-section>
    </q-item>
    <q-item>
      <q-item-section>
        <q-item-label overline
          >Суммарно на рынке {{ t('numbers.piece', totalPiecesInMarket) }}</q-item-label
        >
      </q-item-section>
    </q-item>
  </q-list>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { useI18n } from 'vue-i18n'

  import { useNftStore } from '~/stores/nft'
  import { NftObject } from 'unicore/dist/esm/src/blockchain/contracts/nft'

  const props = defineProps<{
    id: number
  }>()
  const nftStore = useNftStore()
  const { t } = useI18n()

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
