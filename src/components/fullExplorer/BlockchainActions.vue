<template lang="pug">
div
  h2 История действий в блокчейне
  q-markup-table(flat)
    thead
      tr
        th ID транзакции
        th Дата и время
        th Действие
        th.text-left Данные
    tbody
      tr(v-for="act in rows" :key="act.k")
        td.text-center
          TxLink(:txid="act.transaction_id")
            | {{act.transaction_id.substring(0, 12)}}
        td.text-center {{act.datetime}}
        td.text-center
          ActionCell(:action-data="act")
        td
          DataCell(:action-data="act.data" :action="act.action")
</template>
<script setup lang="ts">

import { ref, onMounted, onBeforeUnmount } from 'vue'
import moment from 'moment-with-locales-es6';
import DataCell from './DataCell.vue'
import ActionCell from './ActionCell.vue'
import TxLink from './TxLink.vue'
import chains from '~/chainsMain'


let timer = null
const loading = ref(false)
const rows = ref([])

onMounted(async () => {
  await loadPage()
})

onBeforeUnmount(() => {
  clearTimeout(timer)
})

const pagination = ref({
  page: 1,
  rowsPerPage: 32,
  rowsNumber: 0,
})


const loadPage = async () => {
    if (loading.value) {
      return
    }
    loading.value = true
    const rootChain = chains.getRootChain()
    const explorer = rootChain.explorer
    const data = await explorer
      .getHistoryActions(
        null,
        32,
        0,
        true,
        true
      )
      .catch(() => ({ data: null }))

    if (data) {
      pagination.value = {
        ...pagination.value,
        rowsNumber: data.total.value,
      }
      rows.value = data.simple_actions.map((r: any, i: number) => ({
        ...r,
        k: `${i}-${r.action}-${r.transaction_id}-${r.contract}`,
        datetime: moment(r.timestamp).format('DD.MM.YY HH:mm:ss')
      }))
    }
    loading.value = false
  }

// const loadPage = async () => {
//   loading.value = true

//   const rootChain = chains.getRootChain()
//   const explorer = rootChain.explorer
//   const { data } = await explorer
    // .getHistoryActions(
    //   null,
    //   32,
    //   0,
    //   true,
    //   true
    // )
//     .catch(() => ({ data: null })) // TODO: нормальная обработка ошибок



//   if (data) {
//     rows.value = data.simple_actions.map((r, i) => ({
//       ...r,
//       k: `${i}-${r.action}-${r.transaction_id}-${r.contract}`,
//       datetime: moment(r.timestamp).format('DD.MM.YY HH:mm:ss')
//     }))
//   }
//   loading.value = false

//   timer = setTimeout(() => {
//     loadPage()
//   }, 4000)
// }
</script>