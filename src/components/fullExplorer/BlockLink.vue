<template lang="pug">
a(href="#" @click.prevent="openInExplorer") {{number}}
</template>

<script setup>

import { useRouter, useRoute } from 'vue-router'
const router = useRouter()

const props = defineProps({
  number: Number
})

const openInExplorer = () => {
  router.push({name: 'explorer', params: {search: props.number, force: 'block'}})
}
</script>