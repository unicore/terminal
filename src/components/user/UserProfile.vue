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

      <div class="ref-link" @click="copyRLink">
        <div class="ref-link-header">
          Партнерская ссылка <q-icon name="content_copy" color="teal" size="12px" />
        </div>
        <div class="ref-link-body">
          {{ link }}
        </div>
      </div>

      <WalletsCarousel />
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { copyToClipboard, Notify } from 'quasar'
  import { useRouter } from 'vue-router'

  import { useUserStore } from '~/stores/user'
  import AuthForm from '~/components/user/AuthForm.vue'
  import WalletsCarousel from '~/components/wallet/WalletsCarousel.vue'
  const userStore = useUserStore()
  const router = useRouter()
  const link = computed(() => `${location.protocol}//${location.host}/?r=${userStore.username}`)

  const copyRLink = () => {
    copyToClipboard(link.value)
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

  const logout = () => {
    router.push({ name: 'index' })
    userStore.logout()
  }
</script>

<style lang="scss" scoped>
  .ref-link {
    margin-top: 22px;
    margin-bottom: 20px;
    border-top: 1px solid #ecb464;
    border-bottom: 1px solid #ecb464;
    padding: 16px 0;
    cursor: pointer;

    &-header {
      font-style: normal;
      font-weight: 400;
      font-size: 14px;
      line-height: 18px;
      color: #8a8a8a;
    }

    &-body {
      margin-top: 3px;
      font-weight: 400;
      font-size: 12px;
      line-height: 16px;
      color: #096872;
    }
  }
</style>
