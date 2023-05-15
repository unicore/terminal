<template lang="pug">
div
  .text-center(
    v-if="!accountData"
  ) нет результатов
  div(v-else)
    h2 Аккаунт
      | {{" "}}
      span.text-weight-bold {{accountData.account.account_name}}
      .text-subtitle1(v-if="creatorName") создан
        | {{" "}}
        AccountLink(:account-name="creatorName")
        | {{" "}}
        | {{creationTime}}
    .row.q-col-gutter-sm
      .col.col-xs-6.col-md-3(
        v-for="card in cards",
        :key="card.title"
      )
        q-card(flat bordered).full-width.full-height
          q-card-section
            q-knob(
              disable
              v-model="card.value"
              show-value
              size="90px"
              :thickness="0.22"
              color="primary"
              track-color="grey-3"
              class="q-ma-md"
              v-if="card.type === 'knob'"
            )
            q-linear-progress(
              disable
              :value="card.value"
              show-value
              size="32px"
              color="primary"
              track-color="teal"
              v-else-if="card.type === 'progress'"
            )
              .absolute-full.flex.flex-center
                q-badge(
                  color="white"
                  text-color="primary"
                  :label="card.label"
                )
            .text-h6(v-else) {{card.value}}
            .p {{card.title}}
            .text-subtitle1(v-if="card.subtitle") {{card.subtitle}}
    q-card.full-width.q-mt-lg
      ActionsByAccount(:account-name="accountData.account.account_name")
      
</template>


<script setup lang="ts">
import { ref, computed } from 'vue'
import { formatBytes, formatUs } from './utils'
import AccountLink from './AccountLink.vue'
import { moment } from 'moment'
import ActionsByAccount from './ActionsByAccount.vue'
import TokensByAccount from './TokensByAccount.vue'


const props = defineProps({
  accountData: Object,
  accountCreator: Object
})

const tab = ref('actions')

const progressCard = (title, subtitle, usage, quota) => ({
  title,
  subtitle,
  value: usage / quota,
  usage,
  quota,
  label: `${Math.round(usage / quota * 10000) / 100} %`,
  type: 'progress'
})

const formattedSubtitleProgressCard = (title, formatter, usage, quota) => progressCard(
  title,
  `${formatter(usage)} / ${formatter(quota)}`,
  usage,
  quota
)

const kbProgressCard = (title, usage, quota) => formattedSubtitleProgressCard(title, formatBytes, usage, quota)

const usProgressCard = (title, usage, quota) => formattedSubtitleProgressCard(title, formatUs, usage, quota)

const cards = computed(() => [
  {
    title: 'Ликвидный баланс',
    value: props.accountData.account.core_liquid_balance,
    type: 'text'
  },
  kbProgressCard('RAM', props.accountData.account.ram_usage, props.accountData.account.ram_quota),
  kbProgressCard('NET', props.accountData.account.net_limit.used, props.accountData.account.net_limit.max),
  usProgressCard('CPU', props.accountData.account.cpu_limit.used, props.accountData.account.cpu_limit.max)
])

const creatorName = computed(() => props.accountCreator && props.accountCreator.creator)

const creationTime = computed(() => props.accountCreator && moment(props.accountCreator.timestamp).format('DD.MM.YY'))
</script>
