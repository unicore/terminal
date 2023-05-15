<template lang="pug">
div.full-width
  div
    q-input(filled label-color="white" type="number" controls-position="right" v-model="wamount" :precision="8" :step="0.0001" :min="0.0001" label="Введите сумму в USDT:") 
      span {{gateway_symbol}}
    
    q-input(filled label-color="white" label="Введите адрес USDT TRC20:"  v-model="waddr")
    
  q-btn(color="teal" :loading="wload" type="success" @click="withdraw").full-width Вывести
</template>

<script setup lang="ts">//
import { computed, ref, watch } from 'vue'
import { useUserStore } from '~/stores/user'
import chains from '~/chainsMain'

const props = defineProps({
    symbol: {
      type: String,
      required: true,
    }
  })

let wamount = ref("")
let waddr = ref("")
</script>