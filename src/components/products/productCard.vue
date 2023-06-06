<template lang="pug">
div 
  // subscribe(v-if="isSubscribe" :product="product")
  info( :product="product")
</template>

<script setup lang="ts">//

import { computed, ref, onMounted} from 'vue'
import { useUserStore } from '~/stores/user'
import { useHostStore } from '~/stores/host'
import subscribe from './subscribe/subscribeCard.vue'
import info from './info/infoCard.vue'

import config from '~/config'
import { Notify } from 'quasar'
import chains from '~/chainsMain'

import { useRouter } from 'vue-router'
const router = useRouter()

const hostStore = useHostStore()
const userStore = useUserStore()

const loading = ref(false)

const props = defineProps({
    product: {
      type: Object,
      required: true,
    }
  })

const isSubscribe = computed(() => {
  return props.product.type == ''
})


const isInfo = computed(() => {
  return props.product.type == 'info'
})


onMounted(async () => {

})


</script>

<style>

</style>
