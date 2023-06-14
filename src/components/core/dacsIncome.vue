<template lang="pug">
div
  p dacs
</template>

<script setup lang="ts">

import { computed, ref, onMounted, watch} from 'vue'
import { useUserStore } from '~/stores/user'
import { useHostStore } from '~/stores/host'
import { useRouter } from 'vue-router'
import userBalance from '~/components/core/oneUserBalance.vue'
import config from '~/config'
import chains from '~/chainsMain'

const router = useRouter()

const hostStore = useHostStore()
const userStore = useUserStore()

onMounted(async () => {

})


</script>
