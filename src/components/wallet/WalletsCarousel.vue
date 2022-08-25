<template>
  <div v-if="walletStore.symbols.length > 0">
    <q-carousel
      v-if="props.asCarousel"
      v-model="slide"
      swipeable
      animated
      control-color="white"
      arrows
      height="150px"
      class="wallet-bg text-white shadow-1 rounded-borders">
      <q-carousel-slide
        v-for="symbol in walletStore.symbols"
        :key="symbol"
        :name="symbol"
        class="q-py-xs">
        <UserWallet :symbol="symbol" />
      </q-carousel-slide>
    </q-carousel>
    <template v-else>
      <div
        v-for="symbol in walletStore.symbols"
        :key="symbol"
        class="wallet-bg text-white shadow-1 rounded-borders q-mt-md"
        style="height: 120px">
        <UserWallet :symbol="symbol" />
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
  import { ref, watch } from 'vue'

  import { useWalletStore } from '~/stores/wallet'
  import UserWallet from './UserWallet.vue'

  const walletStore = useWalletStore()
  const slide = ref('')
  const props = defineProps<{
    asCarousel?: boolean
  }>()

  watch(
    () => walletStore.symbols,
    () => {
      if (walletStore.symbols.length > 0) {
        slide.value = walletStore.symbols[0]
      }
    },
    { immediate: true }
  )
</script>

<style lang="scss" scoped>
  .wallet-bg {
    background: rgba(9, 104, 114, 1);
  }
</style>
