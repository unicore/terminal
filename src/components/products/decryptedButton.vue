<template lang="pug">
div
  q-btn(color="secondary" outline v-if="!error" @click="move") войти 
  p(v-else) не удалось расшифровать ссылку
</template>

<script setup lang="ts">

import { computed, ref, onMounted, watch} from 'vue'
import { useUserStore } from '~/stores/user'
import { useHostStore } from '~/stores/host'
import { useRouter } from 'vue-router'
import userBalance from '~/components/core/oneUserBalance.vue'
import config from '~/config'
import chains from '~/chainsMain'
import { useProductsStore } from './store'

const productStore = useProductsStore()
const router = useRouter()


const props = defineProps({
    data: {
      type: String,
      required: true
    },
  })

const error = ref(false)

const decrypted = ref("")

const hostStore = useHostStore()
const userStore = useUserStore()


const move = async() => {
  window.open(decrypted.value, '_blank');
}

const decrypt = async (msg) => {
   let d = await productStore.decryptMessage(userStore.authData?.wif as string, userStore.username as string, msg)
   return d
}

onMounted(async () => {
  try{

    decrypted.value = await decrypt(props.data)
  } catch(e){
    error.value = true
  }
})


</script>
