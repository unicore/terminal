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
        <UserWallet :symbol="symbol" :mini="props.mini" />
      </q-carousel-slide>
    </q-carousel>
    <template v-else>
      <q-card
        bordered
        style="border: 1px solid grey; height: 120px"
        v-for="symbol in walletStore.symbols"
        :key="symbol"
        class="shadow-1 rounded-borders q-mt-md"
        >
        <UserWallet :symbol="symbol" :mini="props.mini" />
      </q-card>
    </template>
  </div>
</template>

<script setup lang="ts">
  import { ref, watch, onMounted,onUnmounted } from 'vue'

  import { useWalletStore } from '~/stores/wallet'
  import UserWallet from './UserWallet.vue'
  import { useUserStore } from '~/stores/user'
  

  const walletStore = useWalletStore()
  const slide = ref('')
  const props = defineProps<{
    asCarousel?: boolean
    mini?: boolean
  }>()
  const refresh_id = ref(null)


  const userStore = useUserStore()

  onMounted(async () => {

    refresh_id.value = setInterval(function() { 
      userStore.getUserBalances()
    }, 20000);

  })


  onUnmounted(async() => {
      clearInterval(refresh_id.value)
  })


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
