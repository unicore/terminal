<template lang="pug">
div
  div(v-if= "loading").text-center.full-width.q-mt-lg
    loader
  div(v-if="currentHost && !loading").q-pa-md
    div(v-if="!showBalances").row.justify-center
      div.col-md-4.col-xs-12
        q-card().nft-card.bg-secondary.text-white.q-mb-lg
        
          q-card-section
            div.text-h5 {{currentHost.title}}
            div.text-h6 DAO {{currentHost.username.toUpperCase()}}
            div {{currentHost.purpose}}
        
        // div(v-if="!showBalances" style="padding-top: 50px;")
        //   div
        //     history

          img(:src="currentHost?.meta.host_image")
      
      div(style="font-size: 16px;").col-md-8.col-xs-12
        div(styl="font-size: 22px;").full-width.bg-white.q-pl-md.q-pr-md.q-pb-md.text-center
          span раунд 
          
          q-badge(size="lg" outline v-if="currentHost.currentPool.color == 'white'" color="white").text-black.q-pa-sm №{{currentHost.current_pool_num}} белый
          q-badge(size="lg" v-if="currentHost.currentPool.color != 'white'" color="black").text-white.q-pa-sm №{{currentHost.current_pool_num}} чёрный
                    
      
        div.full-width.bg-white.q-pl-md.q-pr-md
          //
          q-linear-progress( size="40px" v-if="currentHost.currentPool.color=='black'" :value="progress / 100" color="black" track-color="white" style="border: 1px solid teal;" rounded).full-width
            div.absolute-full.flex.flex-center
              q-badge(color="primary" text-color="white" :label="'заполнен взносами на ' + (progress) + '%'")
          q-linear-progress(size="40px" v-if="currentHost.currentPool.color=='white'"   :value="progress / 100" color="white" track-color="black" style="border: 1px solid teal;" rounded).full-width.bg-black
            div.absolute-full.flex.flex-center
              q-badge(color="white" text-color="primary" :label="'заполнен взносами на ' + (progress) + '%'")

          div(style="font-size: 10px;").full-width.text-center
            p(v-if="waitingMode") режим ожидания
            p(v-else) завершение цикла обмена {{untilRestart}}
        div.row.justify-center.q-mt-lg
          div.col-md-6.col-xs-12
            q-card(flat )
              q-card-section
                span Доходность: 
                q-badge.q-pa-sm +{{profitStep}}%
                p.text-grey на каждом одноцветном раунде
              q-separator
              
              // q-card-section
              //   span риск: 
              //   q-badge.q-pa-sm -{{currentHost.spiral?.loss_percent / 10000}}%
              //   p.text-grey на первом противоцветном раунде
              
                
          div.col-md-6.col-xs-12
            q-card(flat )
              q-card-section
                span Благотворительность: 
                q-badge.q-pa-sm -{{currentHost.spiral?.loss_percent / 10000}}%
                p.text-grey на первом противоцветном раунде
              q-separator
              // q-card-section
              //   span осталось: 
              //   q-badge.q-pa-sm {{currentHost.currentPool.remain_quants / 1000000}}
              //   p.text-grey токенов
              // q-separator

              // q-card-section
                // span цена: 
                //   q-badge.q-pa-sm {{currentHost.currentRate?.quant_buy_rate}}
                //   p.text-grey токена
                
              //   span цена продажи: 
              //   q-badge.q-pa-sm {{currentHost.currentRate?.quant_sell_rate}}
              //   p.text-grey токена
              
              // q-card-section
              //   span обеспечение: 
              //   q-badge.q-pa-sm {{currentHost.quote_amount}}
              //   p.text-grey криптовалюта, которую можно получить, если порвать свою фракцию

            // q-card-actions(align="right")
            
          div(style="padding-top: 30px; margin-bottom: 100px;").float-right
            q-btn(color="teal" size="lg" flat @click="router.push({name: 'nft-balances', params: {hostname: currentHost.username}})") Мои токены
            buyWindow(:hostname="currentHost.username")
  
      
    div(v-if="showBalances")
      userBalances(:host="currentHost" :balances="balances")
    // div.cardDescription
      
</template>

<script setup lang="ts">//
import { useHostStore } from '~/stores/host'
import { watchEffect, ref, onMounted, watch, computed, onUnmounted} from 'vue'
import { useRouter } from 'vue-router'
import nftMarketCard from '~/components/core/nftMarketCard.vue'
import buyWindow from '~/components/core/buyWindow.vue'
import userBalances from '~/components/core/myNFT/userBalances.vue'
import history from '~/components/core/myNFT/history.vue'
import { useBlockchainStore } from '~/stores/blockchain'
import loader from '~/components/common/loader.vue'

import moment from 'moment-with-locales-es6';
import 'moment/locale/ru';
moment.locale('ru')

import { useUserStore } from '~/stores/user'
const userStore = useUserStore()

const router = useRouter()
const hostStore = useHostStore()
const bcStore = useBlockchainStore()
const hostname = ref(router.currentRoute.value.params.hostname)
const host = ref(null)
// const showBalances = ref(false)
let progress = ref(0);

const profitStep = computed(() => {
  return currentHost.value.profitStep
})

let currentTime = computed(() => {
  return bcStore.getInfo.head_block_time
})

let waitingMode = computed(() => {
  if (currentHost.value)
    return currentHost.value.currentPool.pool_num <= 2
  else return true
})

let balances = computed(() => {
  return Object.values(hostStore.getBalances) || []
})

let showBalances = computed(() => {
  return router.currentRoute.value.name == 'nft-balances'
})
let loading = ref(true)
const intervalId = ref(null)

onMounted(async () => {
  hostStore.loadHost(hostname.value)
  hostStore.loadBalances(userStore.username, hostname.value)
  
  intervalId.value = setInterval(() => {
      hostStore.loadHost(hostname.value)
  }, 10000)

})


onUnmounted(() => {
  if (intervalId.value) {
    clearInterval(intervalId.value);
  }
});


let currentHost = computed(() => {
  return hostStore.getCurrentHost(hostname.value)
})



watch(currentHost, (newVal) => {
  if (newVal){
    progress.value = newVal.currentPool.filled_percent / 10000 //
    loading.value = false
  }
})

let untilRestart = computed( () => {
  if (currentHost.value && currentTime) {
    var pool_expired_after_seconds = new Date(currentHost.value.currentPool.pool_expired_at);
    var bcTime = new Date(currentTime.value)
    let expired_between = (pool_expired_after_seconds - bcTime) / 1000  
    let futureTime = moment().add(expired_between, 'seconds');
    let fromNow = futureTime.fromNow()

    return fromNow
    
  }
})


          


</script>



<style scoped lang="scss">
  .cardDescription{
    font-size: 18px;
    padding: 10px;
  }  
</style>