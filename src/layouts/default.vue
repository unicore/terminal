<template>
  <q-layout view="hHh lpR fFf">
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

    <q-drawer v-if="!isIndexLayout" v-model="leftDrawerOpen" show-if-above side="left" bordered>
      <UserProfile />

      <q-list separator class="min-w-25 pa-4 pt-0">
        <template v-for="(item, index) in routesInMenu" :key="index">
          <q-item
            v-ripple
            :active="
              (currentRoute.path.startsWith(item.path) && item.name !== 'lk') ||
              item.name === currentRoute.name
            "
            active-class="bg-teal-1 text-grey-8"
            clickable
            class="flex-col">
            <q-item-section class="cursor-pointer" @click="router.push({ path: item.path })">
              {{ t(item.pageName) }}
            </q-item-section>
          </q-item>
        </template>
      </q-list>
    </q-drawer>

    <q-drawer v-if="isIndexLayout" v-model="rightDrawerOpen" overlay side="left" bordered>
      <UserProfile />
    </q-drawer>

    <q-page-container>
      <router-view v-slot="{ Component }">
        <transition name="slide-fade" mode="out-in">
          <q-page class="page">
            <component :is="Component" />
          </q-page>
        </transition>
      </router-view>
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
  import { ref, computed, onMounted } from 'vue'
  import { useRouter, useRoute, RouteRecordRaw } from 'vue-router'
  import generatedRoutes from 'virtual:generated-pages'
  import { useI18n } from 'vue-i18n'
  import { useQuasar, Cookies } from 'quasar'

  import MenuIcon from '~/assets/menu.svg?url'
  import HeaderLogo from '~/assets/header-logo.svg?url'
  import { useUserStore } from '~/stores/user'
  import { useWalletStore } from '~/stores/wallet'
  import UserProfile from '~/components/user/UserProfile.vue'

  const $q = useQuasar()
  defineExpose({
    $q,
  })

  const { t } = useI18n()
  const router = useRouter()
  const userStore = useUserStore()
  const walletStore = useWalletStore()
  const route = useRoute()

  const leftDrawerOpen = ref<boolean>(false)
  const rightDrawerOpen = ref<boolean>(false)

  const toggleLeftDrawer = () => {
    leftDrawerOpen.value = !leftDrawerOpen.value
  }

  const currentRoute = computed(() => {
    return route
  })

  const isIndexLayout = computed(() => {
    return !!route.meta?.indexLayout
  })

  const makePageNameFromRoute = (route: RouteRecordRaw) => {
    if (String(route.name) === 'lk') {
      return 'pages.lk.index'
    }
    if (String(route.name) === 'lk-estate') {
      return 'pages.lk.estate.index'
    }
    return `pages.${String(route.name).replace('lk-', 'lk.').replace('public-', 'public.')}`
  }

  const routesInMenu = computed(() => {
    // const indexPageRoute = generatedRoutes.find((v) => String(v.name) === 'lk')
    const res = generatedRoutes.filter((v) => {
      const n = String(v.name)

      return !['all'].includes(n)
    })
    // if (indexPageRoute) {
    //   res.unshift(indexPageRoute)
    // }

    const r = res
      .filter((v) => !v.meta?.hide && (!v.meta?.requiresAuth || userStore.hasAuth))
      .map((v) => {
        let menuOrder = v.meta?.menuOrder

        if (!menuOrder && menuOrder !== 0) {
          menuOrder = 9999
        }

        return {
          name: String(v.name),
          pageName: makePageNameFromRoute(v),
          path: v.path,
          order: menuOrder,
        }
      })

    r.sort((a: any, b: any) => (a.order > b.order ? 1 : b.order > a.order ? -1 : 0))

    return r
  })

  const goToIndex = () => {
    router.push({ name: 'index' })
  }

  const login = () => {
    if (userStore.hasAuth) {
      router.push({ name: 'lk' })
    } else {
      rightDrawerOpen.value = !rightDrawerOpen.value
    }
  }

  onMounted(async () => {
    const ref = Cookies.get('referer') || String(route.query.r || '')
    if (ref) {
      await userStore.setReferrer(ref)
    }
    walletStore.loadWallets()
    userStore.getUserBalances()
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
</style>
