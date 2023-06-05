<template lang="pug">
div.q-pa-md
  div(v-if="!isFullCard")
    div
      q-btn(color="green" @click="addProduct") + добавить продукт
    
    div( v-for="product of products" v-bind:key="product.id").q-pa-xs
      shortProductCard(:product="product")

  div(v-if="isFullCard && currentProduct")

    adminProductCard(:product="currentProduct")



  q-dialog(v-model="dialog" persistent :maximized="false" transition-show="slide-up" transition-hide="slide-down")  
    q-card(style="min-width: 350px; max-width: 100%;").bg-primary.text-white
      div
        q-bar
          span Добавить продукт
          q-space
          q-btn(dense flat icon="close" v-close-popup)
            q-tooltip Close

        div
          q-input(filled label-color="white" label="Название" v-model="newProduct.title")
          q-input(filled label-color="white" type="textarea" label="Описание" v-model="newProduct.description")
          q-input(filled label-color="white" type="number" step="1" max="100" label="Партнёрская наценка" v-model="newProduct.referral_percent")
          q-input(filled label-color="white" type="number" label="Себестоимость" v-model="newProduct.price")
          p.q-pa-md цена: {{total}}
          q-btn(@click="createProduct").full-width создать продукт


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

const router = useRouter()
const dialog = ref(false)
const loading = ref(false)

const newProduct = ref({
  title: "",
  description: "",
  referral_percent: 0,
  type: 'info',
  encrypted_data: "",
  public_key: "",
  price: 0,
})

const hostStore = useHostStore()
const userStore = useUserStore()
import adminProductCard from './adminProductCard.vue'
import shortProductCard from './shortProductCard.vue'

const products = computed(() => Object.values(hostStore.products))

const isFullCard = computed(() => router.currentRoute.value.params.id)

const currentProduct = computed(() => products.value.find(p => p.id == isFullCard.value))


const total = computed(() => {
  if(host.value) {
    let amount = parseFloat(newProduct.value.price) + parseFloat(newProduct.value.price) * parseFloat(newProduct.value.referral_percent) / 100
    console.log("amount", amount, newProduct.value.price, newProduct.value.price * newProduct.value.referral_percent / 100)
    return amount + " " + host.value.symbol
  } else return ""
  
})

const host = computed(() => {
  return hostStore.getCurrentHost(config.coreHost)
})

onMounted(async () => {
  hostStore.loadHosts()
  hostStore.loadProducts(config.coreHost)
  hostStore.loadFlows(config.coreHost)
})


const addProduct = () => {
  dialog.value = true
}

const createProduct = async () => {
  
  loading.value = true
  try {

    const rootChain = chains.getRootChain()
    const api = rootChain.getEosPassInstance(userStore.authData?.wif as string)
   
    let price = parseFloat(newProduct.value.price).toFixed(4) + " " + host.value.symbol
    
    let data = { 
          host: config.coreHost,
          type: newProduct.value.type,
          referral_percent: newProduct.value.referral_percent * 10000,
          title: newProduct.value.title,
          description: newProduct.value.description,
          encrypted_data: newProduct.value.encrypted_data,
          public_key: newProduct.value.public_key,
          token_contract: host.value.root_token_contract,
          price: price,
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
      message: 'Продукт добавлен',
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
</script>
