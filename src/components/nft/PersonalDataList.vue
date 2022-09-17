<template>
  <template v-if="isLoading">
    <div v-for="n in 3" :key="n" :class="props.containerClass">
      <q-skeleton class="q-my-md" />
    </div>
  </template>
  <template v-else-if="dataValue">
    <div v-for="(d, i) in dataValue" :key="`${i}_${d.placeholder}`" :class="props.containerClass">
      <div :class="props.titleClass">{{ d.placeholder }}</div>
      <div :class="props.valueClass">{{ d.value }}</div>
    </div>
  </template>
</template>

<script setup lang="ts">
  import { computed, watch } from 'vue'
  import { useNftStore } from '~/stores/nft'

  const nftStore = useNftStore()

  const props = defineProps<{
    dataObject: any
    asSender?: boolean
    containerClass: string
    titleClass: string
    valueClass: string
  }>()

  const personalDataId = computed(() => {
    if (
      !props.dataObject ||
      Array.isArray(props.dataObject) ||
      typeof props.dataObject !== 'object'
    ) {
      return null
    }

    return props.dataObject.personalDataId
  })

  const isLoading = computed(
    () => personalDataId.value && nftStore.getPersonalDataLoadingById(personalDataId.value)
  )

  const dataValue = computed(() => {
    if (!personalDataId.value) {
      return props.dataObject
    }

    if (isLoading.value) {
      return null
    }

    const val = nftStore.getPersonalDataById(personalDataId.value)

    if (val && Array.isArray(val.rows)) {
      return val.rows
    }

    return val
  })

  watch(
    personalDataId,
    () => {
      if (personalDataId.value) {
        nftStore.loadPersonalData(personalDataId.value, !!props.asSender)
      }
    },
    { immediate: true }
  )
</script>
