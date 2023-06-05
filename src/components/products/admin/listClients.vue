<template lang="pug">
div
  
  q-table(
    flat
    :rows="clients"
    :columns="columns"
    row-key="username"
    :pagination={rowsPerPage: 0}
  )

  
    template(v-slot:body-cell-actions="props")
      div.full-height
        q-btn(v-if="props.row.encrypted_data.length == 0" color="primary" label="Выдать ключ" @click="issueKey(props)")
        q-badge(v-if="props.row.encrypted_data.length > 0") ключ выдан
    
</template>

<script setup lang="ts">

import { computed, ref, onMounted, watch} from 'vue'
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
  return Object.values(hostStore.getBalances)
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
        name: 'status',
        required: true,
        label: 'Статус',
        align: 'left',
        field: 'status'
      },
      {
        name: 'purchase_amount',
        required: true,
        label: 'Сумма',
        align: 'left',
        field: 'purchase_amount'
      },
      {
        name: 'cashback',
        required: true,
        label: 'Кэшбэк',
        align: 'left',
        field: 'cashback'
      },
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


let clients = computed(() => {
  const newBalances = balances.value.map(({purchase_amount, owner}) => 
    {
       return {
        status: "lottery",
        purchase_amount, 
        username: owner,
        product_id: 1,
        flow_id: 1,
        user_product_id: 0,
        encrypted_data: ""
      }
    });

  const newUserProducts = userProducts.value.map(({purchase_amount, username, product_id, flow_id, id, encrypted_data}) => {

    return {
      status: "product",
      purchase_amount: "2.0000 FLOWER", 
      username,
      flow_id,
      product_id,
      user_product_id: id,
      encrypted_data
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
        account: config.tableCodeConfig.core,
        name: 'deriveprod',
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

    hostStore.loadProducts(config.coreHost)
    

  } catch (e: any) {
    loading.value = false
    Notify.create({
      message: 'Произошла ошибка: ' + e.message,
      color: 'negative',
    })
  }

  //deriveprod(eosio::name host, uint64_t user_product_id, std::string encrypted_data, std::string public_key) {
  //
  
  // console.log()
  //TODO decrypt link
  //encrypt link to owner
  //send link to owner
  //decrypt link on owner
}


onMounted(async () => {


  hostStore.loadAllBalances(config.coreHost as string)
  hostStore.loadAllUserProducts(config.coreHost as string)

  hostStore.loadFlows(config.coreHost as string)
  

})


</script>
