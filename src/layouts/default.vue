<template>
  <q-layout view="hHh lpR fFf">
    <q-header elevated class="bg-primary text-white text-left">
      <q-toolbar>
        <q-btn dense flat round icon="menu" @click="toggleLeftDrawer" />

        <q-toolbar-title>
          <q-avatar>
            <img src="https://cdn.quasar.dev/logo-v2/svg/logo-mono-white.svg" />
          </q-avatar>
          Title
        </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above side="left" bordered>
      <q-list bordered separator class="min-w-25 pa-4">
        <template v-for="(item, index) in generatedRoutes">
          <q-item
            v-if="item.name != 'all' && (userStore.hasAuth || !item.meta?.requiresAuth)"
            :key="index"
            clickable
            class="flex-col">
            <q-item-section class="cursor-pointer" @click="router.push({ path: item.path })">
              {{ t(`page.${item.name.replace('secured-', 'secured.')}`) }}
            </q-item-section>
          </q-item>
        </template>
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view v-slot="{ Component }">
        <transition name="slide-fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
  import { ref } from 'vue'
  import { useRouter } from 'vue-router'
  import generatedRoutes from 'virtual:generated-pages'
  import { useI18n } from 'vue-i18n'
  import { useUserStore } from '~/stores/user'

  const { t } = useI18n()
  const router = useRouter()
  const userStore = useUserStore()

  const leftDrawerOpen = ref<boolean>(false)

  const toggleLeftDrawer = () => {
    leftDrawerOpen.value = !leftDrawerOpen.value
  }
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
</style>
