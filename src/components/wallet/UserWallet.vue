<template lang="pug">

div  
.column.justify-between(:class="props.mini ? 'wallet-mini' : 'wallet'")
  .col(v-if="!props.mini")
    .wallet-header Кошелёк {{ symbol }}
  .balance(v-if="!props.mini")
    img.wallet-icon(:src="walletIcon", alt="")
    | {{ userStore.userBalancesSafe[symbol] }}
  .buttons.flex.stretch.row(:class="wallet?.canDeposit && wallet?.canTransfer && 'three-items'")
    .stretch.col-6
      q-btn.full-width(flat, dense, size="10px", label="Пополнить"  @click="showDepositDialog" v-if="wallet?.canDeposit")
    .stretch.col-6
      q-btn.full-width(flat, dense, size="10px", label="Вывести" @click="showWithdrawDialog" v-if="wallet?.canWithdraw")
  

  q-dialog(v-model="dialog" persistent :maximized="false" transition-show="slide-up" transition-hide="slide-down")
    q-card(style="min-width: 350px; max-width: 100%;").bg-primary.text-white
      div(v-if="showWithdraw")
        q-bar
          span Вывод
          q-space
          q-btn(dense flat icon="close" v-close-popup)
            q-tooltip Close

        withdraw(:wallet="wallet" @withdrawFinish="withdrawFinish")
      
      div(v-if="showDeposit")
        q-bar
          span Депозит
          q-space
          q-btn(dense flat icon="close" v-close-popup)
            q-tooltip Close

        deposit()


      
      
</template>

<script setup lang="ts">//
  import { computed, ref, watch } from 'vue'
  import { useUserStore } from '~/stores/user'
  import chains from '~/chainsMain'
  import walletIcon from '~/assets/wallet.svg'
  import deposit from '~/components/wallet/deposit.vue'
  import withdraw from '~/components/wallet/withdraw.vue'

  const props = defineProps({
    symbol: {
      type: String,
      required: true,
    },
    mini: {
      type: Boolean,
      required: false,
    },
  })

  let dialog = ref(false)
  const slide = ref('')
  const userStore = useUserStore()
  const symbol = computed(() => props.symbol)
 
  const wallet = computed(() => {
    const rootChain = chains.getRootChain()
    return rootChain.getWalletBySymbol(symbol.value)
  })

  let showWithdraw = ref(false)
  let showDeposit = ref(false)


  const showWithdrawDialog = () => {
    dialog.value = true
    showWithdraw.value = true
  }

  const withdrawFinish = () => {
    dialog.value = false
    console.log("withdrawFinish")
  }

  const showDepositDialog = () => {
    dialog.value = true
    showDeposit.value = true
  }

  watch(dialog, () => {
    if (dialog.value == false) {
      showWithdraw.value = false
      showDeposit.value = false
    }
  })

</script>

<style lang="scss" scoped>
  .wallet {
    padding: 11px 25px;
    height: 100%;
    width: 100%;
    position: relative;
  }

  .wallet-mini {
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

  .balance-mini {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
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
      padding: 10px 5px;
      text-transform: none;
    }
  }

  .wallet-icon {
    display: inline-block;
    vertical-align: baseline;
    margin-right: 13px;
  }

  .wallet-icon-mini {
    display: inline-block;
    vertical-align: baseline;
  }
</style>
