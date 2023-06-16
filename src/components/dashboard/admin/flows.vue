<template lang="pug">
div
  q-btn(color="secondary" @click="save").full-width сохранить
  q-card(bordered flat).q-pa-md
    
    
    div.flex.justify-between.q-pa-xs
      span Ваша прибыль, {{dacs_percent}} %
      
      span {{100 - dacs_percent}}%, Прибыль партнёров

    q-slider(track-size="10px" :max="max_for_dacs_percent" color="teal" v-model="dacs_percent" ).q-pa-xs
    div
      q-table(
        square
        
        flat
        :rows="tableData"
        :columns="columns"
        dense
        row-key="pool_id"
        :pagination={rowsPerPage: 0}
        :no-data-label="'нет данных'"
      ).text-center.full-width     
       
        template(v-slot:body-cell-pool_id="props")
          q-td(:props="props")
            span {{props.row.pool_id + 1}}
              
    
  
</template>

<script setup lang="ts">

import { computed, ref, onMounted, watch} from 'vue'
import { useUserStore } from '~/stores/user'
import { useHostStore } from '~/stores/host'
import { useRouter } from 'vue-router'
import userBalance from '~/components/core/oneUserBalance.vue'
import config from '~/config'
import chains from '~/chainsMain'
import {Notify} from 'quasar'

const router = useRouter()
const loading = ref(false)
const hostStore = useHostStore()
const userStore = useUserStore()

const dacs_percent = ref(50)
const cfund_percent = ref(0)
const hfund_percent = ref(0)
const ref_percent = ref(50)


const incomes = computed(() => Object.values(hostStore.incomes))


const columns = ref([
      // { name: 'quant_buy_rate', label: 'Курс продаж', field: 'quant_buy_rate', align: 'center' },
      // { name: 'quant_sell_rate', label: 'Курс выкупа', field: 'quant_sell_rate', align: 'center' },
      { name: 'pool_id', label: 'Раунд', field: 'pool_id', align: 'center' },
      
      { name: 'total_in_box', label: 'Всего продаж', field: 'total_in_box', align: 'center' },
      { name: 'system_income', label: 'Бизнес-доход', field: 'system_income', align: 'center' },
      
      { name: 'ref_income', label: 'Партнёрам', field: 'ref_income', align: 'center' },
      { name: 'dacs_income', label: 'Предпринимателю', field: 'dacs_income', align: 'center' },
      
      // { name: 'live_balance_for_sale', label: 'Живые продажи', field: 'live_balance_for_sale', align: 'center' },
      
      
  ])

const rates = computed(() => {
  if (props.ratesExt)
    return props.ratesExt.value
  else return Object.values(hostStore.rates)
})

watch(dacs_percent, (newValue) => {
  ref_percent.value = 100 - newValue
})

const host = computed(() => hostStore.getCurrentHost(config.coreHost))

const symbol = computed(() => {
  if (props.symbolExt)
    return props.symbolExt.value
  else return host.value?.symbol
})

const precision = computed(() => {
  if (props.precisionExt)
    return props.precisionExt.value
  else return host.value?.precision
})


watch(host, (newValue) => {
  ref_percent.value = host.value?.referral_percent / 10000
  dacs_percent.value = host.value?.dacs_percent / 10000
})


const props = defineProps({
    precisionExt: {
      type: Number,
      required: false,
    },
    ratesExt: {
      type: Array,
      required: false
    },
    symbolExt: {
      type: String,
      required: false
    },
    isExt: {
      type: Boolean,
      required: false
    }
  })

const emit = defineEmits(['finish'])

const save = async () => {
  if (props.isExt?.value){
    emit('finish')
  } else {

    loading.value = true
    
    try {
      const rootChain = chains.getRootChain()
      const api = rootChain.getEosPassInstance(userStore.authData?.wif as string)

      await api.transact(
        {
          actions: [
            {
              account: config.tableCodeConfig.core,
              name: 'setflows',
              authorization: [
                {
                  actor: userStore.username as string,
                  permission: 'active',
                },
              ],//(eosio::name host, uint64_t ref_percent, uint64_t dacs_percent, uint64_t cfund_percent, uint64_t hfund_percent){
              data: {
                host: host.value.username,
                ref_percent: ref_percent.value * 10000,
                dacs_percent: dacs_percent.value * 10000,
                cfund_percent: cfund_percent.value * 10000,
                hfund_percent: hfund_percent.value * 10000,
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
        message: `Распределение обновлено.`,
        color: 'positive',
      })
      loading.value = false

  
      
    } catch (e: any) {
      
      Notify.create({
        message: e.message,
        color: 'negative',
      })
    }

    loading.value = false
  }
    
}



const sysPercents = computed(() => {
  return hostStore.sysPercents
})

// const percents = computed(() => {
//     return {
//       referral_percent: 100 * 10000 - dacs_percent?.value * 10000,
//       dacs_percent: dacs_percent.value * 10000,
//       hfund_percent: 0, 
//       cfund_percent: 0,
//     }
//   })

const tableData = computed(() => {
  let rts = JSON.parse(JSON.stringify(rates.value))

  rts.map((el, index) => {
    let local_sys_income_float = parseFloat(el.system_income)
    let global_system_income_float = local_sys_income_float * sysPercents.value.system / 100
    el.global_system_income = (global_system_income_float).toFixed(precision.value) + ' ' + symbol.value
    let local_system_income_float = local_sys_income_float - global_system_income_float
    
    el.system_income = (local_system_income_float).toFixed(precision.value) + ' ' + symbol.value
    el.ref_income = (local_system_income_float * ref_percent.value / 100).toFixed(precision.value) + ' ' + symbol.value
    el.dacs_income = (local_system_income_float * dacs_percent.value / 100).toFixed(precision.value) + ' ' + symbol.value
    el.hfund_income = (local_system_income_float * hfund_percent.value / 100).toFixed(precision.value) + ' ' + symbol.value
    el.cfund_income = (local_system_income_float * cfund_percent.value / 100).toFixed(precision.value) + ' ' +symbol.value
  })



  return rts
})

const max_for_dacs_percent = computed(() => {
    return host.value?.dacs_percent / 10000 + host.value?.referral_percent / 10000
    // if ((100 - this.ref_percent - this.сfund_percent - this.hfund_percent) >= 0)
    //   return 100 - this.ref_percent - this.сfund_percent - this.hfund_percent
    // else return 0
})

onMounted(async () => {
  await hostStore.loadHost(config.coreHost)
  await hostStore.loadGpercents()
  await hostStore.loadRates(config.coreHost)
})

</script>
