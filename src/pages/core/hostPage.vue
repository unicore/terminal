<template lang="pug">
div
  div(v-if= "loading").text-center.full-width.q-mt-lg
    loader
  div(v-if="currentHost && !loading").q-pa-md
    div(v-if="!showBalances").row.justify-center
      div(style="font-size: 16px;").col-md-6.col-xs-12
        
        // div().full-width.q-pl-md.q-pr-md.q-pb-md.text-center

          // span(style="font-size:24px;" v-if="currentHost.sale_is_enabled") Токенсейл {{currentHost.asset_on_sale_symbol}} 
          // span(style="font-size: 24px;") М-стейкинг
          // span пул 
          
          // q-badge(size="lg" outline v-if="currentHost.currentPool.color == 'white'" color="white").text-black.q-pa-sm №{{currentHost.current_pool_num}} белый
          // q-badge(size="lg" v-if="currentHost.currentPool.color != 'white'" color="black").text-white.q-pa-sm №{{currentHost.current_pool_num}} чёрный
                    
      
        div.full-width.q-pl-md.q-pr-md.q-mt-lg
          //
          q-linear-progress( size="60px" v-if="currentHost.currentPool.color=='black'" :value="progress / 100" color="black" track-color="white" style="border: 1px solid grey;" rounded).full-width
            div.absolute-full.flex.flex-center
              
              // q-badge(color="primary" text-color="white" :label="'заполнение ' + (progress) + '%'")
              q-badge(style="font-size: 16px;" v-if="currentHost.currentPool.color != 'white'" color="black").text-white.q-pa-sm Чёрный пул №{{currentHost.current_pool_num}} ({{progress}}%)
          

          q-linear-progress(size="60px" v-if="currentHost.currentPool.color=='white'"   :value="progress / 100" color="white" track-color="black" style="border: 1px solid grey;" rounded).full-width.bg-black
            div.absolute-full.flex.flex-center
              q-badge(style="font-size: 16px;"  v-if="currentHost.currentPool.color == 'white'" color="white").text-black.q-pa-sm Белый пул №{{currentHost.current_pool_num}} ({{progress}}%)
          
              // q-badge(color="white" text-color="primary" :label="'заполнение ' + (progress) + '%'")

          
          div.q-pa-sm.full-width.text-center
            div(v-if="currentHost.sale_is_enabled")
              span(style="font-size: 12px;").q-pa-xs до следующего пула: 
              q-badge(flat color="white" text-color="black").q-pa-sm {{currentHost.currentPool.remain}}
              
            div(v-if="!currentHost.sale_is_enabled")

              span(style="font-size: 12px;").q-pa-xs до перезагрузки: 
              q-badge(color="black" flat v-if="!waitingMode").q-pa-sm {{untilRestart}}
              q-badge(color="black" flat v-if="waitingMode").q-pa-sm -

        div(style="padding-top: 30px; margin-bottom: 50px;").row.justify-center

          div.col-6.q-pa-xs
            buyWindow(:hostname="currentHost.username").full-width
          div.col-6.q-pa-xs
            q-btn(color="green" flat size="md"  @click="router.push({name: 'nft-balances', params: {hostname: currentHost.username}})").full-width Мои балансы
        
        

      div.col-md-6.col-xs-12
        // WalletsCarousel( :mini="false" )
        
        // q-card().nft-card.bg-secondary.text-white.q-mb-lg
        
        //   q-card-section
        //     div.text-h5 {{currentHost.title}}
        //     // div.text-h6 DAO {{currentHost.username.toUpperCase()}}
        //     pre.q-mt-sm.purpose {{displayedPurpose}}
            
        //   q-btn(dense size="sm" @click="showMore = !showMore").full-width.text-center {{showMore ? 'Показать меньше' : 'Показать больше'}}
        
           

        div().row.justify-center
          div.col-md-12.col-xs-12
            div.row

              div.col-12.q-mb-lg
                q-card(flat )
                  div(style="align-items: center;")
                    p(style="font-size: 12px;").text-grey Режим
                      // q-btn(flat size="xs" dense icon="fas fa-question").q-ml-xs 
                    p(color="black" outline) {{mode}}
                    // p.text-grey на каждом одноцветном пуле

                  q-separator
                

              div(v-if="currentHost.sale_is_enabled").col-12.q-mb-lg
                q-card(flat )
                  div(style="align-items: center; ")
                    p(style="font-size: 12px;").text-grey Курс
                      // q-btn(flat size="xs" dense icon="fas fa-question").q-ml-xs 
                    p(color="black" outline) {{currentHost?.quants_convert_rate / 10000}} USDT / MAVRO
                    // p.text-grey на каждом одноцветном пуле

                  q-separator
                


                // div.col-1.q-pa-xs
                  // q-btn(flat rounded outline color="grey").full-width.full-height ?
            


              div.col-12.q-mb-lg
                q-card(flat )
                  div(style="align-items: center; ")
                    p(style="font-size: 12px;").text-grey Доходность
                      // q-btn(flat size="xs" dense icon="fas fa-question").q-ml-xs 
                    p(color="black" outline) +{{profitStep}}%
                    // p.text-grey на каждом одноцветном пуле
                    
                  q-separator
                


              // div(style="align-items: center;").text-center.col-12.q-pa-md
              //   q-card(flat bordered)
              //     div.q-pa-sm
              //       p(style="font-size: 12px;").q-pa-xs Доходность
              //       q-badge(color="black" outline).q-pa-sm +{{profitStep}}%
              //       p(style="font-size: 12px;").text-grey на каждом одноцветном пуле

                    
                  // q-separator
                // div.col-1.q-pa-xs
                  // q-btn(flat rounded outline color="grey").full-width.full-height ?


              div(v-if="!currentHost.sale_is_enabled").col-12.q-mb-lg
                q-card(flat )
                  div(style="align-items: center; ")
                    p(style="font-size: 12px;").text-grey Риск
                      // q-btn(flat size="xs" dense icon="fas fa-question").q-ml-xs 
                    p(color="black" outline) -{{currentHost.spiral?.loss_percent / 10000}}%
                    // p.text-grey на каждом одноцветном пуле

                  q-separator
                
              div(v-if="currentHost.sale_is_enabled").col-12.q-mb-lg
                q-card(flat )
                  div(style="align-items: center; ")
                    p(style="font-size: 12px;").text-grey Риск
                      // q-btn(flat size="xs" dense icon="fas fa-question").q-ml-xs 
                    p(color="black" outline) 0%
                    // p.text-grey на каждом одноцветном пуле

                  q-separator
                



                    // p.text-grey на первом противоцветном пуле
                  // q-separator

                

                // div.col-1.q-pa-xs
                  // q-btn(flat rounded outline color="grey").full-width.full-height ?
                
              

              div(style="align-items: center;" ).text-center.col-12.q-pa-md

            

        
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



        // div(v-if="!showBalances" style="padding-top: 50px;")
        //   div
        //     history

          img(:src="currentHost?.meta.host_image")
      
      
    
    
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
import WalletsCarousel from '~/components/wallet/WalletsCarousel.vue'

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
const showMore = ref(false)

// const showBalances = ref(false)
let progress = ref(0);

const profitStep = computed(() => {
  return currentHost.value.profitStep
})

const mode = computed(() => {
  return currentHost.value.type == 'tokensale' ? `токенсейл ${currentHost.value.asset_on_sale_symbol}` : 'спираль'
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

const displayedPurpose = computed(() => {
  if (showMore.value) {
    return currentHost.value.purpose
  } else {
    // Обрезаем текст до первых 100 символов, например
    return currentHost.value.purpose.substr(0, 100) + '...'
  }
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

  .purpose {
    font-size: 14px;
    white-space: pre-wrap;
  }

  .cardDescription{
    
    padding: 10px;
  }  
</style>