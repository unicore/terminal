<template>
  <q-page>
    <input
      :value="modelValue"
      class="border border-gray-400 h-8 leading-8 min-w-32 p-0.5"
      @input="updateValue($event)" />
  </q-page>
</template>

<script setup lang="ts">
  defineProps<{ modelValue: string | null }>()

  const emit = defineEmits<{
    (_event: 'update:modelValue', _value: string): string
  }>()

  const updateValue = (event: InputEvent) => {
    emit('update:modelValue', (event.target as HTMLInputElement).value)
  }
</script>

<style lang="scss" scoped></style>
