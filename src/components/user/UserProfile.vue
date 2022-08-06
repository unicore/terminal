<template>
  <div class="q-pa-md q-pb-sm">
    <div v-if="!userStore.hasAuth">
      <AuthForm />
    </div>
    <div v-else>
      <q-item>
        <q-item-section side>
          <q-avatar
            rounded
            size="48px"
            font-size="36px"
            color="teal"
            text-color="white"
            icon="account_circle" />
        </q-item-section>
        <q-item-section>
          <q-item-label overline>{{ userStore.username?.toUpperCase() }}</q-item-label>
          <q-item-label>
            <q-btn size="sm" flat color="secondary" @click="logout">выход</q-btn>
          </q-item-label>
        </q-item-section>
      </q-item>

      <WalletsCarousel />
    </div>
  </div>
</template>

<script setup lang="ts">
  import { useRouter } from 'vue-router'

  import { useUserStore } from '~/stores/user'
  import AuthForm from '~/components/user/AuthForm.vue'
  import WalletsCarousel from '~/components/wallet/WalletsCarousel.vue'

  const userStore = useUserStore()
  const router = useRouter()

  const logout = () => {
    router.push({ name: 'index' })
    userStore.logout()
  }
</script>

<style lang="scss" scoped></style>
