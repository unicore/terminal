<template lang="pug">
div
  div(v-for="withdraw of withdraws" v-bind:key="withdraw.id")
    p {{withdraw}}
    q-btn()  

</template>

<script setup lang="ts">

import { computed, ref, onMounted} from 'vue'
import { useUserStore } from '~/stores/user'
import { useHostStore } from '~/stores/host'
import { useRouter } from 'vue-router'

const router = useRouter()

const hostStore = useHostStore()

const withdraws = computed(() => {return Object.values(hostStore.getWithdraws)})

onMounted(async () => {
  hostStore.loadWithdraws()
})



</script>
