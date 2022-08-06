<template>
  <q-layout view="hHh lpR fFf">
    <q-header elevated class="bg-primary text-white text-left">
      <q-toolbar>
        <q-btn v-if="!isIndexLayout" dense flat round icon="menu" @click="toggleLeftDrawer" />

        <q-toolbar-title>
          <q-btn
            stretch
            flat
            :label="config.header?.title || 'UNI'"
            class="btn-title"
            @click="goToIndex" />
        </q-toolbar-title>

        <q-btn v-if="isIndexLayout" dense flat icon="login" label="Личный кабинет" @click="login" />
      </q-toolbar>
    </q-header>

    <q-drawer v-if="!isIndexLayout" v-model="leftDrawerOpen" show-if-above side="left" bordered>
      <UserProfile />

      <q-list separator class="min-w-25 pa-4 pt-0">
        <template v-for="(item, index) in routesInMenu" :key="index">
          <q-item
            v-ripple
            :active="item.name === currentRoute"
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

    <q-drawer v-if="isIndexLayout" v-model="rightDrawerOpen" overlay side="right" bordered>
      <UserProfile />
    </q-drawer>

    <q-page-container>
      <router-view v-slot="{ Component }">
        <transition name="slide-fade" mode="out-in">
          <q-page>
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

  import config from '~/config'
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
    return route.name
  })

  const isIndexLayout = computed(() => {
    return !!route.meta?.indexLayout
  })

  const makePageNameFromRoute = (route: RouteRecordRaw) => {
    if (String(route.name) === 'lk') {
      return 'pages.lk.index'
    }
    return `pages.${String(route.name).replace('lk-', 'lk.').replace('public-', 'public.')}`
  }

  const routesInMenu = computed(() => {
    const indexPageRoute = generatedRoutes.find((v) => String(v.name) === 'lk')
    const res = generatedRoutes.filter((v) => {
      const n = String(v.name)

      return !['lk', 'all'].includes(n)
    })
    if (indexPageRoute) {
      res.unshift(indexPageRoute)
    }

    return res
      .filter((v) => !v.meta?.hide && (!v.meta?.requiresAuth || userStore.hasAuth))
      .map((v) => ({
        name: String(v.name),
        pageName: makePageNameFromRoute(v),
        path: v.path,
      }))
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
  }
</style>
