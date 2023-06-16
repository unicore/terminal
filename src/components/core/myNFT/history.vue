<template lang="pug">
div
  div(id="history")
    p(style="letter-spacing: 2px; font-size: 10px;").q-mb-md.text-center История
    
    div(v-if="Object.keys(history).length > 0" v-for="dhist in Object.values(history)" v-bind:key="dhist.id").full-width.q-pt-md
      span(style="font-size: 10px; letter-spacing: 2.1px;").full-width 
        q-badge(v-if="dhist.color=='black'" color="black" style="font-size: 10px;" ).bg-white.text-black.q-ma-xs # {{dhist.id + 1}} [{{dhist.pool_num}}]
        q-badge(v-else color="black" style="font-size: 10px;" ).text-white.q-ma-xs # {{dhist.id + 1}} [{{dhist.pool_num}}]
        
        span().q-ma-xs {{dhist.username}} 
        span(v-if="dhist.action=='deposit'") совершил взнос на: 
        span(v-if="dhist.action=='burn'") обменял {{host_obj.symbol}} на: 
        span(v-if="dhist.action !='burn' && dhist.action !='deposit'") получил возврат: 
        // p {{dhist}}
        q-badge(style="font-size: 10px;" v-if="dhist.action == 'deposit'").q-pa-xs {{dhist.amount}}
        q-badge(style="font-size: 10px;" v-if="dhist.action != 'deposit'" color="red") {{dhist.amount}}
        

        div(v-if="dhist.message !=''")
          div
            span и оставил сообщение: {{dhist.message}} 
          
        // p(v-if="dhist.message !=''").q-ml-lg

        //   i(style="font-size: 12px;") 

    div(v-if="history.length == 0")
      p(style="letter-spacing: 2px; font-size: 10px;").q-mb-md.text-center отсутствует


</template>

<script setup lang="ts">

import { computed, ref, onMounted} from 'vue'
import { useUserStore } from '~/stores/user'
import { useHostStore } from '~/stores/host'
import { useRouter } from 'vue-router'


const router = useRouter()

const hostStore = useHostStore()
const userStore = useUserStore()
const hostname = ref(router.currentRoute.value.params.hostname)

onMounted(async () => {
  hostStore.loadHistory(hostname.value)
})


let history = computed(() => {
  return hostStore.getHistory
})



</script>
