<template>
  <q-card-section v-if="object.with_delivery">
    <q-checkbox v-model="withDelivery" disable label="С доставкой" />
  </q-card-section>

  <q-badge size="lg" floating color="teal" style="font-size: 14px" class="q-pa-sm"
    >{{ object.one_piece_price }} за одну часть</q-badge
  >

  <q-card-actions>
    <q-btn
      v-if="object.remain_pieces > 0 && !props.readmore"
      dialog
      color="teal"
      label="Купить"
      :disable="!userStore.hasAuth"
      @click="showDialog = true" />
    <q-btn v-if="props.readmore" dialog color="teal" label="Подробнее" disable />
    <q-dialog v-model="showDialog">
      <q-card>
        <q-card-section>
          <div class="text-h6">Информация о покупке</div>
        </q-card-section>

        <q-card-section class="q-pt-none text-center">
          <div class="text-subtitle1">
            Для связи с&nbsp;консультантом, пожалуйста, запустите робота:
          </div>
          <q-btn
            color="blue"
            href="https://t.me/simply_estate_bot"
            target="_blank"
            rel="noreferrer">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              class="bi bi-telegram"
              viewBox="0 0 16 16">
              <path
                d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8.287 5.906c-.778.324-2.334.994-4.666 2.01-.378.15-.577.298-.595.442-.03.243.275.339.69.47l.175.055c.408.133.958.288 1.243.294.26.006.549-.1.868-.32 2.179-1.471 3.304-2.214 3.374-2.23.05-.012.12-.026.166.016.047.041.042.12.037.141-.03.129-1.227 1.241-1.846 1.817-.193.18-.33.307-.358.336a8.154 8.154 0 0 1-.188.186c-.38.366-.664.64.015 1.088.327.216.589.393.85.571.284.194.568.387.936.629.093.06.183.125.27.187.331.236.63.448.997.414.214-.02.435-.22.547-.82.265-1.417.786-4.486.906-5.751a1.426 1.426 0 0 0-.013-.315.337.337 0 0 0-.114-.217.526.526 0 0 0-.31-.093c-.3.005-.763.166-2.984 1.09z" /></svg
            >&nbsp;&nbsp;simply_estate_bot
          </q-btn>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn v-close-popup flat label="OK" color="primary" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-card-actions>
</template>

<script setup lang="ts">
  import { computed, ref } from 'vue'
  import { NftMarketObject } from 'unicore/ts/src/blockchain/contracts/nft'
  import { useUserStore } from '~/stores/user'
  import { useNftStore } from '~/stores/nft'

  const withDelivery = ref(true)
  const showDialog = ref(false)
  const userStore = useUserStore()

  const props = defineProps<{
    id: number
    readmore?: boolean
  }>()
  const nftStore = useNftStore()

  const object = computed<NftMarketObject>(() => nftStore.getNftMarketById(props.id))
</script>

<style lang="scss" scoped>
  .text-link {
    color: #028dc8;
    display: inline;
  }
</style>
