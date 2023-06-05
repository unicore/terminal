<template lang="pug">
q-card(dark v-if="flow")
  div.q-pa-md
    p NFT-билет на поток # {{flow.id}}
    p добро пожаловать и другой welcome-мессадж
    // p user products {{hostStore.userProducts}}
  // p {{myProduct}}
  // p {{flow.encrypted_data}}
  div(v-if="waiting")
    q-btn( color="green" @click="refreshbal" disabled="true").full-width ожидаем ключ доступа
  div(v-else)
    q-btn( color="green" @click="open").full-width войти
</template>

<script setup lang="ts">

import { computed, ref, onMounted, watch} from 'vue'
import { useUserStore } from '~/stores/user'
import { useHostStore } from '~/stores/host'
import { useRouter } from 'vue-router'
import userBalance from '~/components/core/oneUserBalance.vue'
import config from '~/config'
import chains from '~/chainsMain'
import moment from 'moment-with-locales-es6';
import 'moment/locale/ru';
import { Notify } from 'quasar'

moment.locale('ru')

const router = useRouter()
const loading = ref(false)

const hostStore = useHostStore()
const userStore = useUserStore()


const props = defineProps({
    flow: {
      type: Object,
      required: true
    },
  })

const hosts = computed(() => hostStore.getHosts)

const myProduct = computed(() => Object.values(hostStore.userProducts).find(el => el.product_id == props.flow.product_id))

const waiting = computed(() => myProduct.value.encrypted_data == '')

const salesFinishAfter = computed(() => {

  let now = moment.utc()
  let expired_at = moment.utc(props.flow.closed_at)

  let fromNow = expired_at.fromNow()
  return fromNow
})


const isSalesFinish = computed(() => {

  let now = moment.utc()
  let expired_at = moment.utc(props.flow.closed_at)

  const diffInSeconds = expired_at.diff(now, 'seconds');
  
  return diffInSeconds < 0

})

const open = () => {
  alert('decrypt it')
}

async function load() {
  await hostStore.loadFlows(props.flow.host)

  if (userStore.hasAuth)
    await hostStore.loadMyProducts(props.flow.host, userStore.username) 

}


const refreshbal = async () => {
  // Здесь можно выполнить фиктивную отправку транзакции в блокчейн
  loading.value = true;
  const userStore = useUserStore()

  const rootChain = chains.getRootChain()
  const api = rootChain.getEosPassInstance(userStore.authData?.wif as string)
    
 

  
};


onMounted(async () => {
  hostStore.loadHosts()

})


</script>
