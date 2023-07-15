<template lang="pug">
div.row.justify-center
  div(v-if="host").col-md-6.col-xs-12
    q-input(v-model="host.title")
    q-input(v-model="host.purpose" type="textarea" rows="10")
    q-btn(@click="save" ) save
</template>

<script setup lang="ts">

import { computed, ref, onMounted, watch} from 'vue'
import { useUserStore } from '~/stores/user'
import { useHostStore } from '~/stores/host'
import { useRouter } from 'vue-router'
import config from '~/config'
import chains from '~/chainsMain'
import {Notify} from 'quasar'
import coreFlow from './coreFlow.vue'
import flows from './flows.vue'

const host = computed(() => hostStore.getCurrentHost(config.coreHost))

const router = useRouter()
const loading = ref(false)
const hostStore = useHostStore()
const userStore = useUserStore()

const update = (model) => {
  console.log("update model", model)
}

onMounted(async () => {
  await hostStore.loadHost(config.coreHost)

})

const save = async () => {
  
  try{
  
    await hostStore.editHost(config.coreHost, host.value.title, host.value.purpose, host.value.manifest)
    Notify.create({
      message: "Информация отредактирована",
      type: 'positive',
    })
  } catch(e){
    Notify.create({
      message: e.message,
      type: 'negative',
    })
  }
}



</script>
