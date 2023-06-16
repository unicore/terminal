<template lang="pug">
div
  div.row
    div.col-6
      q-card(bordered flat).bg-grey-2.q-pa-md
        h3 Карточка продукта
        q-input(dense label = "название продукта" v-model="editProduct.title")
        q-input(dense label = "описание продукта" type="textarea" v-model="editProduct.description")
        q-input(dense label = "цена" type="number" v-model="editProduct.price")
        q-input(dense label = "кэшбэк партнёрам, %" type="number" v-model="editProduct.referral_percent")
        q-input(dense label = "кэшбэк в ядро, %" type="number" v-model="editProduct.core_cashback_percent")
        q-input(dense label="Ссылка на обложку"  type="text" v-model="editProduct.meta.image")
        p.q-pa-md финальная цена: {{total}}
        
        q-btn( color="secondary" @click="editProd") сохранить
    div.col-6     
      div()
        div.full-width.text-center
          h1 Потоки
          q-btn(@click="addFlow" color="secondary") + добавить поток 
        div.row.q-mt-lg.q-pa-md.justify-center
          div.col-md-12
            q-card(bordered v-for="(flow, index) of flows" v-bind:key="flow.id").q-pa-md.q-ma-md
              div
                p Поток № {{index + 1}}
                
                p Начало продаж: {{flow.start_at}} UTC
                p Завершение продаж: {{flow.closed_at}} UTC
              decryptedButton(:data="flow.encrypted_data").q-mt-md
              
  q-dialog(v-model="dialog" persistent :maximized="false" transition-show="slide-up" transition-hide="slide-down")  
    q-card(style="min-width: 350px; max-width: 100%;")
      div
        q-bar
          span Добавить поток
          q-space
          q-btn(dense flat icon="close" v-close-popup)
            q-tooltip Close
        div.text-center
          q-input(filled v-model="start_at" label="Начало продаж" v-if="startPickerState === 'input' && endPickerState === 'input'")
            template(v-slot:append)
              q-icon(name="event" @click="startPickerState = 'date'" color="secondary")
          q-date(dark v-model="startDate" mask="YYYY-MM-DD" v-if="startPickerState === 'date'" @update:model-value="startPickerState = 'time'")
          q-time( v-model="startTime" format24h v-if="startPickerState === 'time'" @update:model-value="updateStartAt")

          q-input(filled v-model="closed_at" label="Завершение продаж и вход в чат" v-if="startPickerState === 'input' && endPickerState === 'input'")
            template(v-slot:append)
              q-icon(name="event" @click="endPickerState = 'date'" color="secondary")
          q-date( v-model="endDate" mask="YYYY-MM-DD" v-if="endPickerState === 'date'" @update:model-value="endPickerState = 'time'")
          q-time( v-model="endTime" format24h v-if="endPickerState === 'time'" @update:model-value="updateClosedAt")

          q-input(filled  label="Ссылка на чат" v-model="link" v-if="startPickerState === 'input' && endPickerState === 'input'")
          q-input(filled type="textarea" label="Приветственное сообщение" v-model="welcome" v-if="startPickerState === 'input' && endPickerState === 'input'")
        
        div.row
          q-btn(v-close-popup flat).col-6 отмена
          q-btn(@click="createFlow" color="secondary").col-6 создать поток

    
</template>

<script setup lang="ts">

import { computed, ref, onMounted, watch} from 'vue'
import { useUserStore } from '~/stores/user'
import { useHostStore } from '~/stores/host'
import { useProductsStore } from '../store'

import decryptedButton from '../decryptedButton.vue'

import { useRouter } from 'vue-router'
import userBalance from '~/components/core/oneUserBalance.vue'
import config from '~/config'
import chains from '~/chainsMain'
import {Notify} from 'quasar'

import moment from 'moment-timezone';

const props = defineProps({
    product: {
      type: Object,
      required: true
    },
  })

const loading = ref(false)
const dialog = ref(false)

// const start_at = ref(null)
// const closed_at = ref(null)
const current = new Date()
const startDate = ref(current.toISOString().substring(0, 10))
const startTime = ref(current.toTimeString().substring(0, 5))
const endDate = ref(current.toISOString().substring(0, 10))
const endTime = ref(current.toTimeString().substring(0, 5))

// Variables for the state of the pickers
const startPickerState = ref('input');
const endPickerState = ref('input');


const start_at = computed(() => `${startDate.value}T${startTime.value}`)
const closed_at = computed(() => `${endDate.value}T${endTime.value}`)

watch(dialog, (newValue)=> {
  if (newValue == false){
    startPickerState.value = 'input';
    endPickerState.value = 'input'
  }
})

const updateStartAt = () => {
  start_at.value = `${startDate.value}T${startTime.value}`;
  startPickerState.value = 'input';
};

const updateClosedAt = () => {
  closed_at.value = `${endDate.value}T${endTime.value}`;
  endPickerState.value = 'input';
};

const link = ref("")
const welcome = ref("")

const router = useRouter()

const hostStore = useHostStore()
const userStore = useUserStore()
const productStore = useProductsStore()


const flows = computed(() => {
  
  return Object.values(hostStore.flows).filter(f => f.product_id == props.product.id).reverse()
})

const ref_percent = ref(0)

const editProduct = ref({})
const encrypted = ref("")
const decrypted = ref("")

const addFlow = () => {
  dialog.value = true
}

const host = computed(() => {
  return hostStore.getCurrentHost(config.coreHost)
})

const total = computed(() => {
  if(host.value && Object.values(editProduct).length > 0 && editProduct.value.referral_percent) {
    let amount = parseFloat(editProduct.value.price) + parseFloat(editProduct.value.price) * parseFloat(editProduct.value.referral_percent) / 100 + parseFloat(editProduct.value.price) * parseFloat(editProduct.value.core_cashback_percent) / 100
    
    
    return amount + " " + host.value.symbol
  } else return "не определена"
  
})

const encrypt = async (msg) => {
  encrypted.value  = await productStore.encryptMessage(userStore.authData?.wif as string, userStore.username as string, msg)//props.product.encrypted_data
}


const decrypt = async (msg) => {
   let d = await productStore.decryptMessage(userStore.authData?.wif as string, userStore.username as string, msg)
   return d
}

const editProd = async () => {
  
  loading.value = true
 
  try {

    const rootChain = chains.getRootChain()
    const api = rootChain.getEosPassInstance(userStore.authData?.wif as string)
    
    let data = { 
          product_id: props.product.id,
          host: config.coreHost,
          referral_percent: editProduct.value.referral_percent * 10000,
          core_cashback_percent: editProduct.value.core_cashback_percent * 10000,
          title: editProduct.value.title,
          description: editProduct.value.description,
          encrypted_data: editProduct.value.encrypted_data,
          public_key: editProduct.value.public_key,
          token_contract: host.value.root_token_contract,
          price: parseFloat(editProduct.value.price).toFixed(host.value.precision) + " " + host.value.symbol,
          meta: JSON.stringify(editProduct.meta),
          duration: 0
        }

    console.log("data: ", data) 
    // [[eosio::action]] void editprod(eosio::name host, uint64_t referral_percent, uint64_t core_cashback_percent, uint64_t product_id, std::string title, std::string description, std::string encrypted_data, asset price);
    
    let actions = [
      {
        account: config.tableCodeConfig.secret,
        name: 'editprod',
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
    
    //TODO check link for link

    let encrypted_data = await productStore.encryptMessage(userStore.authData?.wif as string, userStore.username as string, link.value)
    
    let tz = moment.tz.guess()

    let meta = {
      // timezone: 'x',
      timezone: tz,
      welcome: welcome.value
    }

    console.log("meta: ", meta)

    let data = {
          host: props.product.host,
          product_id: props.product.id,
          start_at: start_at.value, 
          closed_at: closed_at.value,
          encrypted_data: encrypted_data,
          public_key: "",
          meta: JSON.stringify(meta)
      }

    console.log("creatFlow", data)

    let actions = [
      {
        account: config.tableCodeConfig.secret,
        name: 'addflow',
        authorization: [
          {
            actor: userStore.username as string,
            permission: 'active',
          },
        ],
        data, 
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

    dialog.value = false
    loading.value = false
    
    hostStore.loadFlows(props.product.host)
    
    // router.push({name: "market"})


  } catch (e: any) {
    
    Notify.create({
      message: 'Произошла ошибка: ' + e.message,
      color: 'negative',
    })
  }

}

onMounted(async () => {
  hostStore.loadHost(props.product.host)
  
  editProduct.value = props.product
  
  try {
    editProduct.value.meta = JSON.parse(editProduct.value.meta)  
  } catch(e){}
  
  editProduct.value.price = parseFloat(editProduct.value.price).toFixed(4)
  editProduct.value.referral_percent = parseFloat(editProduct.value.referral_percent) / 10000
  editProduct.value.core_cashback_percent = parseFloat(editProduct.value.core_cashback_percent) / 10000
  

})


</script>
