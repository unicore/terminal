<template>
  <div class="pa-lg">
    <div v-if="!nftStore.loading" class="row q-col-gutter-md">
      <NftObjectCard
        v-for="id in nftStore.nftMarketIds"
        :id="nftStore.getNftIdByMarketId(id)"
        :key="id"
        class="col-12 col-md-6"
        with-market
        :readmore="props.readmore"
        :market-id="id" />
    </div>
    <div v-else class="row q-col-gutter-md">
      <div v-for="i in 4" :key="i" class="col-12 col-md-6">
        <q-card>
          <q-skeleton height="300px" width="100%" />

          <q-item-section>
            <q-item-label>
              <q-skeleton type="text" />
            </q-item-label>
            <q-item-label caption>
              <q-skeleton type="text" />
            </q-item-label>
          </q-item-section>

          <q-item-section>
            <q-item-label caption>
              <q-skeleton type="text" />
            </q-item-label>
          </q-item-section>

          <q-item-section>
            <q-item-label caption>
              <q-skeleton type="text" />
            </q-item-label>
          </q-item-section>

          <q-item-section>
            <q-item-label caption>
              <q-skeleton type="text" />
            </q-item-label>
          </q-item-section>

          <q-card-actions class="q-gutter-md">
            <q-skeleton type="QBtn" />
            <q-skeleton type="QBtn" />
          </q-card-actions>
        </q-card>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { onMounted } from 'vue'
  import NftObjectCard from '~/components/nft/NftObjectCard.vue'
  import { useNftStore } from '~/stores/nft'

  const nftStore = useNftStore()
  const props = defineProps<{
    readmore?: boolean
  }>()

  const loadObjectsList = async () => {
    await nftStore.loadAvailableNfts()
  }

  onMounted(() => {
    loadObjectsList()
  })
</script>
