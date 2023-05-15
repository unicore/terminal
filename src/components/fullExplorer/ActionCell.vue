<template lang="pug">
div
  q-badge(:color="badgeColor" :class="badgeTextColor")
    template(v-if="contract") {{contract}} → {{actionName}}
    template(v-else) {{actionName}}
</template>


<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps({
  actionData: Object,
  account: String
})

const ACTION_TYPES = {
  OTHER: 'OTHER',
  BUYRAM: 'BUYRAM',
  STAKECPUNET: 'STAKECPUNET',
  SENDTOKEN: 'SENDTOKEN',
  RECEIVETOKEN: 'RECEIVETOKEN',
  RAMFEE: 'RAMFEE',
  NEWACCOUNT: 'NEWACCOUNT'
}

const ACTION_NAMES = {
  [ACTION_TYPES.OTHER]: null,
  [ACTION_TYPES.BUYRAM]: 'Покупка RAM',
  [ACTION_TYPES.STAKECPUNET]: 'Ставка CPU/NET',
  [ACTION_TYPES.SENDTOKEN]: 'Отправка токенов',
  [ACTION_TYPES.RECEIVETOKEN]: 'Приём токенов',
  [ACTION_TYPES.RAMFEE]: 'Продажа RAM',
  [ACTION_TYPES.NEWACCOUNT]: 'Новый аккаунт'
}

const ACTION_BADGE_COLORS = {
  [ACTION_TYPES.OTHER]: 'white',
  [ACTION_TYPES.BUYRAM]: 'red',
  [ACTION_TYPES.STAKECPUNET]: 'blue',
  [ACTION_TYPES.SENDTOKEN]: 'red',
  [ACTION_TYPES.RECEIVETOKEN]: 'green',
  [ACTION_TYPES.RAMFEE]: 'red',
  [ACTION_TYPES.NEWACCOUNT]: 'teal'
}

const getActionContract = (row, actionName) => {
  const { contract, action } = row
  if (contract && ((contract !== 'eosio.token' && contract !== 'eosio') || action === actionName)) {
    return contract
  }
  return ''
}

const getActionType = (row, currentAccount) => {
  const { data } = row
  if (row.action === 'transfer') {
    if (data.from === currentAccount || !currentAccount) {
      if (data.to === 'eosio.ramfee') {
        return ACTION_TYPES.RAMFEE
      }
      return ACTION_TYPES.SENDTOKEN
    } else if (data.to === currentAccount) {
      return ACTION_TYPES.RECEIVETOKEN
    }
  } else if (row.action === 'delegatebw') {
    return ACTION_TYPES.STAKECPUNET
  } else if (row.action === 'buyram') {
    return ACTION_TYPES.BUYRAM
  } else if (row.action === 'newaccount') {
    return ACTION_TYPES.NEWACCOUNT
  }
  return ACTION_TYPES.OTHER
}

const getActionNameByType = (action, actionType) => {
  return ACTION_NAMES[actionType] || action
}

const actionType = computed(() => getActionType(props.actionData, props.account))
const actionName = computed(() => getActionNameByType(props.actionData.action, actionType.value))
const contract = computed(() => getActionContract(props.actionData, actionName.value))
const badgeColor = computed(() => ACTION_BADGE_COLORS[actionType.value] || ACTION_BADGE_COLORS.OTHER)
const badgeTextColor = computed(() => badgeColor.value === 'white' ? 'text-black' : '')
</script>

