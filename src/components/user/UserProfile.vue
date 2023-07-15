<template lang="pug">
div(:class="props.mini ? 'layout-mini' : 'layout-full'")
  div(v-if="!userStore.hasAuth")
    AuthForm
  div(v-else)
    // q-item(style="padding-left: 0" v-if="userStore.username && !props.mini")
    //   q-item-section
    //     q-item-label(overline class="username") {{ userStore.username?.toUpperCase() }}
    div(class="ref-link" :class="props.mini" @click="copyRLink")
      template(v-if="props.mini")
        q-btn(flat).full-width.full-height.link-button.ref-link-mini
          q-icon(name="link" color="teal" size="16px")
      template(v-else)
        div(class="ref-link-header")
          | Партнерская ссылка 
          q-icon(name="content_copy" color="teal" size="12px")
        div(class="ref-link-body") {{ link }}
    // WalletsCarousel(v-if="!props.mini" :mini="props.mini")

</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { copyToClipboard, Notify } from 'quasar'

  import { useUserStore } from '~/stores/user'
  import AuthForm from '~/components/user/AuthForm.vue'
  import WalletsCarousel from '~/components/wallet/WalletsCarousel.vue'

  const userStore = useUserStore()
  const link = computed(() => `${location.protocol}//${location.host}/?r=${userStore.username}`)

  const props = defineProps<{
    mini?: boolean
  }>()

  const copyRLink = () => {
    copyToClipboard(link.value)
      .then(() => {
        Notify.create({
          message: 'Ссылка скопирована',
          type: 'positive',
        })
      })
      .catch((e) => {
        console.log(e)
      })
  }
</script>

<style lang="scss" scoped>
  .ref-link {
    border-bottom: 1px solid #ecb464;
    cursor: pointer;
    height: 50px;
    
    &-mini {
      
      text-align: center;

      &-container {
        margin-left: 5px;
        margin-right: 5px;
      }
    }

    &-header {
      font-style: normal;
      font-weight: 400;
      font-size: 14px;
      line-height: 18px;
      color: #8a8a8a;
    }

    &-body {
      margin-top: 3px;
      font-weight: 400;
      font-size: 12px;
      line-height: 16px;
      color: #096872;
    }
  }

  .layout-full {
    padding: 10px 10px 20px 10px;
  }

  .link-button {
    padding: 0px !important;
  }

  .username {
    font-style: normal;
    font-weight: 700;
    font-size: 14px;
    line-height: 18px;
    color: #181818;
  }
</style>
