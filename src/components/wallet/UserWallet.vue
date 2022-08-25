<template>
  <div class="column justify-between wallet">
    <div class="col">
      <div class="wallet-header">Кошелёк {{ symbol }}</div>
    </div>
    <div class="balance">
      <img :src="walletIcon" alt="" class="wallet-icon" />
      {{ userStore.userBalancesSafe[symbol] }}
    </div>
    <div
      class="buttons flex stretch"
      :class="wallet?.canDeposit && wallet?.canTransfer && 'two-items'">
      <div v-if="wallet?.canDeposit" class="stretch">
        <q-btn flat size="10px" label="Пополнить" />
      </div>
      <div v-if="wallet?.canTransfer" class="stretch">
        <q-btn flat size="10px" label="Перевести" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { useUserStore } from '~/stores/user'
  import chains from '~/chainsMain'
  import walletIcon from '~/assets/wallet.svg'

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
    padding: 11px 25px;
    height: 100%;
    width: 100%;
    position: relative;
  }

  .wallet-header {
    font-style: normal;
    font-weight: 700;
    font-size: 14px;
    line-height: 18px;
    color: #ecb464;
  }

  .balance {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    margin-left: -13px;
    font-style: normal;
    font-weight: 400;
    font-size: 18px;
    white-space: nowrap;
  }

  .buttons {
    position: absolute;
    bottom: 10px;
    left: 25px;
    right: 25px;
    height: 30px;

    &.two-items > div {
      width: 50%;
    }

    .q-btn {
      width: 100%;
      font-style: normal;
      font-weight: 400;
      font-size: 12px;
      line-height: 16px;

      min-height: 30px;
      padding: 10px 20px;
      text-transform: none;
    }
  }

  .wallet-icon {
    display: inline-block;
    vertical-align: baseline;
    margin-right: 13px;
  }
</style>
