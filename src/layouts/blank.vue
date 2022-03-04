<template>
  <q-layout view="hHh lpR fFf">
    <q-page-container>
      <router-view v-slot="{ Component }">
        <transition name="slide-fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </q-page-container>
  </q-layout>
</template>

<style lang="scss">
  .slide-fade-enter {
    transform: translateX(10px);
    opacity: 0;
  }
  .slide-fade-enter-active,
  .slide-fade-leave-active {
    transition: all 0.1s ease;
  }
  .slide-fade-leave-to {
    transform: translateX(-10px);
    opacity: 0;
  }
</style>
