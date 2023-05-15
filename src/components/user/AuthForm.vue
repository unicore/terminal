<template>
  <div v-if="!isRegister">
    <h6 class="text-h6 q-mb-md">Вход</h6>
    <LoginForm />
    <div class="q-mt-lg text-center">
      <q-btn flat rounded color="teal" label="Зарегистрироваться" @click="isRegister = true" />
    </div>
  </div>
  <div v-else>
    <RegisterForm />
    <div class="q-mt-lg text-center">
      <p class="text-grey">Уже есть ключ?</p>
      <q-btn
        flat
        rounded
        color="teal"
        label="Войти"
        @click="isRegister = false" />
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue'
  import LoginForm from '~/components/user/LoginForm.vue'
  import RegisterForm from '~/components/user/RegisterForm.vue'

  const isRegister = ref(true)
</script>

<style lang="scss" scoped></style>
