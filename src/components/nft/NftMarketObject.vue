<template>
  <q-card-section v-if="object.with_delivery">
    <q-checkbox v-model="withDelivery" disable label="С доставкой" />
  </q-card-section>

  <q-badge size="lg" floating color="teal" style="font-size: 14px" class="q-pa-sm"
    >{{ object.one_piece_price }} за одну часть</q-badge
  >

  <q-card-actions>
    <q-btn
      v-if="object.remain_pieces > 0"
      dialog
      color="teal"
      label="Купить"
      :disable="!userStore.hasAuth"
      @click="showDialog = true" />
    <q-dialog v-model="showDialog">
      <q-card>
        <q-card-section>
          <div class="text-h6">Информация о покупке</div>
        </q-card-section>

        <q-card-section class="q-pt-none"> Для покупки свяжитесь с @foobar </q-card-section>

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
  }>()
  const nftStore = useNftStore()

  const object = computed<NftMarketObject>(() => nftStore.getNftMarketById(props.id))
</script>

<style lang="scss" scoped></style>
