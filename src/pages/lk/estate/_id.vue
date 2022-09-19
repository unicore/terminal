<template>
  <div v-if="isLoading" class="pa-4 flex justify-center">
    <q-circular-progress indeterminate size="50px" color="teal" />
  </div>
  <div v-else class="pa-4">
    <q-card class="object-card flex justify-between">
      <div class="card-left">
        <q-card-section class="object-card-header">
          {{ object.title }}
        </q-card-section>
        <q-card-section class="object-card-subheader"> #{{ marketId }} </q-card-section>
        <div class="mobile-only">
          <NftImages :id="object.id" no-rounded height="380px" style="margin: 0 -16px 0 -25px" />

          <div class="flex flex-row justify-between q-py-md">
            <div class="pieces-mobile">
              <FillablePieces
                :from="marketObject.blocked_pieces"
                :to="marketObject.remain_pieces + marketObject.blocked_pieces" />
            </div>
            <div class="flex justify-end">
              <Stars :amount="4.9" />
            </div>
          </div>
        </div>

        <q-card-section
          v-if="description.short || description.full"
          class="object-card-description">
          <div v-if="description.short">{{ description.short }}</div>

          <Markdown v-if="description.full" :text="description.full" />
        </q-card-section>

        <q-card-section class="object-card-tags">
          <Tags />
        </q-card-section>

        <q-card-section class="object-card-price">
          <div>от {{ priceStr }} {{ symbolStr }}</div>
        </q-card-section>

        <q-card-section class="object-card-buy">
          <NftMarketBuy :id="marketId" />
        </q-card-section>
      </div>
      <div class="card-right desktop-only">
        <div class="images-left flex flex-col content-end">
          <div class="flex justify-end">
            <Stars :amount="4.9" />
          </div>
          <div class="pieces">
            <FillablePieces
              :from="marketObject.blocked_pieces"
              :to="marketObject.remain_pieces + marketObject.blocked_pieces" />
          </div>
        </div>
        <div class="card-images">
          <NftImages :id="object.id" height="380px" />
        </div>
      </div>
    </q-card>
    <div class="row q-col-gutter-lg second-row">
      <div class="col-xs-12 col-7">
        <q-card class="object-card">
          <q-card-section class="object-card-small-header"> Отзывы </q-card-section>
          <div class="field-review">
            <div class="field"></div>
            <div class="text-right">
              <q-btn color="teal" label="Оставить отзыв" />
            </div>
          </div>
        </q-card>
      </div>
      <div class="col-xs-12 col-5">
        <q-card v-if="object.meta.address" class="object-card address-card col-4">
          <q-card-section class="object-card-small-header"> Адрес </q-card-section>
          <q-card-section class="object-card-address">
            <img :src="PinIcon" alt="" /> {{ object.meta.address }}
          </q-card-section>

          <div class="map">
            <ol-map
              :load-tiles-while-animating="true"
              :load-tiles-while-interacting="true"
              style="height: 270px">
              <ol-view
                ref="view"
                :center="center"
                :rotation="rotation"
                :zoom="zoom"
                :projection="projection" />

              <ol-tile-layer>
                <ol-source-osm />
              </ol-tile-layer>

              <ol-vector-layer>
                <ol-source-vector>
                  <ol-feature>
                    <ol-geom-point v-if="pinCenter" :coordinates="pinCenter"></ol-geom-point>
                    <ol-style>
                      <ol-style-stroke color="red" :width="2"></ol-style-stroke>
                      <ol-style-fill color="rgba(255,255,255,0.1)"></ol-style-fill>
                      <ol-style-icon :src="PinIcon" :scale="1.5"></ol-style-icon>
                    </ol-style>
                  </ol-feature>
                </ol-source-vector>
              </ol-vector-layer>
            </ol-map>
          </div>
        </q-card>
      </div>
    </div>
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
    padding: 15px 15px 15px 25px;

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
    padding-bottom: 15px;
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
    font-size: 14px;
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
    padding-left: 96px;
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
    width: 70px;
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
