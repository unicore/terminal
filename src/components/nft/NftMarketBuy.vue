<template>
  <q-btn
    v-if="marketObject.remain_pieces > 0 && !props.readmore"
    class="buy-btn"
    dialog
    color="teal"
    label="Подать заявку"
    :disable="!userStore.hasAuth"
    @click="showDialog = true" />
  <q-btn v-if="props.readmore" dialog color="teal" label="Подробнее" disable />
  <q-dialog v-model="showDialog" persistent>
    <q-card class="main-card">
      <q-card-section class="card-section-as-header">
        <div class="text-h6 card-header">Подать заявку</div>
      </q-card-section>

      <q-card-section class="card-section flex stretch">
        <div class="card-section-header">Объект</div>
        <div class="card-section-value card-section-value-big card-section-value-blue">
          {{ object.title }}
        </div>
      </q-card-section>

      <q-card-section class="card-section flex content-stretch">
        <div class="card-section-header">
          Частей к покупке
          <div class="card-section-subheader">
            Минимальная цена:
            <div class="card-section-value-blue">{{ priceStr }} {{ symbolStr }} за одну часть</div>
          </div>
        </div>
        <div class="card-section-value self-stretch col row q-col-gutter-md">
          <div class="col-12 col-md-6">
            <q-input
              v-if="marketObject.remain_pieces > 1"
              v-model="piecesToBuy"
              outlined
              bg-color="grey-11"
              dense
              min="1"
              :max="marketObject.remain_pieces"
              type="number"
              required
              :readonly="loading" />
          </div>
          <div class="col-12 col-md-6 self-center sub-col-right">
            доступно: {{ t('numbers.piece', marketObject.remain_pieces) }}
          </div>
        </div>
      </q-card-section>

      <q-card-section class="card-section flex content-stretch">
        <div class="card-section-header">Личные данные</div>
        <div class="card-section-value self-stretch col">
          <q-input
            v-for="(da, i) in deliveryAnswers"
            :key="`${da.placeholder}_${i}`"
            v-model="da.value"
            class="q-mb-md"
            outlined
            dense
            stack-label
            bg-color="grey-11"
            :label="da.placeholder"
            type="text"
            required
            :readonly="loading" />
        </div>
      </q-card-section>

      <q-card-actions align="right" class="card-buttons">
        <q-btn v-close-popup flat label="Отменить" color="grey" :disabled="loading" />
        <q-btn label="Создать заявку" color="teal" :disabled="loading" @click="createRequest" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
  import { computed, ref, watch } from 'vue'
  import { useRouter } from 'vue-router'
  import { Notify } from 'quasar'
  import { NftMarketObject, NftObject } from 'unicore/ts/src/blockchain/contracts/nft'

  import { useUserStore } from '~/stores/user'
  import { useNftStore } from '~/stores/nft'
  import chains from '~/chainsMain'
  import { useI18n } from 'vue-i18n'
  import numeral from 'numeral'

  const userStore = useUserStore()
  const showDialog = ref(false)
  const loading = ref(false)
  const piecesToBuy = ref('1')
  const deliveryAnswers = ref<any>([])
  const router = useRouter()
  const { t } = useI18n()

  const props = defineProps<{
    id: number
    readmore?: boolean
  }>()
  const nftStore = useNftStore()

  const marketObject = computed<NftMarketObject>(() => nftStore.getNftMarketById(props.id))
  const object = computed<NftObject>(() => nftStore.getNftById(marketObject.value.object_id))
  const currentUserIsSeller = computed<boolean>(
    () => marketObject.value.seller === userStore.username
  )
  const priceStr = computed(() => numeral(marketObject.value.min_piece_price).format('0,0'))
  const symbolStr = computed(() => marketObject.value.min_piece_price.split(' ')[1])

  const makeDeliveryAnswers = () => {
    deliveryAnswers.value =
      marketObject.value.meta.delivery_request?.map((dr) => ({
        ...dr,
        value: '',
      })) || []
  }

  watch(
    () => showDialog.value,
    () => makeDeliveryAnswers()
  )

  const createRequest = async () => {
    loading.value = true
    const data = {
      buyer: userStore.username,
      market_id: marketObject.value.id,
      requested_pieces: piecesToBuy.value,
      delivery_to: JSON.stringify({
        personalDataId: null,
      }),
      meta: '{}',
    }

    const personalData = JSON.stringify({
      rows: deliveryAnswers.value,
    })


    try {
      const rootChain = chains.getRootChain()

      const { id: personalDataId } = await rootChain.sendPersonalData(
        userStore.authData?.wif as string,
        userStore.username as string,
        marketObject.value.seller,
        personalData
      )

      data.delivery_to = JSON.stringify({
        personalDataId,
      })

      const api = rootChain.getEosPassInstance(userStore.authData?.wif as string)

      await api.transact(
        {
          actions: [
            {
              account: rootChain.nftContract.name,
              name: 'buy',
              authorization: [
                {
                  actor: userStore.username as string,
                  permission: 'active',
                },
              ],
              data: data,
            },
          ],
        },
        {
          blocksBehind: 3,
          expireSeconds: 30,
        }
      )

      Notify.create({
        message: `Создана заявка на покупку ${object.value.title}`,
        color: 'positive',
      })
      await nftStore.loadAvailableNfts()
      router.push({ name: 'lk-NftMyRequests' })
      showDialog.value = false
    } catch (e: any) {
      console.error(e)
      Notify.create({
        message: e.message,
        color: 'negative',
      })
    }
    loading.value = false
  }
</script>

<style lang="scss" scoped>
  .buy-btn {
    text-transform: none;
    border-radius: 4px;
    padding: 12px 24px;
    font-size: 14px;
    font-weight: 800;
    line-height: 16px;
    letter-spacing: 0.02em;
    text-align: left;
  }

  .card-header {
    font-style: normal;
    font-weight: 800;
    font-size: 24px;
    line-height: 30px;
    color: #181818;
  }

  .card-section-header {
    font-style: normal;
    font-weight: 700;
    font-size: 18px;
    line-height: 24px;
    color: #181818;
    max-width: 190px;
    width: 100%;
  }

  .card-section-value {
    &.row {
      height: 72px;
    }
    color: #181818;
  }

  .card-section-value-big {
    font-weight: 700;
    font-size: 18px;
    line-height: 24px;
  }

  .card-section-subheader {
    padding-top: 16px;
    font-weight: 400;
    font-size: 12px;
    line-height: 16px;
    color: #8a8a8a;
  }

  .card-section-value-blue {
    color: #096872;
  }

  .main-card {
    max-width: 650px;
    width: 100%;
  }

  .card-section-as-header {
    padding-top: 25px;
    padding-left: 20px;
    padding-bottom: 2px;
  }

  .card-section {
    padding: 30px 40px 30px 20px;

    & + & {
      border-top: 1px solid #ededed;
    }
  }

  .sub-col-right {
    padding-top: 0;
    font-weight: 400;
    font-size: 14px;
    line-height: 18px;
    color: #8a8a8a;
  }

  .card-buttons {
    padding-right: 20px;
    padding-bottom: 37px;

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
</style>
