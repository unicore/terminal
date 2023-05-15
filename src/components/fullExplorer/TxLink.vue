<template lang="pug">
q-btn(color="teal" size="xs" href="#" @click.prevent="openInExplorer")
  slot {{txid}}
</template>

<script setup lang="ts">

import { useRouter, useRoute } from 'vue-router'
const router = useRouter()

const props = defineProps({
  txid: String
})

const openInExplorer = () => {
  router.push({name: 'explorer', params: {search: props.txid, force: "tx"}})
}
</script>