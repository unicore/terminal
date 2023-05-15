<template lang="pug">
div(v-if="balances")
  div(v-if="Object.values(balances).length > 0")
    div(v-if="whiteBalances.length > 0")
      div(style="display: flex; align-items: center; justify-content: center;").full-width.text-center
        i(v-if="!whiteIsWin" style="font-size: 26px; color: teal; margin-right: 10px;").far.fa-circle
        i(v-else style="font-size: 26px; color: red; margin-right: 10px;").far.fa-circle
        
        p(style="font-size: 26px;") белые билеты
      div
        p(v-if="!whiteIsWin").text-grey.text-center получают доступ в клуб
        p(v-else).text-grey.text-center получают компенсацию
      
        
      vue3HorizontalList( :items="whiteBalances" :options="options")
        template(v-slot:default="{item}")
          userBalance(:balance="item" color="white" :host="props.host").col-4
    
    div(v-if="blackBalances.length > 0")
      div(style="display: flex; align-items: center; justify-content: center;").full-width.text-center
        i(v-if="whiteIsWin" style="font-size: 26px; color: teal; margin-right: 10px;").far.fa-circle
        i(v-else style="font-size: 26px; color: red; margin-right: 10px;").far.fa-circle
        
        p(style="font-size: 26px;") чёрные билеты
      div
        p(v-if="whiteIsWin").text-grey.text-center получают доступ в клуб
        p(v-else).text-grey.text-center получают компенсацию
      
      vue3HorizontalList( :items="blackBalances" :options="options")
        template(v-slot:default="{item}")
          userBalance(:balance="item" color="black" :host="props.host").col-4
    
    
  div(v-else).text-center у вас нет NFT-фракций
    
</template>//

<script setup lang="ts">

import vue3HorizontalList from "vue3-horizontal-list";
import { computed, ref, onMounted} from 'vue'
import { useUserStore } from '~/stores/user'
import { useHostStore } from '~/stores/host'
import { useRouter } from 'vue-router'
import userBalance from '~/components/core/oneUserBalance.vue'

const router = useRouter()

const hostStore = useHostStore()
const userStore = useUserStore()

const props = defineProps({
  host: {
    type: Object,
    required: true
  },
  balances: {
    type: Object,
    required: true
  }
})

let loading = ref(true)

const options = {
  responsive: [
    { end: 576, size: 1 },
    { start: 576, end: 768, size: 2 },
    { size: 3 },
  ]}

onMounted(async () => {
  // console.log("on load balances", userStore.username, props.hostname)
  await hostStore.loadBalances(userStore.username, props.host.username)
  // loading.value = false
})

let whiteIsWin = computed(() => {
  return props.host.currentPool.color == "white"
})

let balances = computed(() => {
  return Object.values(props.balances) || []
})

let whiteBalances = computed(() => {
  if (balances.value)
    return balances.value.filter(b => b.pool_color == "white")
  else return []
})

let blackBalances = computed(() => {
  if (balances.value)
    return balances.value.filter(b => b.pool_color == "black")
  else return []
})

</script>
