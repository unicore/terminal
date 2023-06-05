<template lang="pug">
div.q-pa-md
  
  div(v-if="userProducts").row
    div(v-for="product of userProducts" v-bind:key="product.id").col-md-4.col-xs-12
      productCard(:product="product" ).q-pa-xs
    
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


const userProducts = computed(() => {
  let products = hostStore.products
  let userProducts = hostStore.userProducts
  
  Object.values(userProducts).map(el => {

    let product = products[el.product_id]
    el.title = product.title
    el.description = product.description
    el.price = product.price
    el.token_contract = product.token_contract
    el.total = product.total
  })
  return Object.values(userProducts)
})

onMounted(async () => {
    if (userStore.hasAuth){
      await hostStore.loadProducts(config.coreHost) 
      await hostStore.loadMyProducts(config.coreHost, userStore.username)     
    }
})


</script>
