<template>
  <div class="footer-root">
    <div class="logout" @click="logout">
      <q-icon name="logout" color="teal" size="16px" />
      <span v-if="!props.mini" class="logout-text">Выйти</span>
    </div>
    <div :style="props.mini ? 'opacity: 0' : ''" class="copyright">
      2022 simply estate все права защищены
    </div>
  </div>
</template>

<script setup lang="ts">
  import { useRouter } from 'vue-router'

  import { useUserStore } from '~/stores/user'

  const props = defineProps<{
    mini?: boolean
  }>()

  const router = useRouter()
  const userStore = useUserStore()

  const logout = () => {
    router.push({ name: 'index' })
    userStore.logout()
  }
</script>

<style lang="scss">
  .footer-root {
    padding: 10px 20px;
  }

  .copyright {
    font-style: normal;
    font-weight: 400;
    font-size: 12px;
    line-height: 16px;
    color: #8a8a8a;
    padding-top: 17px;
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
