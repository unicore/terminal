<template lang="pug">

component(:is="resolvedComponent" v-if="resolvedComponent")

</template>

<script setup lang="ts">

import {componentsMap} from '~/router/routes.js'

import { computed, shallowRef, onMounted, watch} from 'vue'
import { useUserStore } from '~/stores/user'
import { useHostStore } from '~/stores/host'
import { useRouter } from 'vue-router'
import userBalance from '~/components/core/oneUserBalance.vue'
import config from '~/config'
import chains from '~/chainsMain'

const router = useRouter()

const hostStore = useHostStore()
const userStore = useUserStore()

let target = ""

if (userStore.hasAuth)
 target = config.homePageWithAuth
else target = config.homePageWithoutAuth


console.log("target: ", target)
const componentWithoutAuth = computed(() => componentsMap[target]())
const resolvedComponent = shallowRef(null)

onMounted(async () => {
  const component = await componentWithoutAuth.value
  resolvedComponent.value = component.default || component
})
</script>

