<template lang="pug">
div.q-pa-md
  div(v-if="products.length").row
    div(v-for="product of products" v-bind:key="product.id").col-md-4.col-xs-12
      productCard(:product="product" )
    
</template>

<script setup lang="ts">

import { computed, ref, onMounted, watch} from 'vue'
import { useUserStore } from '~/stores/user'
import { useHostStore } from '~/stores/host'
import { useRouter } from 'vue-router'
import userBalance from '~/components/core/oneUserBalance.vue'
import config from '~/config'
import chains from '~/chainsMain'
import productCard from '~/components/products/productCard.vue'

const router = useRouter()

const hostStore = useHostStore()
const userStore = useUserStore()

const products = computed(() => {
  return Object.values(hostStore.products)
})

onMounted(async () => {

})


</script>
