<template lang="pug">
div
  .text-center(
    v-if="!props.data"
  ) нет результатов
  template(v-else)
    q-card(flat bordered).q-pa-md.q-mb-md
      h2.q-mb-xs Блок {{props.data.block_num}}
      q-separator().q-mt-md.q-mb-md
      .row.q-col-gutter-sm
        .col-md-6.col-xs-12
          q-markup-table(flat bordered).bg-primary.text-white
            thead
              tr
                th(colspan="2") Общая информация
            tbody
              tr
                td.text-left Высота блока
                td.text-left {{props.data.block_num}}
              tr
                td.text-left Дата и время блока
                td.text-left {{blockTime}}
              tr
                td.text-left Имя производителя
                td.text-left
                  // p {{props.data.producer}}
                  AccountLink(:account-name="props.data.producer")
              tr
                td.text-left Block ID
                td.text-left(style="white-space: normal;word-break: break-all") {{props.data.id}}
        .col-md-6.col-xs-12
          q-markup-table(flat bordered).bg-primary.text-white
            thead
              tr
                th(colspan="2") Дополнительная информация
            tbody
              tr
                td.text-left Предыдущий блок
                td.text-left
                  BlockLink(:number="prevBlock")
              tr
                td.text-left Следующий блок
                td.text-left
                  BlockLink(:number="nextBlock")
              tr
                td.text-left Количество транзакций
                td.text-left {{props.data.transactions.length}}
    q-card(flat bordered).q-pa-md.q-mb-md
      h2.q-mb-xs Транзакции
      q-markup-table()
        thead
          tr
            th ID транзакции
            th Срок действия
            th Использование CPU
            th Использование NET
            th Количество действий
        tbody
          tr(v-for="tx in props.data.transactions" :key="tx.trx.id")
            td
              TxLink(:txid="tx.trx.id")
                | {{tx.trx.id.substring(0, 12)}}
            td {{tx.trx.transaction.expiration}}
            td {{formatUs(tx.cpu_usage_us)}}
            td {{formatBytes(tx.net_usage_words)}}
            td {{tx.trx.transaction.actions.length}}
</template>

<script setup lang="ts">//
import { ref, computed } from 'vue';
import moment from 'moment-with-locales-es6';
import AccountLink from './AccountLink.vue'
import BlockLink from './BlockLink.vue'
import TxLink from './TxLink.vue'
import { formatBytes, formatUs } from './utils'


const props = defineProps({
  data: Object,
})

const blockTime = computed(() => moment(props.data.timestamp).format('DD.MM.YYYY HH:mm:ss'))
const prevBlock = computed(() => props.data.block_num - 1)
const nextBlock = computed(() => props.data.block_num + 1)

const formatBytesMethod = (b: number) => formatBytes(b)
const formatUsMethod = (us: number) => formatUs(us)
</script>

