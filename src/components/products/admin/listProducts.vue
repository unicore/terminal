<template lang="pug">
div.q-pa-md
  div(v-if="!isFullCard")
    q-table(
      square
      
      flat
      :rows="products"
      :columns="columns"
      row-key="pool_id"
      :pagination={rowsPerPage: 0}
      :no-data-label="'нет данных'"

    ).text-center.full-width     
      
      template(v-slot:top)
        q-btn(color="secondary" @click="addProduct") + добавить продукт
          
      template(v-slot:body-cell-actions="props")
        q-td(:props="props")
          q-btn(outline dense color="secondary" @click="router.push({name: 'admin-products', params: {id: props.row.id}})").q-ma-xs подробнее
               
    
  div(v-if="isFullCard && currentProduct")

    adminProductCard(:product="currentProduct")



  q-dialog(v-model="dialog" persistent :maximized="false" transition-show="slide-up" transition-hide="slide-down")  
    q-card(style="min-width: 350px; max-width: 100%;")
      div
        q-bar
          span добавить продукт
          q-space
          q-btn(dense flat icon="close" v-close-popup)
            q-tooltip Close

        div
          q-input(filled  label="Название" v-model="newProduct.title")
          q-input(filled type="textarea" label="Описание" v-model="newProduct.description")
          q-input(filled type="text" label="Ссылка на обложку" v-model="newProduct.meta.image")
          
          q-input(filled  type="number" step="1" max="100" label="Кэбэк партнёрам, %" v-model="newProduct.referral_percent")
          q-input(filled  type="number" step="1" max="100" label="Кэшбэк в ядро, %" v-model="newProduct.core_cashback_percent")
          
          q-input(filled  type="number" label="Себестоимость" v-model="newProduct.price")
          span.q-pa-md Цена для клиента: {{total}}
          div.full-width.row.q-mt-lg
            q-btn(v-close-popup color="secondary" flat).col-6 отмена
            q-btn(@click="createProduct" color="secondary").col-6 создать продукт


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
  core_cashback_percent: 0,
  type: 'info',
  encrypted_data: "",
  public_key: "",
  price: 0,
  meta: {
    image: ""
  }
})

const hostStore = useHostStore()
const userStore = useUserStore()
import adminProductCard from './adminProductCard.vue'
import shortProductCard from './shortProductCard.vue'

const products = computed(() => Object.values(hostStore.products))

const isFullCard = computed(() => router.currentRoute.value.params.id)

const currentProduct = computed(() => products.value.find(p => p.id == isFullCard.value))


const columns = ref([
      { name: 'title', label: 'Продукт', field: 'title', align: 'left' },
      { name: 'actions', label: '', field: 'actions', align: 'right' },
  ])

const total = computed(() => {
  if(host.value) {
    let amount = parseFloat(newProduct.value.price) + parseFloat(newProduct.value.price) * parseFloat(newProduct.value.referral_percent) / 100 + parseFloat(newProduct.value.price) * parseFloat(newProduct.value.core_cashback_percent) / 100
    
    return amount + " " + host.value.symbol
  } else return ""
  
})

const host = computed(() => {
  return hostStore.getCurrentHost(config.coreHost)
})

onMounted(async () => {
  hostStore.loadHost(props.product.host)
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
   
    let price = parseFloat(newProduct.value.price).toFixed(host.value.precision) + " " + host.value.symbol
    
    let data = { 
          host: config.coreHost,
          type: newProduct.value.type,
          referral_percent: newProduct.value.referral_percent * 10000,
          core_cashback_percent: newProduct.value.core_cashback_percent * 10000,
          title: newProduct.value.title,
          description: newProduct.value.description,
          encrypted_data: newProduct.value.encrypted_data,
          public_key: newProduct.value.public_key,
          token_contract: host.value.root_token_contract,
          price: parseFloat(newProduct.value.price).toFixed(host.value.precision) + " " + host.value.symbol,
          duration: 0,
          meta: JSON.stringify(newProduct.value.meta)
        }

    let actions = [
      {
        account: config.tableCodeConfig.secret,
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

    dialog.value = false
    loading.value = false
    hostStore.loadProducts(config.coreHost)
    

  } catch (e: any) {
    dialog.value = false
    Notify.create({
      message: 'Произошла ошибка: ' + e.message,
      color: 'negative',
    })
  }
}
</script>
