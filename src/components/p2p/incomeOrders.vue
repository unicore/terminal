<template lang="pug">
div
  q-card(flat bordered v-for="order in orders" :key="order.id").bg-teal-1.q-mb-md
    q-badge( floating).bg-teal-5 №{{order.id}}
    q-card-section
      div.row.justify-around
        div.col-sm-6.col-md-6.col-xs-12.text-center.flex.q-gutter-xs
          div Тип: 
          div
            template(v-if="order.type == 'buy'")
              template(v-if="order.creator == userStore.username")              
                q-badge(v-if="!p2pSale" color="teal" label="оказываю" )
                q-badge(v-if="p2pSale" color="teal" label="покупаю" )
              template(v-else) 
                q-badge(v-if="!p2pSale" color="red" label="получаю" )
                q-badge(v-if="p2pSale" color="red" label="продаю" )
            template(v-if="order.type == 'sell'")
              template(v-if="order.creator != userStore.username")
                q-badge(v-if="!p2pSale" color="teal" label="оказываю" )
                q-badge(v-if="p2pSale" color="teal" label="покупаю" )
              template(v-else) 
                q-badge(v-if="!p2pSale" color="red" label="получаю" )
                q-badge(v-if="p2pSale" color="red" label="покупаю" )
        
        div.col-sm-6.col-md-6.col-xs-12.text-center.flex.q-gutter-xs
          span Валюта: 
          q-badge(color="primary") {{order.out_symbol}}
          q-badge(v-if="isAutoGateway(order)" color="teal" label="auto")

        
      div.row
        div.col-sm-6.col-md-6.col-xs-12.text-center.flex.q-gutter-xs
          div Сумма:
          div {{get_out_quantity(order)}}
        // div.col-sm-6.col-md-6.col-xs-12.text-center.flex.q-gutter-xs
        //   div Адрес: {{order.details.address}}
        //     span 
        //       q-btn(dense size="md" flat color="teal" @click="copy(order.details.address)").q-ml-xs
        //         i.fa.fa-copy
          // div(v-if="!p2pSale") Бонус
          // div(v-if="p2pSale") Всего
          
          // div {{order.root_quantity}}

        div.col-sm-6.col-md-6.col-xs-12.text-center.flex.q-gutter-xs
          div Курс:
          div {{parseFloat(order.quote_rate).toFixed(16)}} {{order.out_symbol}} / {{order.root_symbol}}
          // div.col-sm-6.col-md-6.col-xs-12.text-center.flex.q-gutter-xs
          //   div Партнёр:
          //   div {{order.creator == userStore.username ? order.parent_creator : order.creator}}
        
        // div.col-sm-6.col-md-6.col-xs-12.text-center.flex.q-gutter-xs
        //   div Подарок: {{order}}

      div.row.q-mt-md
        div(style="align-items: baseline;").col-sm-12.col-md-12.col-xs-12.text-center.flex.q-gutter-xs
          
          span Статус:
          span
            div(v-if="order.status == 'waiting'") ожидание
            div(v-if="order.status == 'process'")
              template(v-if="order.type == 'buy'")
                div(v-if="order.creator != userStore.username") ожидаем подтверждение от партнёра об отправке
                //{{get_out_quantity(order)}} в сети {{order.details.network}} на {{order.details.address}}
                div(v-else) отправляю {{get_out_quantity(order)}} в сети {{order.details.network}} на {{order.details.address}}
                  q-btn(dense size="md" flat color="teal" @click="copy(order.details.address)").q-ml-xs
                    i.fa.fa-copy
              template(v-if="order.type == 'sell'")
                div(v-if="order.creator == userStore.username") ожидаю поступления 
                //{{order.out_symbol}} на {{order.details.address}}
                div(v-else) отправляю {{get_out_quantity(order)}} на {{order.details.address}}
                  q-btn(dense size="md" flat color="teal" @click="copy(order.details.address)").q-ml-xs
                    i.fa.fa-copy
            div(v-if="order.status == 'payed'")
              template(v-if='order.type == "buy" && order.creator != userStore.username')
                span партнёр подтвердил отправку средств, проверьте поступление и подтвердите получение
                //{{get_out_quantity(order)}} на {{order.details.address}}
              template(v-else)
                span ожидаем подтверждение о поступлении средств от партнёра
            div(v-if="order.status == 'finish'") заявка исполнена
            div(v-if="order.status == 'dispute'") открыт спор
          
          
      div.row
        q-btn(style="margin-top: 20px;" color="teal" outline size="sm" @click="accept(order)" v-if="order.creator != userStore.username && order.status == 'waiting' && !isAutoGateway(order)").q-ma-xs начать обмен
        q-btn(style="margin-top: 20px;" color="teal" outline size="sm" @click="confirm(order)" v-if="!isAutoGateway(order) && order.status == 'process' && (order.creator == userStore.username && order.type=='buy' || order.creator != userStore.username && order.type=='sell')").q-ma-xs я отправил
        q-btn(style="margin-top: 20px;" color="teal" outline size="sm" @click="approve(order)" v-if="!isAutoGateway(order) && order.status == 'payed' && (order.creator != userStore.username && order.type =='buy' || order.creator == userStore.username && order.type =='sell')").q-ma-xs я получил
        // q-btn(style="margin-top: 20px;" color="red" outline size="sm" @click="approve(order)" v-if="!isAutoGateway(order) && order.status == 'payed' && (order.creator != userStore.username && order.type =='buy' || order.creator == userStore.username && order.type =='sell')").q-ma-xs открыть спор

        q-btn(style="margin-top: 20px;" color="grey" outline size="sm" v-if="order.status=='finish'" @click="del(order)") очистить
        q-btn(style="margin-top: 20px;" color="red" outline size="sm" @click="cancel(order.creator, order.id)" v-if="isCanCancel(order)").q-ma-xs отменить
       
    q-dialog(v-if="order.id == onAcceptId" v-model="prompt" persistent transition-show="slide-up" transition-hide="slide-down")
      q-card.bg-primary.text-white.full-width
        q-card-section
          div.text-h6 Введите реквизиты для получения {{order.out_symbol}}
        q-card-section.q-pt-none
          q-input(label="номер карты или адрес" dark dense v-model="new_address" @keyup.enter="prompt = false")
        q-card-actions(align="right")
          q-btn(flat label="Отменить" v-close-popup @click="prompt = false")
          q-btn(flat label="Подтвердить" @click="accept(order)")
    
</template>

<script setup lang="ts">

import { computed, ref, onMounted, watch} from 'vue'
import { useUserStore } from '~/stores/user'
import { useHostStore } from '~/stores/host'
import { useRouter } from 'vue-router'
import userBalance from '~/components/core/oneUserBalance.vue'
import config from '~/config'
import chains from '~/chainsMain'
import { useBlockchainStore } from '~/stores/blockchain'
import {Notify, copyToClipboard} from 'quasar'

const router = useRouter()

const hostStore = useHostStore()
const userStore = useUserStore()
const bcStore = useBlockchainStore()

import {useP2PStore} from './store'
const p2pStore = useP2PStore()

onMounted(async () => {

})


const props = defineProps({
  btc_rate: Number,
  type: String,
  orders: Array,
  root_contract: String,
  root_symbol: String,
  quote_token: Object,
  quote_symbol: String,
  out_currency: String
})


let prompt = ref(false)
let new_address = ref(null)
let onAcceptId = ref(null)
let confirmation = ref(false)


let p2pSale = computed(() => {
   return config.p2p.isExchange
})

const isAutoGateway = () => {
  return false
}

let headTime = computed(() => {
  return bcStore.getInfo.headTime
})



const get_out_quantity = (order) => {
  return order.out_quantity
  // console.log('toOrder', order.quote_quantity, order.quote_rate, order.out_rate)
  // return (parseFloat(order.quote_quantity) / parseFloat(order.out_rate)).toFixed(order.out_precision) + " " + order.out_symbol
}

const isCanCancel = (order) => {
// console.log("orderonCancel", order)
return (order.creator === userStore.username || order.parent_creator === userStore.username && order.status === 'waiting' || (order.parent_creator === userStore.username && isExpired(order.expired_at))) && ((order.type === 'buy' && order.status === 'process') || order.status === 'waiting')
}

const isExpired = (orderDate) => {
  const expired_at = new Date(orderDate).getTime()
  const blockchain_date = new Date(headTime).getTime()
  const is_expired = (expired_at - blockchain_date) / 1000 < 0 ? true : false
  
  return is_expired
}


const copy = async (address) => {
  copyToClipboard(address)
    .then(() => {
      Notify.create({
        message: 'Адрес скопирован',
        type: 'positive',
      })

    })
    .catch((e) => {
      console.log(e)
    })
}

const cancel = async (username, id) => {
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



const accept = async (order) => {
  onAcceptId.value = order.id

  var details = {type: "", address: ""}
  
  if (order.type == "buy") {
    details.type = order.out_symbol
    details.address = order.details.address
    details.network = "TRC20"
    details = JSON.stringify(details)

  }

  try {

    let res = await p2pStore.acceptOrder(userStore.username, order.id, details)

    await p2pStore.get_orders()

    Notify.create({
        message: "Заявка принята",
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
  // let notify_params = {
  //                 notify_to: order.creator,
  //                 status: 1,
  //                 signature: "signature",
  //               }

  //NOTIFY USERS! THROW BOT

   // this.$axios.get(this.$config.registrator + '/notify', 
   //      {                
   //        params: notify_params
   //      }).then(message =>{

   //        console.log('notify', message)

   //      }).catch(e => {
   //        console.log('notify', e.message)
   //      })

   //  this.$axios.get(this.$config.registrator + '/notify', 
   //      {                
   //        params: {
   //          notify_to: order.parent_creator,
   //          status: 1,
   //          signature: "signature",
   //        }
   //      }).then(message =>{

   //        console.log('notify', message)

   //      }).catch(e => {
   //        console.log('notify', e.message)
 //      })

}


const confirm = async (order) => {
  try {

    await p2pStore.confirmOrder(userStore.username, order.id)
    p2pStore.get_orders()

    Notify.create({
        message: "Заявка подтверждена",
        color: 'teal', //'negative' 'teal'
        classes: 'notify-class',
    })
  
        
  //   let notify_params = {
  //             notify_to: order.parent_creator,
  //             status: 2,
  //             signature: "signature",
  //           }

  //    this.$axios.get(this.$config.registrator + '/notify', 
  //         {                
  //           params: notify_params
  //         }).then(message =>{

  //           console.log('notify', message)

  //         }).catch(e => {
  //           console.log('notify', e.message)
  //         })

  //   let notify_params2 = {
  //             notify_to: order.creator,
  //             status: 2,
  //             signature: "signature",
  //           }

  //    this.$axios.get(this.$config.registrator + '/notify', 
  //         {                
  //           params: notify_params2
  //         }).then(message =>{

  //           console.log('notify', message)

  //         }).catch(e => {
  //           console.log('notify', e.message)
  //         })



  

  } catch(e){
    Notify.create({
        message: e.message,
        color: 'negative', //'negative' 'teal'
        classes: 'notify-class',
    })
    
  }


}


const approve = async (order) => {
  try{

    await p2pStore.approveOrder(userStore.username, order.id)
      
    p2pStore.get_orders()
    userStore.getUserBalances()

    Notify.create({
        message: "Заявка одобрена",
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
