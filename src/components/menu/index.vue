<template>
  <q-list class="pt-0 pr-0 pl-0 menu">
    <q-item
      v-for="(item, index) in routesInMenu"
      :key="index"
      v-ripple
      :active="isRouteActive(item)"
      active-class="menu-item-active"
      clickable
      class="cursor-pointer menu-item"
      @click="router.push({ name: item.name, params: item.params })">
      <q-item-section class="menu-item-section">
        <div class="menu-item-icon">
          <i :class="item.icon" ></i>
          <!-- <font-awesome-icon :name="item.icon"></font-awesome-icon> -->
          <!-- <component :is="ICONS[item.icon]" v-if="ICONS[item.icon]" /> -->
        </div>
        <div v-if="!props.mini" class="menu-item-text">
          {{ t(item.pageName) }}
        </div>
      </q-item-section>

      <q-tooltip v-if="props.mini" anchor="center right" self="center left" :offset="[10, 10]">
        {{ t(item.pageName) }}
      </q-tooltip>
    </q-item>
    <q-item @click="logout" class="cursor-pointer menu-item" active-class="menu-item-active" v-ripple clickable>
      <q-item-section class="menu-item-section">
        <div class="menu-item-icon">
          <q-icon name="logout"></q-icon>
        </div>
        <div v-if="!props.mini" class="menu-item-text">
          Выход
        </div>
      </q-item-section>
      <q-tooltip v-if="props.mini" anchor="center right" self="center left" :offset="[10, 10]">
        Выйти из приложения
      </q-tooltip>
    </q-item>
  </q-list>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { useRouter, useRoute, RouteRecordRaw } from 'vue-router'
  import generatedRoutes from 'virtual:generated-pages'
  import { useI18n } from 'vue-i18n'
  import CartIcon from '~/assets/cart.svg?component'
  import HistoryIcon from '~/assets/history.svg?component'
  import OrderIcon from '~/assets/order.svg?component'
  import UnionIcon from '~/assets/union.svg?component'
  
  import config from '~/config'

  import { useUserStore } from '~/stores/user'

  const props = defineProps<{
    mini?: boolean
  }>()

  const { t } = useI18n()
  const router = useRouter()
  const userStore = useUserStore()
  const route = useRoute()

  const ICONS = {
    cart: CartIcon,
    history: HistoryIcon,
    order: OrderIcon,
    union: UnionIcon,
  }

  const currentRoute = computed(() => {
    return route
  })


  const loggedIn = computed(() => {
    return userStore.hasAuth
  })


  const logout = () => {
    router.push({ name: 'index' })
    userStore.logout()
  }

  const isRouteActive = (item) => {
    if (item.name === route.name) {
      return true
    }

    // Проверка, совпадает ли родительский маршрут с именем элемента в routesInMenu
    if (route.matched.some(record => record.name === item.name)) {
      return true
    }
    return false
  }

  const routesInMenu = computed(() => {
    return config.userMenu
  })

</script>

<style lang="scss" scoped>
  
  .menu-item-section {
    display: flex !important;
    gap: 7px;
    flex-direction: row;
    justify-content: flex-start !important;
    width: 100%;
    position: relative;
  }

  .menu-item {
    text-align: left !important;
    justify-content: flex-start;
    padding: 10px 0 10px 13px !important;
    min-width: 0;
    font-style: normal;
    font-weight: 400;
    font-size: 14px;
    line-height: 18px;

    color: #8a8a8a;

    &-icon {
      background: #efefef;
      border-radius: 4px;
      padding: 9px;
      color: #7c7b7b !important;
    }

    &-active {
      color: rgba(9, 104, 114, 1) !important;
    }

    &-text {
      align-self: center;
    }

    .menu-item-icon {
      width: 45px;
      text-align: center;
    }

    &.menu-item-active {
      .menu-item-section:before {
        position: absolute;
        content: '';
        top: -10px;
        left: -15px;
        bottom: -10px;
        width: 5px;
        background: #52a49d;
      }
      .menu-item-icon {
        background: #096872;
        color: #ecb464 !important;
      }
    }
  }
</style>
