<template lang="pug">
div
  q-card(bordered flat :dark="isDark").nft-balance
    q-card-section
      p баланс # {{balance.id}}
    
    q-card-section
      div
        span раунд покупки: 
        span.q-pa-sm {{balance.pool_num}}
      div
        span сумма покупки: 
        span.q-pa-sm {{balance.purchase_amount}}
      
      // div
      //   span статус: 
      //   q-badge.q-pa-sm {{balance.win}}
      div
        span токены: 
        span.q-pa-sm {{balance.quants_for_sale / 1000000}}
      // div
      //   span доля: 
      //   span.q-pa-sm {{parseFloat(balance.if_convert) / host.total_shares * 100}}%

      div
        span доступно: 
        span.q-pa-sm {{balance.available}}
      // p {{balance.root_percent}}
      div(v-if="balance.root_percent > 0")
        span прибыль: 
        span.q-pa-sm +{{balance.root_percent / 10000}}%

    q-card-actions(align="right")  
      q-btn(flat color="orange" @click="refreshbal" @loading="loading") обновить

      // q-btn( color="teal" @click="withdrawbal" @loading="loading" v-if="!isWin") получить фракцию
        
      q-btn(flat color="teal"  @click="withdrawbal") продать
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

const needRefresh = computed(() => {
  return props.balance.last_recalculated_pool_id < props.host.current_pool_id
})

let needLoadAllBalances = computed(() => {
  return router.currentRoute.value.name == 'nft'
})

let isWin = computed(() => {
  return props.host.currentPool.color == props.color
})

let isAvailable = computed(() => {
  return parseFloat(props.balance.available) > 0
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
