<template>
  <div class="flex justify-start root">
    <div v-for="(t, i) in TAGS" :key="`${i}_${t}`" class="tag">{{ t }}</div>
  </div>
</template>

<script setup lang="ts">
  const TAGS = ['Рядом с морем', 'Бассейн', 'Сауна', 'Тренажерный зал']
</script>

<style scoped lang="scss">
  .tag {
    display: inline-block;
    font-style: normal;
    font-weight: 400;
    font-size: 14px;
    line-height: 18px;
    color: #096872;
    padding: 5px 10px;
    border: 1px solid rgba(9, 104, 114, 1);
    border-radius: 4px;
  }

  .root {
    column-gap: 10px;
    row-gap: 5px;
  }
</style>
