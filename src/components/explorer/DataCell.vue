<template lang="pug">
div
  div(v-if="props.action === 'transfer'")
    AccountLink(:account-name="actionData.from") →
    AccountLink(:account-name="actionData.to") {{ ' ' }}{{ actionData.quantity }}
  div(v-else)
    q-btn(@click="dialog=true" flat ) ...
    // 
      
  q-dialog(v-model="dialog" persistent :maximized="false" transition-show="slide-up" transition-hide="slide-down")
    q-card(style="min-width: 350px; max-width: 350px;")
      div()
        q-bar
          span Транзакция
          q-space
          q-btn(dense flat icon="close" v-close-popup)
            q-tooltip Close

        div.q-pa-sm
          ul
            li(v-for="row in dataParams" :key="row.key" style="    word-wrap: break-word;").q-mt-md
              strong.q-mr-xs {{ row.key }}:
              AccountLink(v-if="row.isAccount" :account-name="row.value")
              span(v-else) {{ row.value }}

        q-btn(@click="dialog=false").full-width закрыть

</template>

<script setup lang="ts">
  import { computed,ref } from 'vue'

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

  const dialog = ref(false)

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
