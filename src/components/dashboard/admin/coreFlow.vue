<template lang="pug">
div
  q-list( clickable)
    q-card(bordered)
      div.q-pa-md
        p(v-if="incomes.length == 0").text-grey Бизнес-доход отсутствует
        p(v-if="incomes.length > 0").text-grey Бизнес-доход:
        q-item(bordered v-ripple v-for="inc of incomes" v-bind:key="inc.id")
          q-item-section
            p {{inc.amount}} | {{inc.contract}}
            p {{inc.memo}}
            hr
      q-btn(:disable="incomes.length == 0" color="secondary" @click="withdrawAll" :loading="loading").full-width получить
      
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
const loading = ref(false)
const hostStore = useHostStore()
const userStore = useUserStore()

const incomes = computed(() => Object.values(hostStore.incomes))

onMounted(async () => {
  hostStore.loadDacsIncome(config.coreHost)
})

const withdrawAll = async () => {
  loading.value = true
    let inc = incomes.value[0]
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


   Notify.create({
      message: 'Токены получены',
      color: 'positive',
    })


    loading.value = false

    hostStore.loadDacsIncome(config.coreHost)
    


}

</script>
