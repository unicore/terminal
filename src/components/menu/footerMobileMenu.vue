<template lang="pug">
div.row.justify-around.full-height
  q-item(
    v-for="(item, index) in routesInMenu"
    :key="index"
    :active="isRouteActive(item)"
    active-class="menu-item-active"
    clickable
    class="cursor-pointer menu-item col-2 text-center"
    @click="router.push({ name: item.name, params: item.params })"
  ).full-height
    div(style="height: 22px;")
      i(:class="item.icon" style="width: auto; height: 20px;")
    div().no-select
      q-item-label(style="font-size: 8px;") {{item.pageName}}
</template>


<script setup lang="ts">
  import { computed } from 'vue'
  import { useRouter, useRoute } from 'vue-router'
  import { useI18n } from 'vue-i18n'
  import CartIcon from '~/assets/cart.svg?component'
  import HistoryIcon from '~/assets/history.svg?component'
  import OrderIcon from '~/assets/order.svg?component'
  import UnionIcon from '~/assets/union.svg?component'
  
  import config from '~/config'

  import { useUserStore } from '~/stores/user'

  const props = defineProps<{
    mini?: boolean,
    isMobile?: boolean
  }>()

  const { t } = useI18n()
  const router = useRouter()
  const userStore = useUserStore()
  const route = useRoute()

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
    return config.userMenu.filter(el => el.isMobile == true)
  })

</script>

<style lang="scss" scoped>


  .menu-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-transform: none;
    height: 100%;


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
