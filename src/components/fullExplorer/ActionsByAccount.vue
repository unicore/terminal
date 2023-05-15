<template lang="pug">
div(style="border: 1px solid grey;")
  q-table(
    :loading="loading"
    title="Действия аккаунта"
    :rows="rows"
    :columns="columns"
    row-key="k"
    :pagination.sync="pagination"
    @request="changePageFromTable"
  )
    template(v-slot:body-cell-transaction_id="props")
      q-td(:props="props")
        TxLink(:txid="props.row.transaction_id")
          | {{'#' + props.row.transaction_id.substring(0, 10)}}
    template(v-slot:body-cell-data="props")
      q-td(:props="props")
        DataCell(:action-data="props.value" :action="props.row.action")
    template(v-slot:body-cell-action="props")
      q-td(:props="props")
        ActionCell(:action-data="props.value" :account="accountName")
</template>

<script setup>//
import { ref, computed, watch, reactive, toRefs, nextTick } from 'vue'
import moment from 'moment'
import DataCell from './DataCell.vue'
import ActionCell from './ActionCell.vue'
import TxLink from './TxLink.vue'
import Chains from '~/chainsMain'

const props = defineProps(['accountName'])

const state = reactive({
  loading: false,
  rows: [],
  columns: [
    {
      name: 'transaction_id',
      required: true,
      label: 'ID транзакции',
      align: 'left',
      field: row => row.transaction_id
    },
    {
      name: 'timestamp',
      required: true,
      label: 'Дата и время',
      align: 'left',
      field: row => moment(row.timestamp).format('DD.MM.YY HH:mm:ss')
    },
    {
      name: 'action',
      required: true,
      label: 'Действие',
      align: 'left',
      field: row => row
    },
    {
      name: 'data',
      required: true,
      label: 'Данные',
      align: 'left',
      field: row => row.data
    },
    {
      name: 'memo',
      required: true,
      label: 'Памятка',
      align: 'right',
      field: row => row.data.memo
    }
  ],
  pagination: {
    page: 1,
    rowsPerPage: 25,
    rowsNumber: 0
  }
})

const { loading, rows, columns, pagination } = toRefs(state)

const page = computed(() => pagination.value.page)

const changePageFromTable = (e) => {
  if (e && e.pagination) {
    pagination.value = e.pagination
    loadPage()
  }
}
const loadPage = async () => {
  if (loading.value) {
    return
  }
  loading.value = true

  const rootChain = Chains.getRootChain()
  const explorer = rootChain.explorer
  const data = await explorer
    .getHistoryActions(
      props.accountName,
      pagination.value.rowsPerPage,
      pagination.value.rowsPerPage * (pagination.value.page - 1),
      true,
      true
    )
    .catch(() => ({ data: null })) // TODO: нормальная обработка ошибок

  if (data) {
    pagination.value = {
      ...pagination.value,
      rowsNumber: data.total.value
    }

    rows.value = []
    await nextTick()
    rows.value = data.simple_actions.map((r, i) => ({ ...r, k: `${i}-${r.action}-${r.transaction_id}-${r.contract}` }))
    
  }
  loading.value = false
}

watch([() => props.accountName, () => pagination.value.page], loadPage, { immediate: true })


</script>