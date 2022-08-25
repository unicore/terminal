<template>
  <div class="stars flex justify-between">
    <span class="amount">{{ props.amount }}</span>
    <img :src="StarIcon" alt="" />
  </div>
</template>

<script setup lang="ts">
  import StarIcon from '~/assets/star.svg'

  const props = defineProps<{
    amount: number
  }>()
</script>

<style scoped lang="scss">
  .stars {
    width: 59px;

    img {
      display: inline-block;
    }
  }

  .amount {
    font-style: normal;
    font-weight: 700;
    font-size: 20px;
    line-height: 110.02%;
    color: #181818;
  }
</style>
