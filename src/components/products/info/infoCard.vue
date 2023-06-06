<template lang="pug">

q-card(dark).bg-secondary
  q-badge(floating size="lg") {{product.total}}
  
  div.q-pa-md
    p(style="font-size: 18px;") {{product.title}}
    p {{product.description}}

  q-card-actions.q-mt-lg

    q-btn(v-if="showBuy" @click="buyProduct")
      i.fa-solid.fa-cart-shopping
      span.q-ml-md купить

    q-btn(v-if="showMore" @click="moreAboutProduct")
      i.fa-solid.fa-cart-shopping
      span.q-ml-md подробнее

    

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

const showBuy = computed(() => {
  return router.currentRoute.value.params.hostname && router.currentRoute.value.params.id
})

const showMore = computed(() => {
  return !router.currentRoute.value.params.id
})

const hostStore = useHostStore()
const userStore = useUserStore()

const loading = ref(false)

const props = defineProps({
    product: {
      type: Object,
      required: true,
    }
  })

const moreAboutProduct = async() => {
  router.push({name: "market", params: {hostname: props.product.host, id: props.product.id}})
}

const buyProduct = async () => {

    loading.value = true
    
    try {

      const rootChain = chains.getRootChain()
      const api = rootChain.getEosPassInstance(userStore.authData?.wif as string)

      await api.transact(
        {
          actions: [
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
                memo: `100-${config.coreHost}`
              },
            },
            {
              account: config.tableCodeConfig.secret,
              name: 'buyproduct',
              authorization: [
                {
                  actor: userStore.username as string,
                  permission: 'active',
                },
              ],
              data: {
                buyer: userStore.username,
                host: config.coreHost,
                product_id: props.product.id,
                quantity: 1
              },
            },
          ],
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
      
      // router.push({name: "welcome"})

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
