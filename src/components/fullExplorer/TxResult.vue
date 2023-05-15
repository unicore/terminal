<template lang="pug">
div
  div
    .text-center(
      v-if="!data"
    ) нет результатов
    template(v-else)
      q-card(flat style="word-break: break-all" bordered).q-pa-md.q-mb-md
        h2.q-mb-xs Транзакция
        span.text-weight-bold {{data.trx_id}}
        q-separator().q-mt-md.q-mb-md
        .row.q-col-gutter-sm
          .col-xs-12.col.col-md-6
            q-markup-table(dark bordered).bg-primary
              thead
                tr
                  th(colspan="2") Общая информация
              tbody
                tr
                  td.text-left Номер блока
                  td.text-left
                    BlockLink(:number="blockNumber")
                tr
                  td.text-left Время блока
                  td.text-left {{blockTime}}
                tr
                  td.text-left Статус
                  td(v-if="executed").text-left
                    q-badge(color="green") Выполнено
                  td(v-else).text-left
                    q-badge(color="orange") Не выполнено
          .col-xs-12.col.col-md-6
            q-markup-table(dark bordered).bg-primary
              thead
                tr
                  th(colspan="2") Дополнительная информация
              tbody
                tr
                  td.text-left Использование CPU
                  td.text-left {{cpuTime}}
                tr
                  td.text-left Использование NET
                  td.text-left {{netUsage}}
                tr
                  td.text-left Количество действий
                  td.text-left {{data.actions.length}}
      q-card(flat bordered).q-pa-md.q-mb-md
        h2.q-mb-xs Действия
        q-markup-table()
          thead
            tr
              th Контракт
              th Название
              th Авторизации
              th Данные
          tbody
            tr(v-for="action in data.actions")
              td.text-left
                AccountLink(:account-name="action.act.account")
              td.text-left {{action.act.name}}
              td.text-left
                ul.q-pl-md
                  li(v-for="auth in action.act.authorization")
                    q-badge(color="blue") {{auth.actor}}
                    q-badge(color="indigo-10") {{auth.permission}}
              td.lext-left
                DataCell(:action="action.act.name" :actionData="action.act.data")
</template>
<script setup lang="ts">
import { computed } from 'vue'
import moment from 'moment'
import AccountLink from './AccountLink.vue'
import DataCell from './DataCell.vue'
import BlockLink from './BlockLink.vue'
import { formatBytes, formatUs } from './utils'

const props = defineProps({
  data: Object
})

const firstAction = computed(() => {
  if (!props.data || !props.data.actions || props.data.actions.length === 0) {
    return {}
  }

  const a = props.data.actions.find(x => x.cpu_usage_us && x.net_usage_words)

  if (a) {
    return a
  }

  return props.data.actions[0]
})

const blockNumber = computed(() => firstAction.value.block_num)

const blockTime = computed(() => moment(firstAction.value.timestamp).format('DD.MM.YYYY HH:mm:ss'))

const executed = computed(() => props.data.executed)

const cpuTime = computed(() => formatUs(firstAction.value.cpu_usage_us))

const netUsage = computed(() => formatBytes((firstAction.value.net_usage_words * 8) || 0))
</script>
