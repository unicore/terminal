<template lang="pug">
div.full-width
  div
    q-input(filled label-color="white" type="number" controls-position="right" v-model="amount" :precision="8" :step="0.0001" :min="0.0001" label="Введите сумму в USDT:") 
      // template(v-bind:slot="append")
        // span {{wallet.symbol}}
    
    q-input(filled label-color="white" label="Введите адрес USDT TRC20:"  v-model="address")
    
  q-btn(color="teal" :loading="loading" type="success" @click="withdraw").full-width Вывести
</template>

<script setup lang="ts">//
import { computed, ref, watch} from 'vue'
import { useUserStore } from '~/stores/user'
import chains from '~/chainsMain'
import { Notify } from 'quasar'
import config from '~/config'

const userStore = useUserStore()

const emit = defineEmits(['withdrawFinish'])

const props = defineProps({
    wallet: {
      type: Object,
      required: true,
    }
  })


let loading = ref(false)
let amount = ref("")
let address = ref("")


const withdraw = async () => {

    loading.value = true
    let quantity = parseFloat(amount.value).toFixed(4) + " " + props.wallet.symbol
    

    try {
      const rootChain = chains.getRootChain()
      const api = rootChain.getEosPassInstance(userStore.authData?.wif as string)

      await api.transact(
        {
          actions: [
            {
              account: props.wallet.contract,
              name: 'transfer',
              authorization: [
                {
                  actor: userStore.username as string,
                  permission: 'active',
                },
              ],
              data: {
                from: userStore.username,
                to: config.tableCodeConfig.withdrawer,
                quantity: quantity,
                memo: address.value
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
        message: `Заявка на вывод создана`,
        color: 'positive',
      })
      loading.value = false
      emit('withdrawFinish')      
      
    } catch (e: any) {
      
      Notify.create({
        message: e.message,
        color: 'negative',
      })
    }

    loading.value = false
}

</script>