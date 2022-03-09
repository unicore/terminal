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
      <q-btn type="submit" label="Войти" class="q-mt-md" color="teal" />
    </div>
  </form>
</template>

<script setup lang="ts">
  import { ref } from 'vue'
  import { isValidWif } from '~/eos/ecc'
  import { isValidMnemonic } from '~/eos/bip39'

  const privateKey = ref('')

  const submit = () => {
    console.log(privateKey.value)
    console.log('WIF', isValidWif(privateKey.value))
    console.log('isValidMnemonic', isValidMnemonic(privateKey.value))
  }
</script>

<style lang="scss" scoped></style>
