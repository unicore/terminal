<template>
  <div v-if="isLoading" class="pa-4 flex justify-center">
    <q-circular-progress indeterminate size="50px" color="teal" />
  </div>
  <div v-else class="">
    <q-card class="object-card flex justify-between">
      <div class="card-left">
        <div>
          <NftImages :id="object.id" no-rounded height="380px" style="margin: 0 -16px 0 -25px" />
          <div class="pa-4">
            <q-card-section class="object-card-header">
              #{{ marketId }} {{ object.title }}
            </q-card-section>
            
            <div class="flex flex-row justify-between q-pb-md">
              <div class="pieces-mobile">
                <FillablePieces :from="pieces.from" :to="pieces.to" />
              </div>
              <div class="flex justify-end">
                <Stars :amount="4.9" />
              </div>
            </div>
          </div>
        </div>
        <q-card-section class="object-card-price">
          <div>от {{ priceStr }} {{ symbolStr }}</div>
        </q-card-section>

        <q-card-section class="object-card-buy">
          <NftMarketBuy :id="marketId" />
        </q-card-section>        
        
        <q-card-section
        
          <Markdown v-if="description.full" :text="description.full" />
        </q-card-section>

        <q-card-section class="object-card-tags">
          <!-- <Tags /> -->
        </q-card-section>
      </div>
    </q-card>
  </div>
</template>

<script setup lang="ts">
  import { computed, onMounted, ref, watch } from 'vue'
  import { useRoute } from 'vue-router'
  import { NftObject, NftMarketObject } from 'unicore/ts/src/blockchain/contracts/nft'
  import { useNftStore } from '~/stores/nft'
  import Markdown from '~/components/common/Markdown.vue'
  import Stars from '~/components/common/Stars.vue'
  import FillablePieces from '~/components/common/FillablePieces.vue'
  import Tags from '~/components/common/Tags.vue'
  import NftImages from '~/components/nft/NftImages.vue'
  import NftMarketBuy from '~/components/nft/NftMarketBuy.vue'
  import PinIcon from '~/assets/pin.svg'
  import numeral from 'numeral'

  const nftStore = useNftStore()
  const route = useRoute()
  const localLoading = ref(true)
  const marketId = computed(() => Number(route.params.id))
  const isLoading = computed(() => nftStore.loading || localLoading.value)
  const center = ref([40, 40])
  const projection = ref('EPSG:4326')
  const zoom = ref(8)
  const rotation = ref(0)

  const loadObjects = async () => {
    await nftStore.loadMarketNftById(marketId.value)
    localLoading.value = false
  }

  onMounted(() => {
    loadObjects()
  })

  const marketObject = computed<NftMarketObject>(
    () => nftStore.getNftMarketById(marketId.value) || {}
  )
  const object = computed<NftObject>(() => nftStore.getNftById(marketObject.value.object_id) || {})

  const priceStr = computed(() => numeral(marketObject.value.min_piece_price).format('0,0'))
  const symbolStr = computed(() => marketObject.value.min_piece_price.split(' ')[1])

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

  const description = computed(() => {
    let descriptionObject = {
      short: '',
      full: object.value.description,
    }

    try {
      descriptionObject = JSON.parse(object.value.description)
    } catch (e) {
      // do nothing
    }
    return descriptionObject
  })

  const pinCenter = computed(() => {
    const gps = String(object.value.meta?.gps || '')
    if (!gps) {
      return null
    }
    const parts = gps.split(',').map(Number)
    if (!parts) {
      return null
    }
    return [parts[1], parts[0]]
  })

  watch(pinCenter, () => {
    if (pinCenter.value) {
      center.value = pinCenter.value
      zoom.value = 16
    }
  })
</script>

<style lang="scss" scoped>
  .object-card {
    box-shadow: 0 5px 10px 0 rgba(132, 132, 132, 0.2);
    
    & + &:not(.address-card) {
      margin-top: 24px;
    }
  }

  .object-card-header {
    padding-top: 16px;
    padding-bottom: 15px;
    font-size: 24px;
    font-weight: 800;
    line-height: 30px;
    letter-spacing: 0;
    text-align: left;
  }

  .object-card-small-header {
    padding-top: 0;
    padding-bottom: 5px;
    font-style: normal;
    font-weight: 600;
    font-size: 24px;
    line-height: 130%;
    text-align: left;
  }

  .object-card-subheader {
    padding-top: 0;
    font-size: 18px;
    font-weight: 400;
    line-height: 24px;
    letter-spacing: 0;
    text-align: left;
    color: #8a8a8a;
  }

  .object-card-description {
    padding-bottom: 0;
    font-style: normal;
    font-weight: 400;
    line-height: 110.02%;

    color: #000000;

    padding-top: 11px;

    > div + div {
      margin-top: 10px;
    }
  }

  .object-card-price {
    padding-top: 0;
    padding-bottom: 10px;
    font-style: normal;
    font-weight: 700;
    font-size: 20px;
    line-height: 110.02%;
    color: #181818;
  }

  .card-right {
    width: 546px;
    text-align: right;
    padding-top: 16px;
    padding-left: 106px;
    position: relative;
  }

  .card-images {
    padding-bottom: 16px;
  }

  .reviews-count {
    font-style: normal;
    font-weight: 400;
    font-size: 14px;
    line-height: 110.02%;
    color: #a4a4a4;
    padding-top: 12px;
  }

  .card-right-bottom {
    text-align: right;
    padding-right: 53px;
  }

  .object-card-tags {
    padding-top: 38px;
    padding-bottom: 10px;
  }

  .object-card-address {
    img {
      display: inline-block;
      margin-right: 14px;
      vertical-align: bottom;
    }
  }

  .object-card-buy {
    padding-top: 0;
  }

  .map {
    border-radius: 10px !important;
    border: 1px solid rgba(230, 231, 233, 1);
    overflow: hidden;
  }

  .field {
    height: 166px;

    background: #ffffff;
    border: 1px solid #d8d8d8;
    border-radius: 25px !important;
    margin-bottom: 13px;
    margin-top: 16px;
  }

  .field-review {
    border-bottom: 1px solid #c2c2c2 !important;
    padding-bottom: 32px;
    border-radius: 0 !important;
  }

  .left-card {
  }

  .right-card {
    width: 390px;
  }

  .second-row {
    margin-top: 8px;
  }

  .pieces {
    width: 90px;
    margin-top: 27px;
  }

  .images-left {
    position: absolute;
    top: 16px;
    left: 0;
  }
</style>

<route lang="yaml">
meta:
  hide: true
  allowNonAuth: true
</route>
