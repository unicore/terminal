<template lang="pug">
div.q-pt-lg
  div(v-if="loading").q-pa-md
    loader
  div(v-else)
    .q-pa-md
      div(v-if="!showMore")
        q-input(
          v-model.trim="query"
          filled
          label-color="teal"
          label="введите имя аккаунта / id транзакции / номер блока"
          color="teal"
          @keypress.enter="preSearch()"
        ).q-pb-md
          template(v-slot:prepend)
            q-icon(name="search")
        // h6 Обозреватель блоков {{rootChain.name}}
        .row.q-col-gutter-sm
          .col-md-3.col-xs-6(
            v-for="status in chainMainStatus",
            :key="status.title"
          )
            q-card(flat bordered).full-width
              q-card-section
                .text-h6 {{status.value}}
                .text-subtitle2 {{status.title}}
        // Search
      div(v-else)
      .bg-gre
        div
          AccountResult(
            v-if="mode === 'account'"
            :account-data="accountData"
            :account-creator="accountCreator"
            :key="`search-account-${n}`"
          )
          TxResult(
            v-else-if="mode === 'tx'"
            :data="txData"
            :key="`search-tx-${n}`"
          )
          BlockResult(
            v-else-if="mode === 'block'"
            :data="blockData"
            :key="`search-block-${n}`"
          )
          BlockchainActions(
            v-else
            :key="`blockchain-actions-${n}`"
          )
</template>

<script setup lang="ts">


import { ref, computed, watch, onMounted, onUnmounted, onBeforeUnmount } from 'vue';

import { makeKb, makeMb, percentString } from './utils'//
import Chains from '~/chainsMain'
const rootChain = Chains.getRootChain()
import { useBlockchainStore } from '~/stores/blockchain'

let api = ref(null);
let loadMemCpuTimer = ref(null);
let eosStatus = ref({});
const query = ref('')
const mode = ref('')
const accountData = ref(null)
const accountCreator = ref(null)
const txData = ref(null)
const blockData = ref(null)
const n = ref(0)
const loading = ref(true)

import AccountResult from './AccountResult.vue'
import TxResult from './TxResult.vue'
import BlockResult from './BlockResult.vue'
import BlockchainActions from './BlockchainActions.vue'
import loader from '~/components/common/loader.vue'

import { useRouter, useRoute } from 'vue-router'
const router = useRouter()
const route = useRoute()

// const data = await rootChain.readApi.getKeyAccounts(account.pub)
const bcStore = useBlockchainStore()

const chainRamSize = computed(() => Number(eosStatus.value.max_ram_size));
const ramBought = computed(() => Number(eosStatus.value.total_ram_bytes_reserved));
const ramFree = computed(() => chainRamSize.value - ramBought.value);
const showMore = computed(() => route.params.search)

const chainMainStatus = computed(() => [
  { title: 'Утвержденный блок', value: bcStore.getInfo.head_block_num },
  { title: 'Производитель', value: bcStore.getInfo.head_block_producer },
  { title: 'Нагрузка CPU', value: percentString(bcStore.getInfo.block_cpu_limit, eosStatus.value.max_block_cpu_usage, true)},
  { title: 'Нагрузка NET', value: percentString(bcStore.getInfo.block_net_limit, eosStatus.value.max_transaction_net_usage, true) },
  { title: 'RAM сети', value: makeMb(chainRamSize.value) },
  { title: 'RAM куплено', value: makeMb(ramBought.value) },
  { title: 'RAM свободно', value: makeMb(ramFree.value) },
  { title: 'Используется RAM', value: percentString(ramBought.value, chainRamSize.value) }
]);


onMounted(async () => {
  await loadMemCpuInfo()

  if (route.params.search)
    search(route.params.search, route.params.force)

  loading.value = false
})


const clear = () => {
  mode.value = ''
  query.value = ''
  accountData.value = null
  accountCreator.value = null
  txData.value = null
  blockData.value = null
  n.value++
}

const preSearch = () => {
  router.push({name: 'explorer', params: {search: query.value}})
}

const search = async (forcedValue?: string, forcedMode?: string) => {
  if (forcedValue) {
    query.value = forcedValue
  }

  if (query.value === '') {
    clear()
    return
  }

  let searchMode = ''

  if (forcedMode) {
    searchMode = forcedMode
  } else if (/(^[a-z1-5.]{1,11}[a-z1-5]$)|(^[a-z1-5.]{12}[a-j1-5]$)/.test(query.value)) {
    searchMode = 'account'
  } else if (/(^\d{1,13}$)/.test(query.value)) {
    searchMode = 'block'
  } else if (query.value.length === 64) {
    searchMode = 'tx'
  }

  if (!searchMode) {
    // notification logic here...
    return
  }
  
  if (searchMode === 'account') {
    const accountName = query.value
    accountData.value  = await rootChain.explorer.get('v2/state/get_account', { account: accountName }).catch(() => ({ data: null }))
    const { data: accountCreatorResult } = await rootChain.explorer.get('v2/history/get_creator', { account: accountName }).catch(() => ({ data: null }))
    
    accountCreator.value = accountCreatorResult
    
    if (!accountData.value && /(^\d{1,13}$)/.test(query.value)) {
      searchMode = 'block'
    }
  }

  if (searchMode === 'tx') {
    const txid = query.value
    txData.value = await rootChain.explorer.get('v2/history/get_transaction', { id: txid }).catch(() => ({ data: null }))

  }

  if (searchMode === 'block') {
    const block = query.value
    blockData.value = await bcStore.getBlock(block).catch(() => null)
  }

  if (searchMode !== 'account') {
    accountData.value = null
    accountCreator.value = null
  }

  if (searchMode !== 'tx') {
    txData.value = null
  }

  if (searchMode !== 'block') {
    blockData.value = null
  }

  mode.value = searchMode
  n.value++
}

// onMounted(async () => {
//   await loadMemCpuInfo()
//   on('explorer:search', search)
//   loading.value = false
// })

// onBeforeUnmount(() => {
//   off('explorer:search', search)
// })


// onUnmounted(() => {
//   clearInterval(loadMemCpuTimer.value);
// });

async function loadMemCpuInfo() {
  const { rows: [data] } = await rootChain.readApi.getTableRows('eosio', 'eosio', 'global');
  eosStatus.value = data;
}


   
watch(() => route.params, (newParams, oldParams) => {
  
  if (newParams.search)
    search(newParams.search, newParams.force)
  else clear()
  // ваш код обработки изменений параметра маршрута
}, { deep: true })

watch(() => route.path, (newPath, oldPath) => {
  
  // ваш код обработки изменений маршрута
})

</script>
