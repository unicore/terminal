<template lang="pug">

q-btn(color="teal" size="md" @click="dialog=true") Заложить {{host.symbol}}
  
  q-dialog(v-model="dialog" persistent :maximized="false" transition-show="slide-up" transition-hide="slide-down")
    q-card(style="min-width: 350px; max-width: 450px;")
      div
        q-bar
          p совершить взнос
          q-space
          q-btn(dense flat icon="close" v-close-popup)
            q-tooltip Закрыть

      q-card(v-if="host")
        q-card-section
          
          p(style="font-size: 22px;") Введите сумму в {{host.symbol}}
          // q-card-section
            // div.text-subtitle2 Стоимость токена: {{ quantCost }}
            // div.text-subtitle2 Осталось токенов: {{ remainQuants }}
            // div.text-subtitle2 Доступно для внесения: {{ remain }}
          // q-card-section
          //   q-input(outlined v-model.number="quantAmount" label="Введите количество токенов" type="number" step="1")
          
        q-card-section  
          // span Введите сумму для внесения в целевую программу. 
          p(style="font-size: 12px;").text-grey ваш баланс: {{userBalance}}
          div(v-if="hasMin")
            q-input(outlined v-model.number="rootAmount" :step="0.0001" label="Введите сумму" type="number" step="1")
              template(v-slot:append)
                q-badge() {{host.symbol}}
            q-slider(track-size="10px" :max="parseFloat(max)" color="teal" v-model="rootAmount" ).q-pa-xs
    

            div.row.justify-between
              q-btn(size="xs" flat @click="setMin") min: {{quantCost}}
              q-btn(size="xs" flat @click="setMax") max: {{max}}
          div(v-else).q-mt-lg.full-width.text-center
            q-btn(outline color="teal" @click="gotowallet") пополнить баланс
        // q-card-section
        //   q-input(outlined v-model="message"  type="textarea" rows="1" label="Оставьте сообщение")

          // textarea(rows="5" v-model="message" )

        q-card-section(v-if="hasMin" align="right")
          q-btn(flat label="Отмена" color="primary" v-close-popup)
          q-btn(label="Внести" color="primary" @click="buy") 

</template>

<script setup lang="ts">
import { useHostStore } from '~/stores/host'
import { onMounted, ref, computed, watch} from 'vue'
const hostStore = useHostStore()

import chains from '~/chainsMain'
import config from '~/config'
import { useUserStore } from '~/stores/user'
import { Notify } from 'quasar';
const userStore = useUserStore()

import { useRouter } from 'vue-router'
const router = useRouter()

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

const setMax = () => {
  rootAmount.value = parseFloat(max.value)
}

const gotowallet = () => {
  router.push({name: 'wallet'})
}

const setMin = () => {
  rootAmount.value = parseFloat(quantCost.value)
}

onMounted(async () => {
  // await hostStore.loadHost(props.hostname)
  hostStore.getCurrentHost(props.hostname)
  quantAmount.value = 1
})

const dialog = ref(false);

const hasMin = computed(() => {
  return (parseFloat(userBalance.value) > 0)
})

const max = computed(() => {
  if (parseFloat(remain.value) <= parseFloat(userBalance.value))
    return remain.value
  else return userBalance.value
})

const quantCost = computed(() => {
  const cost = host.value.currentPool.quant_cost;
  return cost;
});

const remainQuants = computed(() => {
  const remain = host.value.currentPool.remain_quants / 1000000;
  return remain;
});

const userBalance = computed(() => {
  return userStore.userBalancesSafe[host.value.symbol]
})

const remain = computed(() => {
  const remain = host.value.currentPool.remain
  return remain;
});

watch(rootAmount, (newVal, oldVal) => {
  if (newVal != oldVal){
    const cost = parseFloat(host.value.currentPool.quant_cost);
    quantAmount.value = newVal / cost;
  }
});

watch(quantAmount, (newVal, oldVal) => {
  if (newVal != oldVal){
    const cost = parseFloat(host.value.currentPool.quant_cost);
    rootAmount.value = newVal * cost;
  }
});


watch(host, (newVal, oldVal) => {
  if (newVal.current_pool_id != oldVal.current_pool_id)
    quantAmount.value = 1
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

  

  try {
      
      const rootChain = chains.getRootChain()
      const api = rootChain.getEosPassInstance(userStore.authData?.wif as string)
      let data = {
        from: userStore.username as string,
        to: config.tableCodeConfig.core,
        quantity: parseFloat(amount).toFixed(host.value.precision) + ` ${host.value.symbol}`,
        memo: '100-' + host.value.username + '-' + message.value
      }
      
      console.log("data", data)
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
      hostStore.loadHost(props.hostname)
      hostStore.loadBalances(userStore.username, props.hostname)
      hostStore.loadHistory(props.hostname)
      userStore.getUserBalances()
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
