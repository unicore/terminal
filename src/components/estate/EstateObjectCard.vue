<template>
  <div @click="openObject" class="pa-4">
    <q-card class="object-card" >
      <NftImages :id="props.id" />

      <div class="card-sides flex justify-between" >
        <div class="card-left">
          <q-card-section class="object-card-header" >
            {{ object.title }}
          </q-card-section>

          <q-card-section class="object-card-tags">
            <!-- <Tags /> -->
          </q-card-section>
        </div>
        <div class="card-right">
          <div v-if="marketObject" class="card-right-inner flex flex-col content-end">
            <div class="flex justify-end">
              <Stars :amount="4.9" />
            </div>

            <div class="pieces">
              <FillablePieces :from="pieces.from" :to="pieces.to" />
            </div>
          </div>
        </div>
      </div>

      <slot name="moreData"></slot>

      <q-card-section v-if="priceStr" class="object-card-price flex justify-between">
        <!-- <slot name="buttons">
          <q-btn color="teal" label="Посмотреть" @click="openObject" />
        </slot> -->
        <div class="price">от {{ priceStr }} {{ symbolStr }}</div>
      </q-card-section>
      <!-- <slot v-else name="buttons">
        <q-btn color="teal" label="Посмотреть" @click="openObject" />
      </slot> -->
    </q-card>
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import numeral from 'numeral'
  import { NftObject, NftMarketObject } from 'unicore/ts/src/blockchain/contracts/nft'
  import { useRouter } from 'vue-router'

  import { useNftStore } from '~/stores/nft'
  import Tags from '../common/Tags.vue'
  import Stars from '../common/Stars.vue'
  import FillablePieces from '../common/FillablePieces.vue'
  import NftImages from '../nft/NftImages.vue'

  const props = defineProps<{
    id: number
    marketId?: number
  }>()
  const nftStore = useNftStore()

  const object = computed<NftObject>(() => nftStore.getNftById(props.id))
  const marketId = computed(() => props.marketId as number)
  const marketObject = computed<NftMarketObject>(() => nftStore.getNftMarketById(marketId.value))
  const priceStr = computed(
    () => marketObject.value && numeral(marketObject.value.min_piece_price).format('0,0')
  )
  const symbolStr = computed(
    () => marketObject.value && marketObject.value.min_piece_price.split(' ')[1]
  )
  const router = useRouter()
  const pieces = computed(() => {
    const v = {
      from: 0,
      to: 0,
    }

    if (marketObject.value && object.value) {
      v.from =
        marketObject.value.remain_pieces
      v.to = object.value.total_pieces
    }

    return v
  })

  const openObject = () => {
    router.push({ name: 'lk-estate-id', params: { id: props.marketId } })
  }
</script>

<style lang="scss" scoped>
  .q-card__section {
    padding-left: 2px;
    padding-right: 2px;
  }

  .object-card-header {
    padding-top: 16px;
    padding-bottom: 0;
    font-size: 20px;
    font-weight: 700;
    line-height: 22px;
    letter-spacing: 0;
  }

  .object-card-tags {
    padding-top: 16px;
    padding-bottom: 0;
  }

  .object-card-price {
    padding-top: 22px;
    padding-bottom: 0;

    .q-btn {
      font-size: 14px;
      font-weight: 800;
      line-height: 16px;
      letter-spacing: 0.02em;
      text-align: left;
      text-transform: none;
      padding: 7px 24px;
      border-radius: 4px;
      min-height: 30px;
    }
  }

  .pieces {
    width: 90px;
    margin-top: 21px;
  }

  .card-left {
    width: calc(100% - 90px);
  }

  .card-right {
    width: 90px;

    &-inner {
      padding-top: 17px;
      padding-left: 10px;
    }
  }

  .price {
    font-size: 18px;
    font-weight: 700;
    line-height: 24px;
    letter-spacing: 0;
    color: rgba(24, 24, 24, 1);
    align-self: center;
  }
</style>
