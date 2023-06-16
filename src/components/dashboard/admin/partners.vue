<template lang="pug">
div.row.justify-center.q-pa-md
  q-list( clickable).col-md-6.col-xs-12
    q-card(bordered)
      div.q-pa-md
        p.text-grey Настройка уровней
        q-input(type="number"  v-for="(level, index) of levels" v-bind:key = "index" v-model="levels[index]" :label="'Уровень ' + parseInt(index + 1) + ', %'")
          template(v-slot:append)
            q-btn(dense color="red" @click="del(index)") -
        q-btn(flat color="green" @click="add").full-width +
        span сумма: {{summ}}% 
        
        span(v-if="diff > 0").q-pl-md распределить: {{diff}}%
      q-btn( color="green" :loading="loading" @click="setLevels").full-width установить
      
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

const levels = ref([])

const summ = computed(() => {
  let s = 0
  levels.value.map(l => s = parseFloat(s) + parseFloat(l))

  return s 
})

const diff = computed(() => {
  if (summ.value)
    return (parseFloat(100) - parseFloat(summ.value)).toFixed(8)
})

const host = computed(() => {
  return hostStore.getCurrentHost(config.coreHost)
})

watch(host, (newValue) => {
  levels.value = host.value.levels.map(el => el / 10000)
})
onMounted(async () => {
  hostStore.loadHosts()
})

function removeElementAtIndex(arr, index) {
    if (index > arr.length - 1 || index < 0) {
        return 'Неверный индекс';
    }
    arr.splice(index, 1);
    return arr;
}

const del = async (index) => {
  levels.value = removeElementAtIndex(levels.value, index)
}

const add = async() => {
  levels.value.push(0)
}
 


const setLevels = async () => {
  loading.value = true
  
    try {

      const rootChain = chains.getRootChain()
      const api = rootChain.getEosPassInstance(userStore.authData?.wif as string)
     
      let lvls = levels.value.map(el => el * 10000)
      let actions = [
        {
          account: config.tableCodeConfig.core,
          name: 'setlevels',
          authorization: [
            {
              actor: userStore.username as string,
              permission: 'active',
            },
          ],
          data: {
              host: config.coreHost,
              levels: lvls
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

     Notify.create({
        message: 'Уровни установлены',
        color: 'positive',
      })


      loading.value = false

      hostStore.loadHosts()
     
    } catch (e: any) {
      loading.value = false
      console.log(e)
      Notify.create({
        message: 'Произошла ошибка: ' + e.message,
        color: 'negative',
      })
    }



}

</script>
