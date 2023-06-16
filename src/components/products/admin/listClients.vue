<template lang="pug">
div
  div.row
    div.col-md-4.col-xs-12.q-pa-md
      
      q-card(dark)
        div(v-if="host && host.precision").q-pa-md
          p().text-grey Доступно: 
            span.text-white {{ubalance.quantity || parseFloat(0).toFixed(host.precision) + ' ' + host.symbol }} 
      
        q-btn(@click="withdraw" color="primary") вывести

    div.col-md-4.col-xs-12.q-pa-md
      q-card(dark)
        div.q-pa-md
          p().text-grey Выручка: 
            span.text-white {{totalSold}}
          p().text-grey Прибыль: 
            span.text-white {{totalHost}}
          
          p().text-grey Кэшбэк в сеть: 
            span.text-white {{totalRef}}
          
          p().text-grey Кэшбэк в ядро: 
            span.text-white {{totalCore}}
      
    div.col-md-4.col-xs-12.q-pa-md
      q-card(dark)
        div.q-pa-md
          p().text-grey Всего покупателей
            p.text-white {{totalBuyers}}
        

      
  q-table(
    flat
    square

    :rows="clients"
    :columns="columns"
    row-key="username"
    :pagination={rowsPerPage: 0}
  ).text-center

    template(v-slot:body-cell-type="props")
      q-td(:props="props")
        q-badge(outline color="orange" v-if="props.row.type == 'lottery'") в лотерее
        q-badge(outline color="teal"  v-if="props.row.type == 'product'") купил продукт
          
        

  
    template(v-slot:body-cell-actions="props")
      q-td(:props="props")
        q-btn(v-if="props.row.encrypted_data.length == 0 && props.row.type == 'product'" color="primary" label="Выдать ключ" @click="issueKey(props)")
        q-badge(color="teal" outline v-if="props.row.encrypted_data.length > 0  && props.row.type == 'product'") ключ выдан
        q-badge(color="orange" outline v-if="props.row.type == 'lottery'") ожидаем финала
</template>

<script setup lang="ts">

import { computed, onUnmounted, ref, onMounted, watch} from 'vue'
import { useUserStore } from '~/stores/user'
import { useHostStore } from '~/stores/host'
import { useRouter } from 'vue-router'
import userBalance from '~/components/core/oneUserBalance.vue'
import config from '~/config'
import chains from '~/chainsMain'

import {Notify} from 'quasar'

import { useProductsStore } from '../store'

const router = useRouter()

const hostStore = useHostStore()
const userStore = useUserStore()

const productStore = useProductsStore()

const balances = computed(() => {

  let bals = Object.values(hostStore.getBalances).filter(el => {

    try {
      el.meta = JSON.parse(el.meta);
      return el.meta && el.meta.hasOwnProperty('product_id')
    } catch (error) {
      return false
     }

  });

  return bals

})


const totalBuyers = computed(() => {
  let total = 0
  Object.values(hostStore.products).map(el => total += parseFloat(el.total_solded_count))

  return total
})

const totalSold = computed(() => {
  if (host.value){
    let total = 0
    Object.values(hostStore.products).map(el => total += parseFloat(el.total_solded_amount))

    return total.toFixed(host.value.precision) + ' ' + host.value.symbol
  } else return 0
})


const totalHost = computed(() => {
  if (host.value){
    let total = 0
    Object.values(hostStore.products).map(el => total += parseFloat(el.total_host_amount))

    return total.toFixed(host.value.precision) + ' ' + host.value.symbol
  } else return 0
})


const totalRef = computed(() => {
  if (host.value){
    let total = 0
    Object.values(hostStore.products).map(el => total += parseFloat(el.total_refs_amount))

    return total.toFixed(host.value.precision) + ' ' + host.value.symbol
  } else return 0
})


const totalCore = computed(() => {
  if (host.value){
    let total = 0
    Object.values(hostStore.products).map(el => total += parseFloat(el.total_core_amount))

    return total.toFixed(host.value.precision) + ' ' + host.value.symbol
  } else return 0
})



const userProducts = computed(() => {
  return Object.values(hostStore.userProducts)
})

const loading = ref(false)

const encrypted = ref("")

const columns = ref([
      {
        name: 'product_id',
        required: true,
        label: 'Продукт',
        align: 'left',
        field: 'product_id'
      },
      {
        name: 'flow_id',
        required: true,
        label: 'Поток',
        align: 'left',
        field: 'flow_id'
      },
      {
        name: 'type',
        required: true,
        label: 'Состояние',
        align: 'left',
        field: 'type'
      },
      {
        name: 'purchase_amount',
        required: true,
        label: 'Оплачено',
        align: 'left',
        field: 'purchase_amount'
      },
      // {
      //   name: 'cashback',
      //   required: true,
      //   label: 'Получено',
      //   align: 'left',
      //   field: 'cashback'
      // },
      {
        name: 'username',
        required: true,
        label: 'Имя пользователя',
        align: 'left',
        field: 'username'
      },
      {
        name: 'actions',
        label: 'Действия',
        field: 'actions',
        required: true,
        align: 'left',
      }
    ])



const hosts = computed(() => hostStore.getHosts)
const host = computed(() => hosts.value[config.coreHost])

const ubalance = computed(() => {
  if (productStore.ubalance[0] && host.value) {
    
    let obj = productStore.ubalance[0]
    
    if (obj){
      return obj
    }
    else return parseFloat(0).toFixed(host.value.precision) + ' ' + host.value.symbol

  } else return ""


})

let clients = computed(() => {
  if (!host.value)
    return

  const newBalances = balances.value.map(({purchase_amount, available, owner, meta, pool_num}) => 
    {
     
      let discount_amount, discount_percent
      
      if (pool_num != host.value.current_pool_num && host.value.current_pool_num > 2) {
        let base = parseFloat(purchase_amount) - parseFloat(purchase_amount) * host.value.spiral.loss_percent / 1000000
        
        let d = parseFloat(available) / base * 100 - 100
        
        discount_amount = parseFloat(available) - base
        discount_percent = '-' + d.toFixed(2)

      } else {
        discount_amount = 0
        discount_percent = 0
      }

       return {
        type: "lottery",
        purchase_amount, 
        username: owner,
        product_id: meta.product_id,
        flow_id: meta.flow_id,
        user_product_id: 0,
        encrypted_data: "",
        // cashback: `${parseFloat(discount_amount).toFixed(host.value.precision)} ${host.value.symbol}  (${discount_percent}%)`
      }
    });

  const newUserProducts = userProducts.value.map(({total, username, product_id, flow_id, id, encrypted_data, meta}) => {
    try {
      meta = JSON.parse(meta)
    } catch(e){

    }

    return {
      type: "product",
      purchase_amount: total, 
      username,
      flow_id,
      product_id,
      user_product_id: id,
      encrypted_data
      // cashback: parseFloat(meta.discount_amount || 0).toFixed(host.value.precision) + ' ' + host.value.symbol + ` (${meta.discount || 0}%)` 
    }
  });

  const combinedArray = [...newBalances, ...newUserProducts];
  
  return combinedArray

})



const encrypt = async (msg, to) => {
  
  let data = await productStore.encryptMessage(userStore.authData?.wif as string, to as string, msg)
  
  return data
}


const decrypt = async (msg) => {

  let d = await productStore.decryptMessage(userStore.authData?.wif as string, userStore.username as string, msg)
  
  return d
}


const flows = computed(() => hostStore.flows)

const withdraw = async () => {
  try {

    const rootChain = chains.getRootChain()
    const api = rootChain.getEosPassInstance(userStore.authData?.wif as string)
    
    let data = { 
        host: config.coreHost,
        balance_id: ubalance.value.id
    }

    let actions = [
      {
        account: config.tableCodeConfig.secret,
        name: 'withdraw',
        authorization: [
          {
            actor: userStore.username as string,
            permission: 'active',
          },
        ],
        data: data
      }
    ]


    await api.transact(
      {
        actions: actions
      },
      {
        blocksBehind: 3,
        expireSeconds: 30,
      }
    )

    Notify.create({
      message: 'Транзакция принята',
      color: 'positive',
    })


    loading.value = false
    userStore.getUserBalances()
    productStore.loadUbalance(config.coreHost as string)

  } catch (e: any) {
    loading.value = false
    Notify.create({
      message: 'Произошла ошибка: ' + e.message,
      color: 'negative',
    })
  }

}

const issueKey = async (props) => {
  let user_product_id = props.row.user_product_id
  let product_id = props.row.product_id
  let flow_id = props.row.flow_id
  let target = props.row.username
  
  const flow = flows.value[flow_id]
  
  let link = await decrypt(flow.encrypted_data)

  let message = await encrypt(link, target)
  loading.value = true

  try {

    const rootChain = chains.getRootChain()
    const api = rootChain.getEosPassInstance(userStore.authData?.wif as string)
    
    let data = { 
          host: config.coreHost,
          user_product_id,
          encrypted_data: message, 
          public_key: ""
    }

    let actions = [
      {
        account: config.tableCodeConfig.secret,
        name: 'derivesecret',
        authorization: [
          {
            actor: userStore.username as string,
            permission: 'active',
          },
        ],
        data: data
      }
    ]


    await api.transact(
      {
        actions: actions
      },
      {
        blocksBehind: 3,
        expireSeconds: 30,
      }
    )

    Notify.create({
      message: 'Ключ доставлен',
      color: 'positive',
    })


    loading.value = false

    hostStore.loadAllUserProducts(config.coreHost as string)    

  } catch (e: any) {
    loading.value = false
    Notify.create({
      message: 'Произошла ошибка: ' + e.message,
      color: 'negative',
    })
  }

  
  // console.log()
  //TODO decrypt link
  //encrypt link to owner
  //send link to owner
  //decrypt link on owner
}

const init = async () => {
  productStore.loadUbalance(config.coreHost as string)

  hostStore.loadHost(config.coreHost as string)
  hostStore.loadAllBalances(config.coreHost as string)
  hostStore.loadAllUserProducts(config.coreHost as string)
  hostStore.loadProducts(config.coreHost as string)
  hostStore.loadFlows(config.coreHost as string)
}

const interval = ref(null)

onUnmounted(async() => {
  if (interval.value) 
    clearInterval(interval.value)
})

onMounted(async () => {

  init()
  
  interval.value = setInterval(() => init, 30000)

})


</script>
