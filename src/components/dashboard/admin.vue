<template lang="pug">
div.row
  coreFlow.col-md-6.col-xs-12.q-pa-md
  refFlow.col-md-6.col-xs-12.q-pa-md

</template>

<script setup lang="ts">

import { computed, ref, onMounted, watch} from 'vue'
import { useUserStore } from '~/stores/user'
import { useHostStore } from '~/stores/host'
import { useRouter } from 'vue-router'
import userBalance from '~/components/core/oneUserBalance.vue'
import config from '~/config'
import chains from '~/chainsMain'
import dacsIncome from '../core/dacsIncome.vue'

import coreFlow from './coreFlow.vue'
import refFlow from './refFlow.vue'

const router = useRouter()

const hostStore = useHostStore()
const userStore = useUserStore()


onMounted(async () => {

})

const withdrawAll = () => {

}

</script>
