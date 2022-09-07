<template>
  <q-list class="pa-4 pt-0 pr-0 pl-0 menu">
    <q-item
      v-for="(item, index) in routesInMenu"
      :key="index"
      v-ripple
      :active="
        (currentRoute.path.startsWith(item.path) && item.name !== 'lk') ||
        item.name === currentRoute.name
      "
      active-class="menu-item-active"
      clickable
      class="cursor-pointer menu-item"
      @click="router.push({ path: item.path })">
      <q-item-section class="menu-item-section">
        <div class="menu-item-icon">
          <component :is="ICONS[item.icon]" v-if="ICONS[item.icon]" />
        </div>
        <div v-if="!props.mini" class="menu-item-text">
          {{ t(item.pageName) }}
        </div>
      </q-item-section>

      <q-tooltip v-if="props.mini" anchor="center right" self="center left" :offset="[10, 10]">
        {{ t(item.pageName) }}
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
    const res = generatedRoutes.filter((v) => {
      const n = String(v.name)

      return !['all'].includes(n)
    })

    const r = res
      .filter((v) => !v.meta?.hide && (!v.meta?.requiresAuth || userStore.hasAuth))
      .map((v) => {
        let menuOrder = v.meta?.menuOrder
        let icon = String(v.meta?.icon || 'union') as keyof typeof ICONS

        if (!menuOrder && menuOrder !== 0) {
          menuOrder = 9999
        }

        return {
          name: String(v.name),
          pageName: makePageNameFromRoute(v),
          path: v.path,
          order: menuOrder,
          icon,
        }
      })

    r.sort((a: any, b: any) => (a.order > b.order ? 1 : b.order > a.order ? -1 : 0))

    return r
  })
</script>

<style lang="scss">
  .menu {
  }

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
    padding: 10px 0 10px 15px !important;
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

    &.menu-item-active {
      .menu-item-section:after {
        position: absolute;
        content: '';
        top: -10px;
        right: 0;
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
