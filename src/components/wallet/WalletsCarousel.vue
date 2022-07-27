<template>
  <div v-if="walletStore.symbols.length > 0">
    <q-carousel
      v-model="slide"
      swipeable
      animated
      control-color="white"
      arrows
      height="150px"
      class="bg-blue-grey-7 text-white shadow-1 rounded-borders">
      <q-carousel-slide
        v-for="symbol in walletStore.symbols"
        :key="symbol"
        :name="symbol"
        class="q-py-xs">
        <UserWallet :symbol="symbol" />
      </q-carousel-slide>
    </q-carousel>
  </div>
</template>

<script setup lang="ts">
  import { ref, watch } from 'vue'

  import { useWalletStore } from '~/stores/wallet'
  import UserWallet from './UserWallet.vue'

  const walletStore = useWalletStore()
  const slide = ref('')

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

<style lang="scss" scoped></style>
