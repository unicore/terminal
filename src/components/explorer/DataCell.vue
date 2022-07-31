<template>
  <div v-if="props.action === 'transfer'">
    <AccountLink :account-name="actionData.from"></AccountLink>{{ ' → ' }}
    <AccountLink :account-name="actionData.to"></AccountLink>{{ ' ' }}{{ actionData.quantity }}
  </div>
  <div v-else>
    <ul class="q-pl-md">
      <li v-for="row in dataParams" :key="row.key">
        <strong>{{ row.key }}:</strong>{{ ' ' }}
        <AccountLink v-if="row.isAccount" :account-name="row.value"></AccountLink>
        <template v-else>{{ row.value }}</template>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue'

  import AccountLink from './AccountLink.vue'

  const ACCOUNT_FIELDS: any = {
    from: 1,
    to: 1,
    owner: 1,
    payer: 1,
    receiver: 1,
    creator: 1,
    user_name: 1,
    account: 1,
    host: 1,
    root_contract: 1,
    notified: 1,
    contract: 1,
    username: 1,
  }
  const isAccount = (s: string) => /(^[a-z1-5.]{1,11}[a-z1-5]$)|(^[a-z1-5.]{12}[a-j1-5]$)/.test(s)

  const props = defineProps<{
    actionData: any
    action: string
  }>()

  const dataParams = computed(() =>
    Object.keys(props.actionData).map((key: string) => ({
      key,
      value: props.actionData[key],
      isAccount: !!ACCOUNT_FIELDS[key] && isAccount(props.actionData[key]),
    }))
  )
</script>

<style lang="scss" scoped></style>
