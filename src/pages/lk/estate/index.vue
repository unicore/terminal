<template lang="pug">
div.pa-lg
  div(v-if="!nftStore.loading" class="row q-col-gutter-md pa-4")
    EstateObjectCard(
      v-for="id in nftStore.nftMarketIds",
      :id="nftStore.getNftIdByMarketId(id)",
      :key="id",
      class="col-12 col-md-4",
      :market-id="id"
    )
  div(v-else class="row q-col-gutter-md")
    div(v-for="i in 4" :key="i" class="col-12 col-md-4")
      q-card
        q-skeleton(height="300px" width="100%")
        q-item-section
          q-item-label
            q-skeleton(type="text")
          q-item-label(caption)
            q-skeleton(type="text")
        q-item-section
          q-item-label(caption)
            q-skeleton(type="text")
        q-item-section
          q-item-label(caption)
            q-skeleton(type="text")
        q-item-section
          q-item-label(caption)
            q-skeleton(type="text")
        q-card-actions(class="q-gutter-md")
          q-skeleton(type="QBtn")
          q-skeleton(type="QBtn")
</template>


<script setup lang="ts">
  import { onMounted } from 'vue'
  import EstateObjectCard from 'src/components/estate/EstateObjectCard.vue'
  import { useNftStore } from '~/stores/nft'

  const nftStore = useNftStore()

  const loadObjectsList = async () => {
    await nftStore.loadAvailableNfts()
  }

  onMounted(() => {
    loadObjectsList()
  })
</script>

<route lang="yaml">
meta:
  menuOrder: 1
  icon: union
</route>
