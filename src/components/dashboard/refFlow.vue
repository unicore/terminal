<template lang="pug">
q-list( clickable)
  q-card(dark)
    div.q-pa-md
      p.text-grey Настройка уровней
      q-input(dark v-for="(level, index) of levels" v-bind:key = "index" v-model="levels[index]" :label="'Уровень ' + parseInt(index + 1) + ', %'")

    q-btn( color="green" @click="" :loading="loading") установить
      
</template>

<script setup lang="ts">

import { computed, ref, onMounted, watch} from 'vue'
import { useUserStore } from '~/stores/user'
import { useHostStore } from '~/stores/host'
import { useRouter } from 'vue-router'
import userBalance from '~/components/core/oneUserBalance.vue'
import config from '~/config'
import chains from '~/chainsMain'
import dacsIncome from '../core/dacsIncome.vue'
import {Notify} from 'quasar'

const router = useRouter()
const loading = ref(false)
const hostStore = useHostStore()
const userStore = useUserStore()

const levels = [50, 25, 12.5, 6.25, 6.25]

onMounted(async () => {

})

const withdrawAll = async () => {
  loading.value = true
  for (const inc in incomes.value){
    console.log(inc)
    
    try {

      const rootChain = chains.getRootChain()
      const api = rootChain.getEosPassInstance(userStore.authData?.wif as string)
     
      
      let actions = [
        {
          account: config.tableCodeConfig.core,
          name: 'spreadlist',
          authorization: [
            {
              actor: userStore.username as string,
              permission: 'active',
            },
          ],
          data: {
              host: config.coreHost
          }
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

     
    } catch (e: any) {
      loading.value = false
      console.log(e)
      Notify.create({
        message: 'Произошла ошибка: ' + e.message,
        color: 'negative',
      })
    }




  }

   Notify.create({
      message: 'Токены получены',
      color: 'positive',
    })


    loading.value = false

    hostStore.loadDacsIncome(config.coreHost)
    


}

</script>
