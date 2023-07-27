<template lang="pug">
div.full-width
  div
    q-input(filled label="Введите адрес аккаунта:"  v-model="to")
    
    q-input(filled type="number" controls-position="right" v-model="amount" :precision="8" :step="0.0001" :min="0.0001" label="Введите сумму:") 
    q-input(filled label="Сообщение (не обязательно):"  v-model="memo")
    
  q-btn(color="primary" :loading="loading" type="success" @click="transfer").full-width Перевести
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


const loading = ref(false)
const amount = ref("")
const username = ref("")
const to = ref("")
const memo = ref("")
const transfer = async () => {

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
                to: to.value,
                quantity: quantity,
                memo: memo.value
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
        message: `Перевод осуществлён`,
        color: 'positive',
      })
      loading.value = false

      userStore.getUserBalances()
      
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