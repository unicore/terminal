<template lang="pug">
div.row.justify-center.q-pa-md
  coreFlow.col-md-4.col-xs-12.q-pa-xs
  flows.col-md-8.col-xs-12.q-pa-xs
  
</template>

<script setup lang="ts">

import { computed, ref, onMounted, watch} from 'vue'
import { useUserStore } from '~/stores/user'
import { useHostStore } from '~/stores/host'
import { useRouter } from 'vue-router'
import userBalance from '~/components/core/oneUserBalance.vue'
import config from '~/config'
import chains from '~/chainsMain'
import {Notify} from 'quasar'
import coreFlow from './coreFlow.vue'
import flows from './flows.vue'

const router = useRouter()
const loading = ref(false)
const hostStore = useHostStore()
const userStore = useUserStore()

const incomes = computed(() => Object.values(hostStore.incomes))

onMounted(async () => {
  
})

</script>
