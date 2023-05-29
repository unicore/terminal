<template lang="pug">

q-btn(color="teal" size="lg" @click="dialog=true") Купить токен

  q-dialog(v-model="dialog" persistent :maximized="false" transition-show="slide-up" transition-hide="slide-down")
    q-card(style="min-width: 350px; max-width: 450px;")
      div
        q-bar
          q-space
          q-btn(dense flat icon="close" v-close-popup)
            q-tooltip Закрыть

      q-card(v-if="host")
        q-card-section
          div.text-h6 Покупка токена за USDT
        q-card-section
          div.text-subtitle2 Стоимость токена: {{ quantCost }}
          div.text-subtitle2 Осталось токенов: {{ remainQuants }}
        q-card-section
          q-input(outlined v-model.number="quantAmount" label="Введите количество токенов" type="number" step="1")
        
        q-card-section
          q-input(outlined v-model.number="rootAmount" label="Введите сумму в USDT" type="number" step="1")
        
        // q-card-section
        //   q-input(outlined v-model="message"  type="textarea" rows="3" label="Введите сообщение (опционально)")
          // textarea(rows="5" v-model="message" )

        q-card-section(align="right")
          q-btn(flat label="Отмена" color="primary" v-close-popup)
          q-btn(label="Купить" color="primary" @click="buy") 

</template>

<script setup lang="ts">
import { useHostStore } from '~/stores/host'
import { onMounted, ref, computed, watch} from 'vue'
const hostStore = useHostStore()

import chains from '~/chainsMain'
import config from '~/config'
import { useUserStore } from '~/stores/user'
import { Notify } from 'quasar';

const props = defineProps({
  hostname: {
    type: String,
    required: true,
  },
})

let message = ref("")

let host = computed(() => {
  return hostStore.getCurrentHost(props.hostname)
})

const rootAmount = ref(0);
let quantAmount = ref(0);


onMounted(async () => {
  // await hostStore.loadHosts()
  hostStore.getCurrentHost(props.hostname)
  quantAmount.value = 1
})

const dialog = ref(false);

const quantCost = computed(() => {
  const cost = host.value.currentPool.quant_cost;
  return cost;
});

const remainQuants = computed(() => {
  const remain = host.value.currentPool.remain_quants / 1000000;
  return remain;
});

watch(rootAmount, (newVal) => {
  const cost = parseFloat(host.value.currentPool.quant_cost);
  quantAmount.value = newVal / cost;
});

watch(quantAmount, (newVal) => {
  const cost = parseFloat(host.value.currentPool.quant_cost);
  rootAmount.value = newVal * cost;
});


watch(host, (newVal) => {
  if (newVal == false){
    quantAmount.value = 1
  }
})

const purchasedQuants = computed({
  get: () => quantAmount.value / 1000000,
  set: (value) => {
    const cost = parseFloat(host.value.currentPool.quant_cost);
    rootAmount.value = value * cost;
    quantAmount.value = value;
  }
});

const buy = async () => {
  // Здесь можно выполнить фиктивную отправку транзакции в блокчейн
  let amount = rootAmount.value
  
  dialog.value = false;

  const userStore = useUserStore()

  try {
      const rootChain = chains.getRootChain()
      const api = rootChain.getEosPassInstance(userStore.authData?.wif as string)
      let data = {
        from: userStore.username as string,
        to: config.tableCodeConfig.core,
        quantity: parseFloat(amount).toFixed(host.value.precision) + ` ${host.value.symbol}`,
        memo: '100-' + host.value.username + '-' + message.value
      }
    
      await api.transact(
        {
          actions: [
            {
              account: host.value.root_token_contract,
              name: 'transfer',
              authorization: [
                {
                  actor: userStore.username as string,
                  permission: 'active',
                },
              ],
              data: data,
            },
          ],
        },
        {
          blocksBehind: 3,
          expireSeconds: 30,
        }
      )
      hostStore.loadHosts(userStore.username, props.hostname)
      hostStore.loadBalances(userStore.username, props.hostname)
      hostStore.loadHistory(props.hostname)

      // host.value = hostStore.getCurrentHost(props.hostname)
      
      Notify.create({
        message: `Транзакция принята успешно.`,
        color: 'positive',
      })
      
    } catch (e: any) {

      console.error(e)
     
      Notify.create({
        message: e.message,
        color: 'negative',
      })
      
    }

};
</script>

<style scoped lang="scss">
  
</style>
