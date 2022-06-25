<template>
  <div class="q-pa-md">
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
      <q-item class="q-pt-none q-mb-md">
        <q-item-section>
          <q-item-label>
            <q-btn
              size="sm"
              color="green"
              icon="handshake"
              label="Партнёрская ссылка"
              @click="copyRLink" />
          </q-item-label>
        </q-item-section>
      </q-item>

      <WalletsCarousel />
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { useRouter, useRoute } from 'vue-router'
  import { copyToClipboard, Notify } from 'quasar'

  import { useUserStore } from '~/stores/user'
  import AuthForm from '~/components/user/AuthForm.vue'
  import WalletsCarousel from '~/components/wallet/WalletsCarousel.vue'

  const userStore = useUserStore()
  const router = useRouter()
  const route = useRoute()

  const currentRoute = computed(() => {
    return String(route.name)
  })

  const logout = () => {
    if (currentRoute.value.startsWith('secured-')) {
      router.push({ name: 'index' })
    }
    userStore.logout()
  }

  const copyRLink = () => {
    copyToClipboard(`${location.protocol}//${location.host}/?r=${userStore.username}`)
      .then(() => {
        Notify.create({
          message: 'Ссылка скопирована',
          type: 'positive',
        })
      })
      .catch((e) => {
        console.log(e)
      })
  }
</script>

<style lang="scss" scoped></style>
