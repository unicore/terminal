<template>
  <div :class="props.mini ? 'layout-mini' : 'layout-full'">
    <div v-if="!userStore.hasAuth">
      <AuthForm />
    </div>
    <div v-else>
      <q-item style="padding-left: 0">
        <q-item-section side :style="!props.mini && 'padding-right: 10px'">
          <q-avatar size="40px" font-size="20px" color="grey-12" text-color="white" icon="person" />
        </q-item-section>
        <q-item-section v-if="!props.mini">
          <q-item-label overline class="username">{{
            userStore.username?.toUpperCase()
          }}</q-item-label>
        </q-item-section>
      </q-item>

      <div class="ref-link" :class="props.mini && 'ref-link-mini-container'" @click="copyRLink">
        <template v-if="props.mini">
          <div class="ref-link-mini">
            <q-icon name="link" color="teal" size="16px" />
          </div>
        </template>
        <template v-else>
          <div class="ref-link-header">
            Партнерская ссылка <q-icon name="content_copy" color="teal" size="12px" />
          </div>
          <div class="ref-link-body">
            {{ link }}
          </div>
        </template>
      </div>

      <WalletsCarousel :mini="props.mini" />
    </div>
  </div>
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
    margin-top: 22px;
    margin-bottom: 20px;
    border-top: 1px solid #ecb464;
    border-bottom: 1px solid #ecb464;
    padding: 16px 0;
    cursor: pointer;
    height: 90px;

    &-mini {
      padding: 21px 0;
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
    padding: 52px 10px 20px 10px;
  }

  .layout-mini {
    padding: 52px 5px 20px 5px;
  }

  .username {
    font-style: normal;
    font-weight: 700;
    font-size: 14px;
    line-height: 18px;
    color: #181818;
  }
</style>
