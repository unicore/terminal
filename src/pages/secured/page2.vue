<template>
  <div class="column flex-center pa-4">
    [PAGE2]
    <br />
    STORE VALUE: {{ userStore.counter }}
    <br />
    <q-btn label="INCREMENT" color="purple" @click="userStore.increment()" />
    <br />
    <q-btn label="RANDOMIZE" color="purple" @click="userStore.randomizeCounter()" />
  </div>
</template>

<script setup lang="ts">
  import { useUserStore } from '~/stores/user'

  const userStore = useUserStore()
</script>
