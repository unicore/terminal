<template>
  <div class="q-px-sm column justify-between wallet">
    <div class="col">
      <div class="q-pt-sm">Кошелёк {{ symbol }}</div>
    </div>
    <div class="balance q-px-lg text-h6 col-6 row justify-center items-center">
      <div>{{ userStore.userBalancesSafe[symbol] }}</div>
    </div>
    <div class="col row">
      <q-btn v-if="wallet?.canTransfer" class="col" rounded flat size="10px" label="перевод" />
      <q-btn v-if="wallet?.canDeposit" class="col" rounded flat size="10px" label="пополнить" />
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { useUserStore } from '~/stores/user'
  import chains from '~/chainsMain'

  const props = defineProps({
    symbol: {
      type: String,
      required: true,
    },
  })
  const userStore = useUserStore()
  const symbol = computed(() => props.symbol)
  const wallet = computed(() => {
    const rootChain = chains.getRootChain()

    return rootChain.getWalletBySymbol(symbol.value)
  })
</script>

<style lang="scss" scoped>
  .wallet {
    height: 100%;
    width: 100%;
  }
</style>
