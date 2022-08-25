<template>
  <div>
    <EstateObjectCard :id="props.id" :market-id="null">
      <template #moreData>
        <NftMarketInfo :id="props.id" />
      </template>
      <template #buttons>
        <NftControlButtons :id="props.id" />
      </template>
    </EstateObjectCard>
  </div>
</template>

<script setup lang="ts">
  import EstateObjectCard from '~/components/estate/EstateObjectCard.vue'
  import NftMarketInfo from '~/components/nft/NftMarketInfo.vue'
  import NftControlButtons from '~/components/nft/NftControlButtons.vue'

  const props = defineProps<{
    id: number
  }>()
</script>
