<template lang="pug">
q-card(v-for="order in orders" :key="order.id" flat bordered ).bg-red-1.q-mb-md
  q-badge( floating).bg-red-5 №{{order.id}}
  q-card-section
    div.row.justify-between.q-gutter-xs
      div.col-12.text-center.flex.q-gutter-xs
        span Тип: 
        q-badge(color="teal" v-if="order.type == 'buy'" label="покупаю" )
        q-badge(color="red" v-if="order.type == 'sell'" label="продаю" )
      div.col-12.text-center.flex.q-gutter-xs
        div Валюта: 
        // div {{order.out_symbol}}
        q-badge(color="primary") {{order.out_symbol}}
    
      div.col-12.text-center.flex.q-gutter-xs
        div Всего к получению: 
        div {{order.quote_quantity}}

      div.col-12.text-center.flex.q-gutter-xs
        div Осталось получить: 
        div {{order.quote_remain}}
      
      div.col-12.text-center.flex.q-gutter-xs
        div Заморожено в поручениях:
        div {{order.quote_locked}}
      
      

      // div.col-12.text-center.flex.q-gutter-xs
      //   div Всего к получению: 
      //   div {{order.root_quantity}}
      
      // div.col-12.text-center.flex.q-gutter-xs
      //   div Осталось получить:
      //   div {{order.root_remain}}

      // div.col-12.text-center.flex.q-gutter-xs
      //   div Заморожено в поручениях:
      //   div {{order.root_locked}}

      div.col-12.text-center.flex.q-gutter-xs
        div Адрес для получения:
        div {{order.details.address}}


    div.row.justify-between.q-mt-md
      div
        // div Действия
        div
          q-btn(color="red" v-if="order.status == 'waiting'" :disabled="parseFloat(order.root_locked) != 0" outline size="sm" @click="cancel(order.id)").full-width отменить

        div
          q-btn(color="grey" v-if="order.status == 'finish'" outline size="sm" @click="del(order)").full-width очистить
      

      
</template>

<script setup lang="ts">

import { computed, ref, onMounted, watch} from 'vue'
import { useUserStore } from '~/stores/user'
import { useHostStore } from '~/stores/host'
import {useP2PStore} from './store'

import { useRouter } from 'vue-router'
import userBalance from '~/components/core/oneUserBalance.vue'
import config from '~/config'
import chains from '~/chainsMain'

import { Notify } from 'quasar'

const router = useRouter()

const hostStore = useHostStore()
const userStore = useUserStore()
const p2pStore = useP2PStore()


const props = defineProps({
  btc_rate: Number,
  type: String,
  orders: Array,
  root_contract: String,
  root_symbol: String,
  quote_token: Object,
  quote_symbol: String,
  out_currency: String,
  out_token: Object,
  root_token: Object,
})

const rootChain = chains.getRootChain()
const api = rootChain.getEosPassInstance(userStore.authData?.wif as string)
    

// onMounted(async () => {
//   // Code here
// })


const cancel = async (id) => {
  try {
    await p2pStore.cancelOrder(userStore.username, id)

    await p2pStore.get_orders()
    userStore.getUserBalances()

    Notify.create({
      message: 'Заявка отменена',
      color: 'teal',
      classes: 'notify-class',
    })
  } catch (e) {
    Notify.create({
      message: e.message,
      color: 'negative',
      classes: 'notify-class',
    })
  }
}



const del = async (order) => {
  try{

    await p2pStore.delOrder(userStore.username, order.id)
      
    p2pStore.get_orders()
    
    Notify.create({
        message: "Заявка удалена из оперативной памяти",
        color: 'teal', //'negative' 'teal'
        classes: 'notify-class',
    })

  } catch(e){
     Notify.create({
          message: e.message,
          color: 'negative', //'negative' 'teal'
          classes: 'notify-class',
     })
  }
    
}



</script>
