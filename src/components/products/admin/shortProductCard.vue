<template lang="pug">
div
  q-list(bordered)
    q-item( clickable @click="router.push({name: 'admin-products', params: {id: product.id}})")
      q-item-section
        q-item-label(caption)
          h3 # {{product.id}} {{product.title}}
      
        q-item-label
          p {{product.description}}
        
        
  
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


const props = defineProps({
    product: {
      type: Object,
      required: true
    },
  })


onMounted(async () => {

})


</script>
