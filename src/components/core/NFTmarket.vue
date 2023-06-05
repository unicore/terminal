<template lang="pug">
div.row
  div(v-for="host of hosts" v-bind:key="host.username").col-md-4.col-sm-6.col-xs-12
    div.q-pa-md
      nftMarketCard(:host="host")

</template>

<script setup lang="ts">
  import { useHostStore } from '~/stores/host'
  import { computed } from 'vue'
  import nftMarketCard from '~/components/core/nftMarketCard.vue'

  const hostStore = useHostStore()
  hostStore.loadHosts()

  const hosts = computed(() => hostStore.getHosts)
</script>

<style scoped lang="scss">
 
</style>
