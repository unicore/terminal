<template lang="pug">
div
  q-card(bordered flat :dark="isDark" v-bind:style="{color: color}").nft-balance
    
    q-badge(floating) № {{balance.id}}
    
    q-card-section
      div
        span пул входа: 
        span.q-pa-sm {{balance.pool_num}}
        q-separator(:dark="isDark")
      div
        span сумма стейкинга: 
        span.q-pa-sm {{balance.purchase_amount}}
        q-separator(:dark="isDark")
      // div
      //   span сумма конвертаций: 
      //   span.q-pa-sm {{balance.start_convert_amount}}
      //   q-separator(:dark="isDark")
      
      div
        // (v-if="balance.root_percent > 0")
        span доход: 
        span.q-pa-sm +{{balance.root_percent / 10000}}% {{host.symbol}}
        span(v-if="isTokensale") +{{balance.convert_percent / 10000}}% {{host.asset_on_sale_symbol}}
        q-separator(:dark="isDark")
      
      div
        span доступно: 
        span.q-pa-sm {{balance.available}} 
        span(v-if="isTokensale") | {{balance.convert_amount}}
        q-separator(:dark="isDark")


      // div
      //   span получено: 
      //   span.q-pa-sm {{balance.withdrawed}}
      //   q-separator

      // div
      //   span старт конвертации: 
      //   span.q-pa-sm {{balance.start_convert_amount}}
      //   q-separator
      // div
      //   span статус: 
      //   q-badge.q-pa-sm {{balance.win}}
      // div
      //   span лепты: 
      //   span.q-pa-sm {{balance.quants_for_sale / 1000000}}
      // div
      //   span доля: 
      //   span.q-pa-sm {{parseFloat(balance.if_convert) / host.total_shares * 100}}%

      
      // p {{balance.root_percent}}
      // div(v-if="balance.root_percent == 0")
      //   span комиссия: 
      //   span.q-pa-sm {{lossAvailable}}%
      //   q-separator


    div().q-mt-sm.flex  
      q-btn(flat dense @click="refreshbal" @loading="loading").q-pa-xs
        i(color="orange" ).full-width.fa.fa-refresh.q-mr-xs.q-mt-xs
        span(style="font-size: 8px;") обновить
      
      q-btn(v-if="isTokensale" flat dense @click="withdrawbal" :disabled="!rootIsNull") 
        i(color="primary").full-width.fa-solid.fa-angle-down.q-mr-xs.q-mt-xs
        span(style="font-size: 8px;") вывести {{host.asset_on_sale_symbol}}

      q-btn(flat dense @click="convertbal" @loading="loading") 
        i(color="red" ).full-width.fa-solid.fa-angles-down.q-mr-xs.q-mt-xs
        span(style="font-size: 8px;") вывести {{host.symbol}}
      
      // !needRefresh && isWin && isAvailable

</template>

<script setup lang="ts">

import { computed, ref, onMounted} from 'vue'
import { useUserStore } from '~/stores/user'
import { useHostStore } from '~/stores/host'
import { useRouter } from 'vue-router'
import chains from '~/chainsMain'
import config from '~/config'
import { Notify } from 'quasar';

const router = useRouter()

const hostStore = useHostStore()
const userStore = useUserStore()

let loading = ref(false)
const props = defineProps({
  balance: {
    type: Object,
    required: true,
  },
  color: {
    type: String,
    required: true
  },
  host: {
    type: Object,
    required: true,
  }
})

const isDark = computed(() => {
  return props.color != "white"
})

const color = computed(() => {
  if (props.color == 'white')
    return "black"
  else return "white"
  // style="color: grey;"
})

const isTokensale = computed(() => {
  return props.host.sale_is_enabled == 1
})

const needRefresh = computed(() => {
  return props.balance.last_recalculated_pool_id < props.host.current_pool_id
})

let needLoadAllBalances = computed(() => {
  return router.currentRoute.value.name == 'nft'
})

const convertIsNull = computed(() => {
  console.log("convert: ", parseFloat(props.balance.convert_amount))
  return parseFloat(props.balance.convert_amount) == 0
})

const rootIsNull = computed(() => {
  return parseFloat(props.balance.available) > 0
})


let isWin = computed(() => {
  return props.host.currentPool.color == props.color
})

let isAvailable = computed(() => {
  return parseFloat(props.balance.available) > 0
})

let lossAvailable = computed(() => {

  return (parseFloat(props.balance.available) -  parseFloat(props.balance.purchase_amount)) / parseFloat(props.balance.purchase_amount) * 100
})

// onMounted(async () => {
//   await hostStore.loadBalances(userStore.username, hostname.value)
// })


// let balances = computed(() => {
//   return hostStore.getBalances
// })

const refreshbal = async () => {
  // Здесь можно выполнить фиктивную отправку транзакции в блокчейн
  loading.value = false;
  const userStore = useUserStore()

  try {
      const rootChain = chains.getRootChain()
      const api = rootChain.getEosPassInstance(userStore.authData?.wif as string)
      
      await api.transact(
        {
          actions: [
            {
              account: config.tableCodeConfig.core,
              name: 'refreshbal',
              authorization: [
                {
                  actor: userStore.username as string,
                  permission: 'active',
                },
              ],
              data: {
                username: props.balance.owner,
                host: props.balance.host,
                balance_id: props.balance.id,
                partrefresh: 50,
              },
            },
          ],
        },
        {
          blocksBehind: 3,
          expireSeconds: 30,
        }
      )
      
      hostStore.loadBalances(userStore.username, props.balance.host)


      if (needLoadAllBalances) {

        hostStore.loadAllUserBalances(userStore.username)

      } else {
        
      }


      Notify.create({
        message: `Транзакция принята успешно.`,
        color: 'positive',
      })

    } catch (e: any) {

      console.error(e)
     
      Notify.create({
        message: e.message,
        color: 'negative',
      })
    }

};


const convertbal = async () => {
  // Здесь можно выполнить фиктивную отправку транзакции в блокчейн
  loading.value = false;
  const userStore = useUserStore()
  


  try {
      const rootChain = chains.getRootChain()
      const api = rootChain.getEosPassInstance(userStore.authData?.wif as string)
      const actions = []

      if (isAvailable.value == true || props.host.sale_is_enabled == 0){
        actions.push({
              account: config.tableCodeConfig.core,
              name: 'withdraw',
              authorization: [
                {
                  actor: userStore.username as string,
                  permission: 'active',
                },
              ],
              data: {
                username: props.balance.owner,
                host: props.balance.host,
                balance_id: props.balance.id,
              },
            })
      
      }

      if (props.host.sale_is_enabled == 1){
        actions.push({
              account: config.tableCodeConfig.core,
              name: 'sellbalance',
              authorization: [
                {
                  actor: userStore.username as string,
                  permission: 'active',
                },
              ],
              data: {
                username: props.balance.owner,
                host: props.balance.host,
                balance_id: props.balance.id,
              },
            },
            {
              account: config.tableCodeConfig.core,
              name: 'convertbal',
              authorization: [
                {
                  actor: userStore.username as string,
                  permission: 'active',
                },
              ],
              data: {
                seller: props.balance.owner,
                host: props.balance.host,
                balance_id: props.balance.id,
              },
            })

      }

      console.log("acitons; ", actions, props.host)

      await api.transact(
        {
          actions,
        },
        {
          blocksBehind: 3,
          expireSeconds: 30,
        }
      )

      userStore.getUserBalances()
      hostStore.loadBalances(userStore.username, props.balance.host)
      if (needLoadAllBalances){
        
        hostStore.loadAllUserBalances(userStore.username)
      } else {
        
      }

      Notify.create({
        message: `Транзакция принята успешно.`,
        color: 'positive',
      })

    } catch (e: any) {

      console.error(e)
     
      Notify.create({
        message: e.message,
        color: 'negative',
      })
    }

};

const withdrawbal = async () => {
  // Здесь можно выполнить фиктивную отправку транзакции в блокчейн
  loading.value = false;
  const userStore = useUserStore()
  
  try {
      const rootChain = chains.getRootChain()
      const api = rootChain.getEosPassInstance(userStore.authData?.wif as string)
      
      await api.transact(
        {
          actions: [
            {
              account: config.tableCodeConfig.core,
              name: 'withdraw',
              authorization: [
                {
                  actor: userStore.username as string,
                  permission: 'active',
                },
              ],
              data: {
                username: props.balance.owner,
                host: props.balance.host,
                balance_id: props.balance.id,
              },
            },
          ],
        },
        {
          blocksBehind: 3,
          expireSeconds: 30,
        }
      )

      userStore.getUserBalances()
      hostStore.loadBalances(userStore.username, props.balance.host)
      if (needLoadAllBalances){
        
        hostStore.loadAllUserBalances(userStore.username)
      } else {
        
      }

      Notify.create({
        message: `Транзакция принята успешно.`,
        color: 'positive',
      })

    } catch (e: any) {

      console.error(e)
     
      Notify.create({
        message: e.message,
        color: 'negative',
      })
    }

};

</script>




<style scoped lang="scss">
 
  .nft-balance {
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);

    &:hover {
      transform: scale(1.03);
      box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
    }
  }
</style>
