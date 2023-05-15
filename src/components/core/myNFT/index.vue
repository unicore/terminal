<template lang="pug">
div
  div(v-if="userHosts").q-pa-md
    div(v-if="loading")
      loader
    div(v-if="!loading && userHosts.length > 0" v-for="obj in userHosts" )
      div( style="padding-bottom: 100px;")
        div.row.q-pl-md.q-pr-md
          div.col-md-4.col-xs-12
            nftMarketCard(:host="obj.host")
          div.col-md-8.col-xs-12.q-pl-lg
            userBalances(:balances="obj.balances" :host="obj.host" style="padding-top: 25px;")
      
      div(style="border-top: .1px solid teal; padding-bottom: 100px;")
  
    div(v-if="!loading && userHosts.length == 0")
      div.q-pa-md.text-center у вас нет NFT-фракций
    
</template>

<script setup lang="ts">

import { computed, ref, onMounted} from 'vue'
import { useUserStore } from '~/stores/user'
import { useHostStore } from '~/stores/host'
import { useRouter } from 'vue-router'
import userBalance from '~/components/core/oneUserBalance.vue'
import nftMarketCard from '~/components/core/nftMarketCard.vue'
import userBalances from '~/components/core/myNFT/userBalances.vue'
import loader from '~/components/common/loader.vue'

let loading = ref(true)

const router = useRouter()

const hostStore = useHostStore()
const userStore = useUserStore()

let allUserBalances = computed(() => {
  return hostStore.getAllUserBalances
})

let userHosts = computed(() => {
  if (allUserBalances.value)
    return Object.values(allUserBalances.value)
  else return []
})

onMounted(async () => {
  await hostStore.loadAllUserBalances(userStore.username)
  loading.value = false
})



</script>
