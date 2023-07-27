<template lang="pug">
div.row
  q-card(flat).col
    q-card-section
      div.row
        
        // div(style="max-width: 30px;")

          // img(:src="walletIcon" alt="").full-width
        div.full-width
          
          p(style="font-size: 22px;").full-width.text-left {{ userStore.userBalancesSafe[symbol] }}
          p(style="font-size: 16px;  text-wrap: balance;").text-grey {{accountCost}} $
    
      div.row.justify-around.q-mt-md
        q-btn(dense size="xs"  label="Пополнить" @click="showDepositDialog" v-if="wallet?.canDeposit" icon="fa-solid fa-arrow-turn-down").q-ma-xs.q-pa-sm
        q-btn(dense size="xs"  label="Вывести" @click="showWithdrawDialog" v-if="wallet?.canWithdraw" icon="fa-solid fa-arrow-turn-up").q-ma-xs.q-pa-sm
        q-btn(dense size="xs"   color="primary" label="Перевод" @click="showTransferDialog" v-if="wallet?.canTransfer" icon="fa-solid fa-arrow-right").q-ma-xs.q-pa-sm
        q-btn(dense size="xs"   color="primary" label="Пополнить / вывести" @click="showChangeDialog" v-if="wallet?.canChange" icon="fa-solid fa-arrow-right-arrow-left").q-ma-xs.q-pa-sm
        q-btn(dense size="xs"   color="primary" label="Стейкинг" @click="showStakeDialog" v-if="wallet?.symbol == 'MAVRO'" icon="fa-solid fa-arrow-right-arrow-left").q-ma-xs.q-pa-sm


  q-dialog(v-model="dialog" persistent :maximized="false" transition-show="slide-up" transition-hide="slide-down")
    q-card(style="min-width: 350px; max-width: 100%;")
      div(v-if="showWithdraw")
        q-bar(style="background: 'primary'")
          span Вывод
          q-space
          q-btn(dense flat icon="close" v-close-popup)
            q-tooltip Close

        withdraw(:wallet="wallet" @withdrawFinish="withdrawFinish")
      
      div(v-if="showDeposit")
        q-bar(style="background: 'primary'")
          span Депозит
          q-space
          q-btn(dense flat icon="close" v-close-popup)
            q-tooltip Close

        deposit()

      div(v-if="showTransfer")
        q-bar(style="background: 'primary'")
          span Перевод
          q-space
          q-btn(dense flat icon="close" v-close-popup)
            q-tooltip Close

        transfer(:wallet="wallet" @withdrawFinish="withdrawFinish")


      
      
</template>

<script setup lang="ts">//
  import { computed, ref, watch, onMounted, onUnmounted } from 'vue'
  import { useUserStore } from '~/stores/user'
  import chains from '~/chainsMain'
  import walletIcon from '~/assets/wallet.svg'
  import deposit from '~/components/wallet/deposit.vue'
  import withdraw from '~/components/wallet/withdraw.vue'
  import transfer from '~/components/wallet/transfer.vue'
  import { useRouter } from 'vue-router'
  import { useHostStore } from '~/stores/host'
  import { useP2PStore } from '../p2p/store/index'


  const p2pStore = useP2PStore()
  const hostStore = useHostStore()
  
  import config from '~/config'

  const router = useRouter()

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
  let showTransfer = ref(false)


  const accountCost = computed(() => {
    return (accountValue.value * parseFloat(currentCoreRate.value)).toFixed(16)
  })

  const accountValue = computed(() => {
    return parseFloat(coreTokenBalance.value) + parseFloat(accountBlockedTokens.value) + parseFloat(chainAccountResources.value)
  })

  const chainAccountResources = computed(() => {
    if (userStore.userObject?.total_resources)
      return parseFloat(userStore.userObject?.total_resources?.net_weight) + parseFloat(userStore.userObject?.total_resources?.cpu_weight)
    else return 0
  })

  const accountBlockedTokens = computed(() => {
    return hostStore.userTokenStats[config.chains[0].coreSymbol] ? hostStore.userTokenStats[config.chains[0].coreSymbol].blocked_now : parseFloat(0) + " " + config.chains[0].coreSymbol
  })


  const coreTokenBalance = computed(() => {
    return parseFloat(userStore.userBalancesSafe[config.chains[0].coreSymbol]) || 0
  });

const refresh_id = ref(null)

const currentCoreRate = computed(() => {
    let p = parseFloat(0).toFixed(4) + ' ' + config.chains[0].coreSymbol
    
    let r = Object.values(p2pStore.usdrates).find(el => el.out_asset == p)
    
    if (r) 
      return parseFloat(r.rate).toFixed(16)
     
    else return 0

})


onUnmounted(async() => {
    clearInterval(refresh_id.value)
})


onMounted(async () => {
  
  p2pStore.get_usdrates()

  refresh_id.value = setInterval(function(){ 
      p2pStore.get_usdrates()
  }, 1000);
  
  if (userStore.username){
    userStore.getAccount(userStore.username)
    hostStore.getUserStat(userStore.username, config.chains[0].coreSymbol, "eosio.token")

  }
})

  const showChangeDialog = () => {
    router.push({name: 'p2p'})
  }


  const showStakeDialog = () => {
    router.push({name: 'pools'})
  }

  const showWithdrawDialog = () => {
    dialog.value = true
    showWithdraw.value = true
  }


  const showTransferDialog = () => {
    dialog.value = true
    showTransfer.value = true
  }

  const withdrawFinish = () => {
    dialog.value = false
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
