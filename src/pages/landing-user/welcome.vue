<template lang="pug">
div.row.q-mt-md.justify-center
  div.col-xs-12.col-md-8
    q-card(dark).q-pa-md
      h1 Добро пожаловать
      p Приветствуем тебя, партнёр! 
      // pproducts.length
      // p Применяя наше ПО
      q-btn(@click="goToMarket" color="teal" ).q-mt-lg Перейти в маркетплейс
</template>

<script setup lang="ts">

import { computed, ref, onMounted, watch} from 'vue'
import { useUserStore } from '~/stores/user'
import { useHostStore } from '~/stores/host'
import { useRouter } from 'vue-router'
import userBalance from '~/components/core/oneUserBalance.vue'
import config from '~/config'
import chains from '~/chainsMain'

const router = useRouter()

const hostStore = useHostStore()
const userStore = useUserStore()

onMounted(async () => {

})

const goToMarket = () => {
  router.push({name: "market"})
}
</script>
