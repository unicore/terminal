<template lang="pug">
div
  div(v-if="!isAuthed").row.justify-center
    div.col-md-4.col-xs-12
      q-card(bordered).q-pa-md
        AuthForm
  
  div(v-if="isAuthed")
    div(v-if="flow && !loading")
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
              p(v-if="!amountIsEnought").full-width.text-center недостаточный баланс
              q-btn(flat :disable="!amountIsEnought" @click="buyProduct").full-width
                i.fa-solid.fa-cart-shopping
                span.q-ml-md купить


      div(v-else).row.justify-center
        div.col-md-6.col-xs-12.q-pa-md
          // если билет в состоянии баланса спирали
          div(v-if="!hasProduct && balance && balance.host")
            
            oneTicketBalance(v-if="flow" :balance="balance" :flow="flow" :product="product")
          div(v-else)
            ticket(:flow="flow")

            //если билет выведен из спирали
            
            // div(v-for="balance of balances" v-bind:key="balance.id")
          
    div(v-if="!flow && !balance && !hasProduct || loading")
      loader
            
          
</template>

<script setup lang="ts">
import deposit from '~/components/wallet/deposit.vue'
import { computed, ref, onMounted, watch} from 'vue'
import { useUserStore } from '~/stores/user'
import { useHostStore } from '~/stores/host'
import { useWalletStore } from '~/stores/wallet'
import loader from '~/components/common/loader.vue'

import { useRouter } from 'vue-router'
import userBalance from '~/components/core/oneUserBalance.vue'
import config from '~/config'
import chains from '~/chainsMain'
import productCard from '~/components/products/productCard.vue'
import { Notify } from 'quasar'
import oneTicketBalance from './oneTicketBalance.vue'
import ticket from './ticket.vue'
import AuthForm from '~/components/user/AuthForm.vue'

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


const isAuthed = computed(() => {
  return userStore.hasAuth
})


let product = ref(null)
let loading = ref(false)
let symbol = ref(null)
      
const amount = computed(() => {
  if (symbol.value)
    return userStore.userBalancesSafe[symbol.value]
})


const hasProduct = computed(() => userProducts.value.find(el => el.product_id == flow.value.product_id) || false)

const flows = computed(() => {
  if (product.value){

    return Object.values(hostStore.flows).filter(f => f.product_id == product.value.id).reverse()
  } else return []
})

const amountIsEnought = computed(() => {
  if (amount.value && product.value.total)
    return parseFloat(amount.value) >= parseFloat(product.value.total)
})

const flow = computed(() => {
  return flows.value[0] || false
})

const filteredBalancesByFlow = computed(() => {

  let bals = balances.value.filter(el => {
    try {
      let parsedMeta = JSON.parse(el.meta);
      return parsedMeta && parsedMeta.flow_id === flow.value.id;
    } catch (error) {
      // Обработка ошибки при парсинге JSON.
      // console.error("Error parsing JSON: ", error);
      return false;
    }
  });

  return bals

})

const balance = computed(() => {
  
  return filteredBalancesByFlow.value[0] || false
});

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


async function load() {
  loading.value = true
  await hostStore.loadHosts()
  await hostStore.loadBalances(userStore.username, hostname.value)
  await hostStore.loadFlows(hostname.value)

  if (userStore.hasAuth)
    await hostStore.loadMyProducts(hostname.value, userStore.username) 

  loading.value = false
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

const rates = computed(() => {
  return hostStore.rates
})
const hosts = computed(() => hostStore.getHosts)
const host = computed(() => hosts.value[config.coreHost])


const buyProduct = async () => {

    loading.value = true
    
    try {

      const rootChain = chains.getRootChain();
      const api = rootChain.getEosPassInstance(userStore.authData?.wif as string);

      await hostStore.loadRates(config.coreHost);
      
      let currentPoolRemain = parseFloat(host.value.currentPool.remain);
      let total = parseFloat(product.value.total);
      let actions = [];

      if (currentPoolRemain < total) {
         actions.push({
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
              quantity: currentPoolRemain.toFixed(4)  + ' ' + host.value.symbol,
              memo: `100-${config.coreHost}`,
            },
          },
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
              quantity: (total - currentPoolRemain).toFixed(4)  + ' ' + host.value.symbol,
              memo: `800-${config.coreHost}`,
            },
          }
          );
      } else {

          actions.push({
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
              quantity: total.toFixed(4)  + ' ' + host.value.symbol,
              memo: `100-${config.coreHost}`,
            },
          })

      }
      console.log("actions", actions)
       
      const data = await api.transact(
        {
          actions: actions
        },
        {
          blocksBehind: 3,
          expireSeconds: 30,
        }
      )


      const actionTraces = data.processed.action_traces;

      for (let i = 0; i < actionTraces.length; i++) {
        const actionTrace = actionTraces[i];
        const inlineTraces = actionTrace.inline_traces;

        for (let j = 0; j < inlineTraces.length; j++) {
          const inlineTrace = inlineTraces[j];
          const cons = inlineTrace.console;
          const regex = /BALANCE_ID: (\w+);?/gi;
          const group = regex.exec(cons);
          

        if (group && group[1]) {
          const balanceId = group[1];

          let meta = JSON.stringify({
            product_id: product.value.id,
            flow_id: flow.value.id
          });

          const data2 = await api.transact(
            {
              actions: [
                {
                  account: config.tableCodeConfig.core,
                  name: 'setbalmeta',
                  authorization: [
                    {
                      actor: userStore.username as string,
                      permission: 'active',
                    },
                  ],
                  data: {
                    username: userStore.username,
                    host: config.coreHost,
                    balance_id: balanceId,
                    meta
                  },
                },
              ]
            },
            {
              blocksBehind: 3,
              expireSeconds: 30,
            }
          );

          // Дополнительные действия или обработка после вызова setbalmeta
        }
      }
    }

      Notify.create({
        message: 'Продукт куплен',
        color: 'positive',
      })

      await load()      

      // router.push({name: "welcome"})

    } catch (e: any) {
      console.error(e);
      Notify.create({
        message: 'Произошла ошибка: ' + e.message,
        color: 'negative',
      })
    } finally {
    loading.value = false;
    }

}






</script>
