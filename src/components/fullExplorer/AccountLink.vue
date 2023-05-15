<template lang="pug">
a(href="#" @click.prevent="openAccountInExplorer") {{accountName}}
</template>

<script setup lang="ts">
import { ref } from 'vue'

import { useRouter, useRoute } from 'vue-router'
const router = useRouter()

const props = defineProps({
  accountName: String
})

const openAccountInExplorer = () => {
  router.push({name: 'explorer', params: {search: props.accountName, force: "account"}})
}
</script>
