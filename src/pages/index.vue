<template>
  <div class="column flex-center pa-4">
    <div class="w-20% text-right">
      <q-select v-model="locale" :options="availableLocales" label="choose your language">
        <template v-slot:prepend>
          <q-icon :name="matLanguage" />
        </template>
      </q-select>
    </div>

    <img alt="Vue logo" src="/src/assets/logo.png" />
    <HelloWorld :msg="t('index.msg')" />
  </div>
</template>

<script setup lang="ts">
  import { useI18n } from 'vue-i18n'

  import { matLanguage } from '@quasar/extras/material-icons'
  import HelloWorld from '~/components/HelloWorld.vue'
  const { t, locale, availableLocales } = useI18n()
</script>
