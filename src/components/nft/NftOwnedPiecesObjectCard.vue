<template>
  <div>
    <EstateObjectCard :id="pieceObject.object_id" :market-id="null">
      <template #moreData>
        <q-list padding dense separator>
          <q-item>
            <q-item-section>
              <q-item-label overline>Куплено частей: {{ pieceObject.pieces }}</q-item-label>
              <q-item-label overline>День начала: {{ pieceObject.day_start }}</q-item-label>
              <q-item-label overline>День окончания: {{ pieceObject.day_finish }}</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </template>
    </EstateObjectCard>
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { NftPieceObject } from 'unicore/dist/src/blockchain/contracts/nft'
  import EstateObjectCard from '~/components/estate/EstateObjectCard.vue'
  import { useNftStore } from '~/stores/nft'

  const nftStore = useNftStore()

  const props = defineProps<{
    id: number
  }>()

  const pieceObject = computed<NftPieceObject>(() => {
    return nftStore.getPieceById(props.id)
  })
</script>
