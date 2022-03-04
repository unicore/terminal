<template>
  <div class="column flex-center pa-4">
    <q-btn v-if="userStore.hasAuth" label="Logout" @click="userStore.logout()" />
    <q-btn v-else label="Login" @click="userStore.login()" />
  </div>
</template>

<script setup lang="ts">
  import { useUserStore } from '~/stores/user'

  const userStore = useUserStore()
</script>
