<template lang="pug">
q-card(dark v-if="balance && flow")
  div.q-pa-md
    p NFT-билет на поток # {{flow.id}}
    p Скидка: {{discount}}%
    // p {{balance}}
    p {{flow.closed_at}}
    p Завершение продаж: {{salesFinishAfter}}
    p {{isSalesFinish}}
    // p user products {{hostStore.userProducts}}
  q-btn( color="orange" @click="refreshbal" :loading="loading") обновить

</template>

<script setup lang="ts">

import { computed, ref, onMounted, watch} from 'vue'
import { useUserStore } from '~/stores/user'
import { useHostStore } from '~/stores/host'
import { useRouter } from 'vue-router'
import userBalance from '~/components/core/oneUserBalance.vue'
import config from '~/config'
import chains from '~/chainsMain'
import moment from 'moment-with-locales-es6';
import 'moment/locale/ru';
import { Notify } from 'quasar'

moment.locale('ru')

const router = useRouter()
const loading = ref(false)

const hostStore = useHostStore()
const userStore = useUserStore()

const props = defineProps({
    balance: {
      type: Object,
      required: true,
    },
    flow: {
      type: Object,
      required: true
    },
    product: {
      type: Object,
      required: true,
    }
  })

const hosts = computed(() => hostStore.getHosts)
const host = computed(() => hosts.value[props.balance.host])

const myProduct = computed(() => Object.values(hostStore.userProducts).find(el => el.product_id == props.flow.product_id))
const discount = ref(0)

const salesFinishAfter = computed(() => {

  let now = moment.utc()
  let expired_at = moment.utc(props.flow.closed_at)

  let fromNow = expired_at.fromNow()
  return fromNow
})


const isSalesFinish = computed(() => {

  let now = moment.utc()
  let expired_at = moment.utc(props.flow.closed_at)

  const diffInSeconds = expired_at.diff(now, 'seconds');
  
  return diffInSeconds < 0

})


async function load() {
  await hostStore.loadBalances(userStore.username, props.balance.host)
  await hostStore.loadFlows(props.balance.host)

  if (userStore.hasAuth)
    await hostStore.loadMyProducts(props.balance.host, userStore.username) 

}


const refreshbal = async () => {
  // Здесь можно выполнить фиктивную отправку транзакции в блокчейн
  loading.value = true;
  const userStore = useUserStore()

  const rootChain = chains.getRootChain()
  const api = rootChain.getEosPassInstance(userStore.authData?.wif as string)
    
  try { 

    if (!isSalesFinish) {
        
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
        
        load()

        loading.value = false;

        Notify.create({
          message: `Транзакция принята успешно.`,
          color: 'positive',
        })

    } else {

      //обновляем, выводим, сжигаем и покупаем (4 действия в одной транзакции)
        
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
                  balance_id: props.balance.id
                },
              },

              {
                account: props.product.token_contract,
                name: 'transfer',
                authorization: [
                  {
                    actor: userStore.username as string,
                    permission: 'active',
                  },
                ],
                data: {
                  from: userStore.username as string,
                  to: config.tableCodeConfig.core,
                  quantity: props.product.total,
                  memo: `800-${props.balance.host}`
                },
            },

            {
              account: config.tableCodeConfig.core,
              name: 'buysecret',
              authorization: [
                {
                  actor: userStore.username as string,
                  permission: 'active',
                },
              ],
              data: {
                buyer: userStore.username,
                host: props.balance.host,
                flow_id: props.flow.id
              },
            },
            ],
          },
          {
            blocksBehind: 3,
            expireSeconds: 30,
          }
        )
        
        load()

        loading.value = false;
       
        Notify.create({
          message: `Транзакция принята успешно.`,
          color: 'positive',
        })
   
    }

  } catch (e: any) {

    console.error(e)
    
    loading.value = false;
    
    Notify.create({
      message: e.message,
      color: 'negative',
    })

  }

  
};

watch(host, (newValue) => {

  if (newValue){
    if (props.balance.pool_num != host.value.current_pool_num && host.value.current_pool_num > 2) {

      let base = parseFloat(props.balance.purchase_amount) - parseFloat(props.balance.purchase_amount) * host.value.spiral.loss_percent / 1000000
      let d = parseFloat(props.balance.available) / base * 100 - 100
      discount.value = '-' + d.toFixed(2)

    }

  }
})



onMounted(async () => {
  hostStore.loadHosts()

})


</script>
