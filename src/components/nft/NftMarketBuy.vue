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
    <q-card>
      <q-card-section>
        <div class="text-h6">Информация о покупке</div>
      </q-card-section>

      <q-card-section class="q-pt-none text-left">
        <div class="q-mb-md">Объект: {{ object.title }}</div>

        <q-badge size="lg" color="teal" style="font-size: 14px" class="q-pa-sm">
          Минимальная цена: {{ marketObject.min_piece_price }} за одну часть
        </q-badge>

        <q-input
          v-if="marketObject.remain_pieces > 1"
          v-model="piecesToBuy"
          class="q-mt-md"
          filled
          label="Частей к покупке"
          min="1"
          :max="marketObject.remain_pieces"
          type="number"
          required
          :readonly="loading">
          <template #append>
            <q-badge class="q-mr-sm q-ml-sm">доступно: {{ marketObject.remain_pieces }}</q-badge>
          </template>
        </q-input>

        <q-input
          v-for="(da, i) in deliveryAnswers"
          :key="`${da.placeholder}_${i}`"
          v-model="da.value"
          class="q-mt-md"
          filled
          :label="da.placeholder"
          type="text"
          required
          :readonly="loading" />
      </q-card-section>

      <q-card-actions align="right">
        <q-btn v-close-popup flat label="Отмена" color="secondary" :disabled="loading" />
        <q-btn label="Создать заявку" color="primary" :disabled="loading" @click="createRequest" />
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

  const userStore = useUserStore()
  const showDialog = ref(false)
  const loading = ref(false)
  const piecesToBuy = ref('1')
  const deliveryAnswers = ref<any>([])
  const router = useRouter()

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
      delivery_to: JSON.stringify(deliveryAnswers.value),
      meta: '{}',
    }

    console.log(data)

    try {
      const rootChain = chains.getRootChain()
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
</style>
