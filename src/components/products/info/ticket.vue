<template lang="pug">
q-card(dark v-if="flow")
  div.q-pa-md
    
    // p NFT-билет на поток # {{flow.id}}
    p welcome {{welcome}}
    // p user products {{hostStore.userProducts}}
  
  // p {{flow.encrypted_data}}
  div(v-if="waiting")
    q-btn( color="green" @click="refreshbal" disabled="true").full-width 
      q-spinner.q-mr-md
      p ожидаем ключ доступа
  div(v-else)
    q-btn(v-if="isValid" color="green" @click="open" :src="decrypted").full-width войти
    p(v-else).q-pa-md переданное сообщение не является ссылкой
</template>

<script setup lang="ts">

import { computed, ref, onUnmounted, onMounted, watch} from 'vue'
import { useUserStore } from '~/stores/user'
import { useHostStore } from '~/stores/host'
import { useRouter } from 'vue-router'
import userBalance from '~/components/core/oneUserBalance.vue'
import config from '~/config'
import chains from '~/chainsMain'
import moment from 'moment-with-locales-es6';
import 'moment/locale/ru';
import { Notify } from 'quasar'
import { useProductsStore } from '../store'

const productStore = useProductsStore()


moment.locale('ru')

const router = useRouter()
const loading = ref(false)

const isValid = ref(true)

const decrypted = ref("")

const hostStore = useHostStore()
const userStore = useUserStore()

const welcome = computed(() => {
  try{
    let meta = JSON.parse(props.flow.meta)
    return meta.welcome
  } catch(e){
    return "Добро пожаловать!"
  }

})

const props = defineProps({
    flow: {
      type: Object,
      required: true
    },
  })


function isValidURL(string) {
  var regex = /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/i;
  return regex.test(string);
}


const hosts = computed(() => hostStore.getHosts)

const myProduct = computed(() => Object.values(hostStore.userProducts).find(el => el.product_id == props.flow.product_id))

const waiting = computed(() => myProduct.value.encrypted_data == '')


watch(waiting, async (newValue) => {
  

  if (myProduct.value.encrypted_data != "") {
    if (interval.value)
      clearInterval(interval.value)

    decrypt()

  } else {
    setWaiter()
  }

})

const interval = ref(null)

const setWaiter = () => {
  interval.value = setInterval(() => hostStore.loadMyProducts(props.flow.host, userStore.username), 10000)
}

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
  if (isValidURL(decrypted.value)) {
    if (!/^http[s]?:\/\//.test(decrypted.value)) {
      window.open('https://' + decrypted.value)
    } else {
      window.open(decrypted.value)
    }
  }

  
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


const decrypt = async() => {
  
  decrypted.value = await productStore.decryptMessage(userStore.authData?.wif as string, userStore.username as string, myProduct.value.encrypted_data as string)
  isValid.value = isValidURL(decrypted.value)
}


onUnmounted(async() => {
  if (interval.value) 
    clearInterval(interval.value)
})

onMounted(async () => {
  hostStore.loadHosts()
  if (myProduct.value.encrypted_data != ""){
    decrypt()
  } else {
    setWaiter()
  }

})


</script>
