<template lang="pug">
div
  
  q-card(flat).q-pa-md
    p # {{product.id}}
    q-input( label = "название" v-model="editProduct.title")
    q-input( label = "описание" type="textarea" v-model="editProduct.description")
    q-input( label = "цена" type="number" v-model="editProduct.price")
    q-input( label = "партнёрский процент" type="number" v-model="editProduct.referral_percent")
    p.q-pa-md цена: {{total}}
    
    q-btn(flat color="teal" @click="editProd") сохранить
    
    div(style="margin-top: 100px;").q-mt-lg
      p Потоки:
      q-btn(@click="addFlow" color="teal") + добавить поток 
      div.row.q-mt-lg
        div.col-md-6
          q-card(dark v-for="(flow, index) of flows" v-bind:key="flow.id").q-pa-md
            p Поток № {{index + 1}}
            
            p Начало продаж: {{flow.start_at}} UTC
            p Завершение продаж: {{flow.closed_at}} UTC
            p Ссылка на чат: {{flow.encrypted_data}}

  q-dialog(v-model="dialog" persistent :maximized="false" transition-show="slide-up" transition-hide="slide-down")  
    q-card(style="min-width: 350px; max-width: 100%;").bg-primary.text-white
      div
        q-bar
          span Добавить поток
          q-space
          q-btn(dense flat icon="close" v-close-popup)
            q-tooltip Close

        div
          q-input(filled label-color="white" label="Начало продаж" v-model="start_at")
          q-input(filled label-color="white" label="Завершение продаж и вход в чат" v-model="closed_at")
          q-input(filled label-color="white" label="Ссылка на чат" v-model="link")
          q-input(filled label-color="white" type="textarea" label="Приветственное сообщение" v-model="welcome")
          q-btn(@click="createFlow").full-width создать поток

    
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

const props = defineProps({
    product: {
      type: Object,
      required: true
    },
  })

const loading = ref(false)
const dialog = ref(false)

const start_at = ref(null)
const closed_at = ref(null)
const link = ref("")
const welcome = ref("")

const router = useRouter()

const hostStore = useHostStore()
const userStore = useUserStore()


const flows = computed(() => {
  
  return Object.values(hostStore.flows).filter(f => f.product_id == props.product.id).reverse()
})

const ref_percent = ref(0)

const editProduct = ref({})

const addFlow = () => {
  dialog.value = true
}

const host = computed(() => {
  return hostStore.getCurrentHost(config.coreHost)
})

const total = computed(() => {
  if(host.value && Object.values(editProduct).length > 0 && editProduct.value.referral_percent) {
    let amount = parseFloat(editProduct.value.price) + parseFloat(editProduct.value.price) * parseFloat(editProduct.value.referral_percent) / 100
    
    return amount + " " + host.value.symbol
  } else return "не определена"
  
})

const editProd = async () => {
  
  loading.value = true
 
  try {

    const rootChain = chains.getRootChain()
    const api = rootChain.getEosPassInstance(userStore.authData?.wif as string)
    
    // editprod(eosio::name host, eosio::name type, uint64_t referral_percent, uint64_t product_id, std::string title, std::string description, std::string encrypted_data, std::string public_key, asset price, uint64_t duration) {

    let data = { 
          host: config.coreHost,
          type: props.product.type,
          referral_percent: editProduct.value.referral_percent * 10000,
          title: editProduct.value.title,
          description: editProduct.value.description,
          encrypted_data: editProduct.value.encrypted_data,
          public_key: editProduct.value.public_key,
          token_contract: host.value.root_token_contract,
          price: parseFloat(editProduct.value.price).toFixed(host.value.precision) + " " + host.value.symbol,
          duration: 0
        }

    console.log("data: ", data) 

    let actions = [
      {
        account: config.tableCodeConfig.core,
        name: 'createprod',
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
      message: 'Продукт сохранён',
      color: 'positive',
    })


    loading.value = false

    hostStore.loadProducts(config.coreHost)
    

  } catch (e: any) {
    
    Notify.create({
      message: 'Произошла ошибка: ' + e.message,
      color: 'negative',
    })
  }


}

const createFlow = async () => {

  try {

    const rootChain = chains.getRootChain()
    const api = rootChain.getEosPassInstance(userStore.authData?.wif as string)
    let data = "data"
    let public_key = "key"
    
    let meta: {
      timezone: "X"
    }

    let actions = [
      {
        account: config.tableCodeConfig.core,
        name: 'addflow',
        authorization: [
          {
            actor: userStore.username as string,
            permission: 'active',
          },
        ],
        data: {
          host: props.product.host,
          product_id: props.product.id,
          start_at: start_at.value, 
          closed_at: closed_at.value,
          encrypted_data: data,
          public_key,
          meta
        }, 
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
      message: 'Поток создан',
      color: 'positive',
    })


    loading.value = false
    hostStore.loadFLows(props.product.host)
    
    // router.push({name: "market"})


  } catch (e: any) {
    
    Notify.create({
      message: 'Произошла ошибка: ' + e.message,
      color: 'negative',
    })
  }

}

onMounted(async () => {
  hostStore.loadHosts()
  
  editProduct.value = props.product
  editProduct.value.price = parseFloat(editProduct.value.total).toFixed(4)
  editProduct.value.referral_percent = editProduct.value.referral_percent / 1000000 * 100
  

})


</script>
