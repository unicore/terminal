<template lang="pug">
div
  div(v-if="flow")
    div(v-if="!balance && !hasProduct" style="align-items: baseline;").row
      
      div.col-md-4.col-xs-12.q-pa-md
        div.header
          p 1. Пополните кошелёк
        q-card(dark)
          deposit

      div.col-md-4.col-xs-12.q-pa-md
        div.header
          p 2. Дождитесь поступления
          
        q-card(dark)
          div
            q-input(filled label-color="white" label="Средства будут зачислены через несколько минут:" dark readonly v-model="amount")
            q-btn(@click="refresh").full-width
              i.fa.fa-refresh
              span.q-ml-md обновить

      div.col-md-4.col-xs-12
        div.header
          p 3. Купите NFT-билет
        q-card(v-if="product" dark)
          
          div.q-pa-md
            p(style="font-size: 18px;") {{product.title}}
            p {{product.description}}
            q-badge() {{product.total}}
           
          q-card-actions.q-mt-lg
            hr
            q-btn(flat  @click="buyProduct").full-width
              i.fa-solid.fa-cart-shopping
              span.q-ml-md купить


    div(v-else).row
      div.col-md-6.q-pa-md
        // p flow {{flow}}
        // p {{flows[0]}}
        // p products {{products}}
        
        // p hasProduct {{hasProduct}}

        // если билет в состоянии баланса спирали
        div(v-if="!hasProduct && balance")
          oneTicketBalance(v-if="flow" :balance="balance" :flow="flow" :product="product")
        div(v-else)
          ticket(:flow="flow")

          //если билет выведен из спирали
          
          // div(v-for="balance of balances" v-bind:key="balance.id")
        
  div(v-if="!flow && !balance && !hasProduct")
    p no active flow
          
          
</template>

<script setup lang="ts">
import deposit from '~/components/wallet/deposit.vue'
import { computed, ref, onMounted, watch} from 'vue'
import { useUserStore } from '~/stores/user'
import { useHostStore } from '~/stores/host'
import { useWalletStore } from '~/stores/wallet'

import { useRouter } from 'vue-router'
import userBalance from '~/components/core/oneUserBalance.vue'
import config from '~/config'
import chains from '~/chainsMain'
import productCard from '~/components/products/productCard.vue'
import { Notify } from 'quasar'
import oneTicketBalance from './oneTicketBalance.vue'
import ticket from './ticket.vue'

const router = useRouter()

const hostStore = useHostStore()
const userStore = useUserStore()
const walletStore = useWalletStore()

const products = computed(() => {
  return Object.values(hostStore.products)
})

const userProducts = computed(() => {
  return Object.values(hostStore.userProducts)
})


let product = ref(null)
let loading = ref(false)
let symbol = ref(null)
      
const amount = computed(() => {
  if (symbol.value)
    return userStore.userBalancesSafe[symbol.value]
})

const hosts = computed(() => hostStore.getHosts)

const hasProduct = computed(() => userProducts.value.find(el => el.product_id == flow.value.product_id) || false)

const flows = computed(() => {
  if (product.value){

    return Object.values(hostStore.flows).filter(f => f.product_id == product.value.id).reverse()
  } else return []
})

const flow = computed(() => {
  return flows.value[0] || false
})

const balance = computed(() => {
  return balances.value[0] || false
})

let balances = computed(() => {
  return Object.values(hostStore.getBalances) || []
})


watch(products, (newValue) => {
  init()
})


onMounted(async () => {
   await load()
   init() 
})

let hostname = computed(() => {
  if ('hostname' in router.currentRoute.value.params)
    return router.currentRoute.value.params.hostname
  else return false
})


let id = computed(() => {
  if ('id' in router.currentRoute.value.params)
    return router.currentRoute.value.params.id
  else return false
})

async function refresh(){
  userStore.getUserBalances()
}

async function calculateDiscount(balance) {

  return balance.available
}

async function load() {
  await hostStore.loadBalances(userStore.username, hostname.value)
  await hostStore.loadFlows(hostname.value)

  if (userStore.hasAuth)
    await hostStore.loadMyProducts(hostname.value, userStore.username) 

}

async function init() {
  
  if (products.value.length > 0 && hostname.value  && id.value) {
    let pr = products.value.find(el => el.host == router.currentRoute.value.params.hostname && el.id == router.currentRoute.value.params.id)
    product.value = pr
    
    let [a, s] = product.value.total.split(" ")
    symbol.value = s

  } else {
    product.value = null
  } 

  

}


const buyProduct = async () => {

    loading.value = true
    
    try {

      const rootChain = chains.getRootChain()
      const api = rootChain.getEosPassInstance(userStore.authData?.wif as string)
      let actions = [
            {
              account: product.value.token_contract,
              name: 'transfer',
              authorization: [
                {
                  actor: userStore.username as string,
                  permission: 'active',
                },
              ],
              data: {
                from: userStore.username,
                to: config.tableCodeConfig.core,
                quantity: product.value.total,
                memo: `100-${config.coreHost}`
              },
            },
          ]
      
      console.log("actions: ", actions)

      await api.transact(
        {
          actions
        },
        {
          blocksBehind: 3,
          expireSeconds: 30,
        }
      )

      Notify.create({
        message: 'Продукт куплен',
        color: 'positive',
      })

      loading.value = false
      load()
      // router.push({name: "welcome"})

    } catch (e: any) {
      
      Notify.create({
        message: 'Произошла ошибка: ' + e.message,
        color: 'negative',
      })
    }

    loading.value = false
}






</script>
