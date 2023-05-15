<template lang="pug">
div
</template>

<script setup lang="ts">

import { computed, ref, onMounted} from 'vue'
import { useUserStore } from '~/stores/user'
import { useHostStore } from '~/stores/host'
import { useRouter } from 'vue-router'
import userBalance from '~/components/core/oneUserBalance.vue'

const router = useRouter()

const hostStore = useHostStore()
const userStore = useUserStore()

onMounted(async () => {

})


</script>
