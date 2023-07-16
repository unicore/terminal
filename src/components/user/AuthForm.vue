<template>
  <div v-if="!isRegister">
    <h6 class="text-h6 q-mb-md">Вход</h6>
    <LoginForm />
    <div class="q-mt-lg text-center">
      <q-btn flat rounded color="green" label="Зарегистрироваться" @click="isRegister = true" />
    </div>
  </div>
  <div v-else>
    <RegisterForm @hideEnter="hideEnter"/>
    <div v-if="showEnter" class="q-mt-lg text-center">
      <span class="text-grey">Уже зарегистрированы?</span>
      <q-btn
        flat
        
        dense
        color="green"
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
  const showEnter = ref(true)

  const hideEnter = () => {
    showEnter.value = false
  }
</script>

<style lang="scss" scoped></style>
