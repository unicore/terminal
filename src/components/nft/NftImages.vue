<template>
  <q-carousel v-model="slide" v-model:fullscreen="fullscreen" animated arrows navigation infinite>
    <q-carousel-slide v-for="(img, i) in images" :key="i" :name="i" :img-src="img" />

    <template #control>
      <q-carousel-control position="bottom-right" :offset="[18, 18]">
        <q-btn
          push
          round
          dense
          color="white"
          text-color="primary"
          :icon="fullscreen ? 'fullscreen_exit' : 'fullscreen'"
          @click="fullscreen = !fullscreen" />
      </q-carousel-control>
    </template>
  </q-carousel>
</template>

<script setup lang="ts">
  import { computed, ref } from 'vue'
  import { NftObject } from 'unicore/ts/src/blockchain/contracts/nft'
  import { useNftStore } from '~/stores/nft'
  import config from '~/config'

  const props = defineProps<{
    id: number
  }>()
  const nftStore = useNftStore()

  const object = computed<NftObject>(() => nftStore.getNftById(props.id))

  const images = computed(() => {
    if (object.value.images && object.value.images.length > 0) {
      return object.value.images.map((i) => {
        if (i.startsWith('http')) {
          return i
        }
        return `${config.storageUrl}${i}`
      })
    }

    return ['https://placeimg.com/1920/1080/nature', 'https://placeimg.com/1920/1080/tech']
  })
  const slide = ref(0)
  const fullscreen = ref(false)
</script>

<style lang="scss" scoped></style>
