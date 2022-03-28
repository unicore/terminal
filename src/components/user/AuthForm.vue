<template>
  <form class="q-pa-md full-width" @submit.prevent="submit">
    <q-input
      v-model="privateKey"
      label="Приватный ключ"
      outlined
      class="full-width"
      autocorrect="off"
      autocapitalize="off"
      autocomplete="off"
      spellcheck="false" />

    <div class="row justify-end">
      <q-btn type="submit" label="Войти" class="q-mt-md" color="teal" :loading="loading" />
    </div>
  </form>
</template>

<script setup lang="ts">
  import { ref } from 'vue'
  import { makePublicKeyByMnemonic } from '~/uni-core/auth'
  import Chains from '~/chainsMain'

  const privateKey = ref('')
  const loading = ref(false)

  const submit = async () => {
    loading.value = true
    console.log(privateKey.value)
    try {
      const pub = await makePublicKeyByMnemonic(privateKey.value)
      console.log('public key', pub)
      const rootChain = Chains.getRootChain()
      const data = await rootChain.readApi.getKeyAccounts(pub)
      console.log('public key dta', data)
      const {
        account_names: [account],
      } = data
      console.log('account', account)
      const accountStats = await rootChain.readApi.getAccount(account)
      console.log('accountStats', accountStats)

      const eosioGlobalData = await rootChain.eosioContract.getGlobalData()
      console.log('eosioGlobalData', eosioGlobalData)

      const partnerData = await rootChain.partnersContract.getAccountPartner(account)
      console.log('partnerData', partnerData)
    } catch (e) {
      console.error(e)
    }
    loading.value = false
  }
</script>

<style lang="scss" scoped></style>
