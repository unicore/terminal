<template>
  <div v-if="!isRegister">
    <h6 class="text-h6 q-mb-md">Вход</h6>
    <LoginForm />
    <div class="q-mt-lg text-center">
      <q-btn flat rounded color="primary" label="Зарегистрироваться" @click="isRegister = true" />
    </div>
  </div>
  <div v-else>
    <h6 class="text-h6 q-mb-md">Регистрация</h6>
    <RegisterForm />
    <div class="q-mt-lg text-center">
      <q-btn
        flat
        rounded
        color="primary"
        label="Вернуться и войти по ключу"
        @click="isRegister = false" />
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue'
  import LoginForm from '~/components/user/LoginForm.vue'
  import RegisterForm from '~/components/user/RegisterForm.vue'

  const isRegister = ref(false)
</script>

<style lang="scss" scoped></style>
