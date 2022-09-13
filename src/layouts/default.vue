<template>
  <q-layout view="hHh LpR fFf">
    <q-header elevated class="bg-white text-black text-left">
      <q-toolbar>
        <q-btn v-if="isIndexLayout" dense flat round @click="login">
          <img :src="MenuIcon" alt="Menu" />
        </q-btn>
        <q-btn v-else dense flat round @click="toggleLeftDrawer">
          <img :src="MenuIcon" alt="Menu" />
        </q-btn>

        <q-toolbar-title>
          <q-btn stretch flat class="btn-title" @click="goToIndex">
            <img :src="HeaderLogo" alt="Homeunity logo" />
          </q-btn>
        </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-if="!isIndexLayout"
      :mini="!leftDrawerOpen && !leftDrawerOverOpen"
      show-if-above
      side="left"
      persistent
      :mini-width="60"
      :width="240"
      class="drawer">
      <UserProfile :mini="!leftDrawerOpen && !leftDrawerOverOpen" />

      <Menu :mini="!leftDrawerOpen && !leftDrawerOverOpen" />

      <MenuFooter :mini="!leftDrawerOpen && !leftDrawerOverOpen" />
    </q-drawer>

    <q-drawer
      v-if="isIndexLayout"
      v-model="rightDrawerOpen"
      overlay
      side="left"
      class="drawer"
      bordered
      :width="240"
      persistent>
      <UserProfile />
    </q-drawer>

    <q-page-container>
      <q-page class="page">
        <router-view v-slot="{ Component }">
          <component :is="Component" />
        </router-view>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
  import { ref, computed, onMounted, watch } from 'vue'
  import { useRouter, useRoute } from 'vue-router'
  import { useQuasar, Cookies } from 'quasar'

  import MenuIcon from '~/assets/menu.svg?url'
  import HeaderLogo from '~/assets/header-logo.svg?url'
  import { useUserStore } from '~/stores/user'
  import { useWalletStore } from '~/stores/wallet'
  import UserProfile from '~/components/user/UserProfile.vue'
  import Menu from '~/components/menu/index.vue'
  import MenuFooter from '~/components/menu/MenuFooter.vue'

  const $q = useQuasar()
  defineExpose({
    $q,
  })

  const router = useRouter()
  const userStore = useUserStore()
  const walletStore = useWalletStore()
  const route = useRoute()

  const leftDrawerOpen = ref<boolean>(false)
  const leftDrawerOverOpen = ref<boolean>(false)
  const rightDrawerOpen = ref<boolean>(false)

  const toggleLeftDrawer = () => {
    leftDrawerOpen.value = !leftDrawerOpen.value
  }

  const isIndexLayout = computed(() => {
    return !!route.meta?.indexLayout
  })

  watch(route, () => {
    leftDrawerOpen.value = false
    rightDrawerOpen.value = false
  })

  const goToIndex = () => {
    router.push({ name: 'index' })
  }

  const login = () => {
    if (userStore.hasAuth) {
      router.push({ name: 'lk-estate' })
    } else {
      rightDrawerOpen.value = !rightDrawerOpen.value
    }
  }

  onMounted(async () => {
    const ref = Cookies.get('referer') || String(route.query.r || '')
    if (ref) {
      await userStore.setReferrer(ref)
    }
    await Promise.all([walletStore.loadWallets(), userStore.getUserBalances()])
  })
</script>

<style lang="scss">
  .slide-fade-enter {
    transform: translateX(8px);
    opacity: 0;
  }
  .slide-fade-enter-active,
  .slide-fade-leave-active {
    transition: all 0.15s ease;
  }
  .slide-fade-leave-to {
    transform: translateX(-8px);
    opacity: 0;
  }

  .btn-title {
    font-size: 20px;
    height: 60px;
    padding-top: 2px;
    padding-bottom: 6px;
  }

  .page {
    background-color: #f2f2f2;
  }

  .q-toolbar {
    box-shadow: 0 5px 10px rgba(132, 132, 132, 0.2);
  }

  .q-layout__shadow:after {
    box-shadow: none;
  }

  .drawer {
    border-right: none !important;
    box-shadow: 0 0 30px rgba(132, 132, 132, 0.25) !important;
  }
</style>
