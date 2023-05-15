<template lang="pug">
div
  .row.q-col-gutter-sm
    .col.col-xs-4(
      v-for="token in tokens",
      :key="token.contract"
    )
      q-card(dark bordered).text-white.full-width.full-height
        q-card-section
          .text-subtitle2 {{token.contract}}
          .text-h5(v-if="!hasFreeze(token.symbol)") {{token.amount}} {{token.symbol}}
          template(v-else)
            .text-h6 Доступно: {{token.amount}} {{token.symbol}}
            .text-subtitle(v-if="freezedTokens[token.symbol]") P2P заморожено: {{freezedTokens[token.symbol]}} {{token.symbol}}
            .text-subtitle(v-if="referralFreezedTokens[token.symbol]") Заморожено: {{referralFreezedTokens[token.symbol]}} {{token.symbol}}
</template>

<script setup lang="ts">

import { ref, watchEffect, computed } from 'vue'

const props = defineProps(['accountData'])

const tokens = computed(() => props.accountData.tokens)
const accountName = computed(() => props.accountData.account.account_name)

const freezedTokens = ref({})
const referralFreezedTokens = ref({})

const hasFreeze = (symbol: string) => {
  return !!freezedTokens.value[symbol] || !!referralFreezedTokens.value[symbol]
}


</script>
