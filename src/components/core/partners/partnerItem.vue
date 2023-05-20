<template lang="pug">
div
  q-item(clickable @click="toggle").clickable
    q-item-section
      div
        // q-avatar
        //   q-icon(name="account_circle" color="teal")
        div.q-ml-sm
          div
            span.q-ml-md Уровень
              q-chip( outline color="teal") {{ partner.level }}
            
            span.q-ml-md Имя аккаунта
              q-chip(outline color="teal") {{ partner.username }}
            span.q-ml-md Партнеры
              q-chip(outline color="teal") {{ partner.count }}
    q-item-section(side)
      q-icon.q-ml-sm(v-if="partner.partners && partner.partners.length > 0" :name="showPartners ? 'expand_less' : 'expand_more'" color="teal" size="lg")
  q-separator
  div(:style="{ paddingLeft: `${partner.level}em` }" v-show="showPartners")
    partner-item(v-for="subpartner in partner.partners" :key="subpartner.username" :partner="subpartner" v-if="partner.partners && partner.partners.length > 0")
</template>//

<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps({
  partner: Object
})

const showPartners = ref(false)

const toggle = () => {
  if (props.partner.partners && props.partner.partners.length > 0) {
    showPartners.value = !showPartners.value
  }
}
</script>

<style scoped>
.clickable {
  cursor: pointer;
  width: 100%;
}

.clickable .q-item__section--main div {
  display: flex;
  align-items: center;
}
</style>
