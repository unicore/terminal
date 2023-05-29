<template lang="pug">
q-card(dark)
  q-badge(floating) {{product.price}}
  
  div.q-pa-xs
    p(style="font-size: 18px;") {{product.title}}
    p {{product.description}}
  
  q-btn(@click="buyProduct").full-width
    i.fa-solid.fa-cart-shopping
    span.q-ml-md купить

</template>

<script setup lang="ts">

import { computed, ref, onMounted} from 'vue'
import { useUserStore } from '~/stores/user'
import { useHostStore } from '~/stores/host'

import userBalance from '~/components/core/oneUserBalance.vue'
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

const buyProduct = async () => {

    loading.value = true
    
    try {

      const rootChain = chains.getRootChain()
      const api = rootChain.getEosPassInstance(userStore.authData?.wif as string)
      let actions = [
            {
              account: props.product.token_contract,
              name: 'transfer',
              authorization: [
                {
                  actor: userStore.username as string,
                  permission: 'active',
                },
              ],
              data: {
                from: userStore.username,
                to: config.tableCodeConfig.core,
                quantity: props.product.total,
                memo: `800-${config.subscribe.coreHost}`
              },
            },
            {
              account: config.tableCodeConfig.core,
              name: 'buyproduct',
              authorization: [
                {
                  actor: userStore.username as string,
                  permission: 'active',
                },
              ],
              data: {
                buyer: userStore.username,
                host: config.subscribe.coreHost,
                product_id: props.product.id,
                quantity: 1
              },
            },
          ]

      console.log("ACTIONS: ", actions)

      await api.transact(
        {
          actions: actions
        },
        {
          blocksBehind: 3,
          expireSeconds: 30,
        }
      )

      Notify.create({
        message: 'Продукт куплен',
        color: 'positive',
      })


      loading.value = false

      
      router.push({name: "market"})
    } catch (e: any) {
      
      Notify.create({
        message: 'Произошла ошибка: ' + e.message,
        color: 'negative',
      })
    }

    loading.value = false
}


onMounted(async () => {

})


</script>
