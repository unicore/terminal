<template lang="pug">
div.footer-root
  div().copyright
    blockInfo
  
  
</template>

<script setup lang="ts">
  import { useRouter } from 'vue-router'
  import blockInfo from '~/components/menu/blockInfo.vue'
  import { useUserStore } from '~/stores/user'
  import { computed } from 'vue'

  const props = defineProps<{
    mini?: boolean
  }>()

  const router = useRouter()
  const userStore = useUserStore()

  const loggedIn = computed(() => {
    return userStore.hasAuth
  })


  const logout = () => {
    router.push({ name: 'index' })
    userStore.logout()
  }
</script>

<style lang="scss">
  .footer-root {
    text-align: center;
  }

  .copyright {
    width: 100%;
    text-align: center;
    position: absolute;
    bottom: 10px;
    font-style: normal;
    font-weight: 400;
    font-size: 10px;
    line-height: 16px;
    color: #8a8a8a;
  }

  .logout {
    cursor: pointer;
    &:hover .logout-text {
      text-decoration: underline;
    }

    .logout-text {
      font-style: normal;
      font-weight: 400;
      font-size: 14px;
      line-height: 18px;
      color: #181818;
      vertical-align: bottom;
      display: inline-block;
      padding-left: 10px;
    }
  }
</style>
