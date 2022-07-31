<template>
  <div class="q-pa-md">
    <q-input v-model="link" label="Ваша партнёрская ссылка" readonly>
      <template #after>
        <q-btn color="green" icon="content_copy" label="Скопировать" @click="copyRLink" />
      </template>
    </q-input>
    <div class="q-mt-md">
      <AccountEvents v-if="userStore.username" :username="userStore.username" />
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { copyToClipboard, Notify } from 'quasar'

  import { useUserStore } from '~/stores/user'
  import AccountEvents from 'src/components/explorer/AccountEvents.vue'

  const userStore = useUserStore()
  const link = computed(() => `${location.protocol}//${location.host}/?r=${userStore.username}`)

  const copyRLink = () => {
    copyToClipboard(link.value)
      .then(() => {
        Notify.create({
          message: 'Ссылка скопирована',
          type: 'positive',
        })
      })
      .catch((e) => {
        console.log(e)
      })
  }
</script>
