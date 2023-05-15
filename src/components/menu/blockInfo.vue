<template lang="pug">
div 
  div(v-if="missedConnection")
    i(style="color: red").far.fa-circle
    div
      span нет
    div
      span соединения
  div(v-else)
    i(style="color: teal").far.fa-circle
    div
      span блок №
    div
      span {{currentBlock}}

</template>

<script setup lang="ts">

import { computed, ref, onMounted} from 'vue'
import { useBlockchainStore } from '~/stores/blockchain'
import { useRouter } from 'vue-router'
import userBalance from '~/components/core/oneUserBalance.vue'

const router = useRouter()

const bcStore = useBlockchainStore()

let currentBlock = computed(() => {
  return bcStore.getInfo.head_block_num
})

let missedConnection = computed(() => {
  if (!bcStore.getInfo.head_block_num)
    return true
  else return false
})

</script>
