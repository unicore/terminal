<template>
  <div>
    <div class="text-h6 q-mb-md">{{ props.title }}</div>
    <div class="row q-col-gutter-md">
      <div v-for="id in props.ids" :key="id" class="col-4">
        <NftRequest :id="id" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import NftRequest from './NftRequest.vue'

  const props = defineProps<{
    title: string
    ids: number[]
  }>()
</script>

<style lang="scss" scoped></style>
