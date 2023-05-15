<template>
  <div class="q-pa-md">
    <AccountEvents v-if="userStore.username" :username="userStore.username" />
  </div>
</template>

<script setup lang="ts">
  import { onMounted } from 'vue'
  import { useUserStore } from '~/stores/user'
  import AccountEvents from '~/components/explorer/AccountEvents.vue'


  const userStore = useUserStore()
</script>

