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
      q-btn(@click="addFlow" color="green") + добавить поток 
      div.row.q-mt-lg.q-pa-md.justify-center
        div.col-md-8
          q-card(dark v-for="(flow, index) of flows" v-bind:key="flow.id").q-pa-md.q-ma-md
            p Поток № {{index + 1}}
            
            p Начало продаж: {{flow.start_at}} UTC
            p Завершение продаж: {{flow.closed_at}} UTC
            decryptedButton(:data="flow.encrypted_data")
          
  q-dialog(v-model="dialog" persistent :maximized="false" transition-show="slide-up" transition-hide="slide-down")  
    q-card(style="min-width: 350px; max-width: 100%;").bg-primary
      div
        q-bar
          span Добавить поток
          q-space
          q-btn(dense flat icon="close" v-close-popup)
            q-tooltip Close
        div.text-center
          q-input(label-color="white" filled v-model="start_at" label="Начало продаж" v-if="startPickerState === 'input' && endPickerState === 'input'")
            template(v-slot:append)
              q-icon(name="event" @click="startPickerState = 'date'")
          q-date(dark v-model="startDate" mask="YYYY-MM-DD" v-if="startPickerState === 'date'" @update:model-value="startPickerState = 'time'").bg-primary
          q-time( v-model="startTime" format24h v-if="startPickerState === 'time'" @update:model-value="updateStartAt").bg-primary

          q-input(label-color="white" filled v-model="closed_at" label="Завершение продаж и вход в чат" v-if="startPickerState === 'input' && endPickerState === 'input'")
            template(v-slot:append)
              q-icon(name="event" @click="endPickerState = 'date'")
          q-date( v-model="endDate" mask="YYYY-MM-DD" v-if="endPickerState === 'date'" @update:model-value="endPickerState = 'time'").bg-primary
          q-time( v-model="endTime" format24h v-if="endPickerState === 'time'" @update:model-value="updateClosedAt").bg-primary

          q-input(filled label-color="white" label="Ссылка на чат" v-model="link" v-if="startPickerState === 'input' && endPickerState === 'input'")
          q-input(filled label-color="white" type="textarea" label="Приветственное сообщение" v-model="welcome" v-if="startPickerState === 'input' && endPickerState === 'input'")
        q-btn(@click="createFlow").full-width создать поток

    
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
    let amount = parseFloat(editProduct.value.price) + parseFloat(editProduct.value.price) * parseFloat(editProduct.value.referral_percent) / 100
    
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
        account: config.tableCodeConfig.core,
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
  hostStore.loadHosts()
  
  editProduct.value = props.product
  editProduct.value.price = parseFloat(editProduct.value.total).toFixed(4)
  editProduct.value.referral_percent = editProduct.value.referral_percent / 1000000 * 100
  

})


</script>
