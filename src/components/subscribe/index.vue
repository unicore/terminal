<template lang="pug">
div
  // div.row
    // p Для получения статуса "ПАРТНЁР" купите подписку. 
  // p userProducts: {{userProducts}}
  div(v-if="coreProduct").row
    div.col-md-4.col-xs-12.q-pa-md
      div.header
        p 1. Пополните кошелёк
      q-card(dark)
        deposit
    div.col-md-4.col-xs-12.q-pa-md
      div.header
        p 2. Обновите кошелёк
        
      q-card(dark )
      
        div(v-if="symbol")
          q-input(filled label-color="white" label="Средства будут зачислены через несколько минут:" dark readonly v-model="userStore.userBalancesSafe[symbol]")
          q-btn().full-width
            i.fa.fa-refresh
            span.q-ml-md обновить

    



    div.col-md-4.col-xs-12.q-pa-md
      div.header
        p 3. Купите подписку
      baseSubscriptionCard(:product="coreProduct" @buyFinish="buyFinish")
    

</template>

<script setup lang="ts">

import { computed, ref, onMounted, watch} from 'vue'
import { useUserStore } from '~/stores/user'
import { useHostStore } from '~/stores/host'
import { useRouter } from 'vue-router'
import userBalance from '~/components/core/oneUserBalance.vue'
import UserWallet from '~/components/wallet/UserWallet.vue'
import deposit from '~/components/wallet/deposit.vue'
import baseSubscriptionCard from '~/components/products/baseSubscriptionCard.vue'
import chains from '~/chainsMain'

const router = useRouter()

const hostStore = useHostStore()
const userStore = useUserStore()
import config from '~/config'
const conditions = computed(() => {return hostStore.conditions})

const emit = defineEmits(['statusChecked'])
const symbol = ref(false)



const wallet = computed(() => {
  if (symbol.value){
    const rootChain = chains.getRootChain()
    return rootChain.getWalletBySymbol(symbol.value)
  }
})

const buyFinish = () => {
  init()
}

const init = async () => {
  if (config.subscribe.enabled){
      if (loggedIn) {
        await hostStore.checkSubscription(config.subscribe.coreHost, userStore.username)
        // emit('statusChecked', userIsSubscriber)  
      } else {
        // emit('statusChecked', false)
      }
    } else {
      // emit('statusChecked', true)
    }
}

const userProducts = computed(() => {return hostStore.userProducts})

const coreProduct = computed(() => {return hostStore.products[hostStore.conditions['coreproduct']]})


const loggedIn = computed(() => {
  return userStore.hasAuth
})

const userIsSubscriber = computed(() => {
  if (loggedIn){
    //TODO check for expiration

    return hostStore.getUserStatus
  } else return false
})


watch(coreProduct, () => {
  if (coreProduct.value.price){
    const [amount, sym] = coreProduct.value.price.split(" ")
    symbol.value = sym
  } 
})

onMounted(async () => {

    init()

})

</script>

<style lang="scss" scoped>
.wallet-bg {
    background: rgba(9, 104, 114, 1);
  }

.header p {
  font-size: 24px;
}
</style>