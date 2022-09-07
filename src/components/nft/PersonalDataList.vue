<template>
  <template v-if="isLoading">
    <q-item>
      <q-item-section>
        <q-skeleton class="q-my-md" />
      </q-item-section>
    </q-item>
    <q-item>
      <q-item-section>
        <q-skeleton class="q-my-md" />
      </q-item-section>
    </q-item>
    <q-item>
      <q-item-section>
        <q-skeleton class="q-my-md" />
      </q-item-section>
    </q-item>
  </template>
  <template v-else-if="dataValue">
    <q-item v-for="(d, i) in dataValue" :key="`${i}_${d.placeholder}`">
      <q-item-section>
        <q-item-label>{{ d.placeholder }}</q-item-label>
        <q-item-label caption>{{ d.value }}</q-item-label>
      </q-item-section>
    </q-item>
  </template>
</template>

<script setup lang="ts">
  import { computed, watch } from 'vue'
  import { useNftStore } from '~/stores/nft'

  const nftStore = useNftStore()

  const props = defineProps<{
    dataObject: any
    asSender?: boolean
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
