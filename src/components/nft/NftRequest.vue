<template>
  <div :class="$style.requestCard">
    <div :class="[$style.requestCardHeader, CLASSES_BORDER_STATUSES[requestStatus]]">
      <div :class="$style.requestCardTitle">Заявка на покупку {{ nftObject?.title }}</div>
      <div :class="$style.requestCardSubTitle">
        Статус:
        <span :class="CLASSES_COLOR_STATUSES[requestStatus]">
          {{ TEXT_STATUSES[requestStatus] }}
        </span>
      </div>
    </div>
    <div :class="$style.requestCardItems">
      <div v-if="currentUserIsSeller" :class="$style.requestCardItem">
        <div :class="$style.requestCardItemTitle">Покупатель</div>
        <div :class="$style.requestCardItemValue">{{ requestObject.buyer }}</div>
      </div>
      <div v-else :class="$style.requestCardItem">
        <div :class="$style.requestCardItemTitle">Продавец</div>
        <div :class="$style.requestCardItemValue">{{ requestObject.seller }}</div>
      </div>
      <div :class="$style.requestCardItem">
        <div :class="$style.requestCardItemTitle">Частей к покупке</div>
        <div :class="$style.requestCardItemValue">{{ requestObject.requested_pieces }}</div>
      </div>
      <div :class="$style.requestCardItem">
        <div :class="$style.requestCardItemTitle">Цена одной части</div>
        <div :class="$style.requestCardItemValue">{{ requestObject.one_piece_price }}</div>
      </div>
      <div :class="$style.requestCardItem">
        <div :class="$style.requestCardItemTitle">Сумма</div>
        <div :class="$style.requestCardItemValue">{{ requestObject.total_price }}</div>
      </div>
<!--       <div :class="$style.requestCardItem">
        <div :class="$style.requestCardItemTitle">Себестоимость одной части</div>
        <div :class="$style.requestCardItemValue">{{ requestObject.base_piece_price }}</div>
      </div> -->
      <div v-if="requestObject.day_start" :class="$style.requestCardItem">
        <div :class="$style.requestCardItemTitle">День в году начала</div>
        <div :class="$style.requestCardItemValue">{{ requestObject.day_start }}</div>
      </div>
      <div v-if="requestObject.day_finish" :class="$style.requestCardItem">
        <div :class="$style.requestCardItemTitle">День в году окончания</div>
        <div :class="$style.requestCardItemValue">{{ requestObject.day_finish }}</div>
      </div>
      <PersonalDataList
        :container-class="$style.requestCardItem"
        :title-class="$style.requestCardItemTitle"
        :value-class="$style.requestCardItemValue"
        :data-object="requestObject.delivery_to"
        :as-sender="!currentUserIsSeller" />
      <div v-if="!currentUserIsSeller && requestStatus === 'accepted'">
        <div :class="$style.requestCardItemTitle">Инструкция по оплате</div>
        <div :class="$style.requestCardItemValue">{{ config.nft.buyString }}</div>
      </div>
      <div :class="$style.requestCardActions">
        <template v-if="currentUserIsSeller">
          <q-btn v-if="requestStatus === 'waiting'" flat color="green" @click="openAcceptReqPopup">
            Начать
          </q-btn>
          <q-btn v-if="requestStatus === 'confirmed'" flat color="green" @click="issueOpt">
            Выпустить опционы
          </q-btn>
          <q-btn
            v-if="requestStatus === 'accepted' || requestStatus === 'confirmed'"
            flat
            color="red"
            @click="declineReq">
            Отклонить
          </q-btn>
        </template>
        <template v-else>
          <q-btn v-if="requestStatus === 'accepted'" flat color="green" @click="acceptPrice">
            Принять цену
          </q-btn>
          <q-btn v-if="requestStatus === 'issued'" flat color="green" @click="confirm">
            Выкупить
          </q-btn>
          <q-btn v-if="requestStatus === 'waiting'" flat color="red" @click="cancelReq">
            Отменить
          </q-btn>
        </template>
      </div>
    </div>
  </div>

  <q-dialog v-model="openedAcceptReqPopup" persistent>
    <q-card style="max-width: 500px; width: 100vw">
      <q-card-section>
        <div class="text-h6">Начать покупку {{ nftObject?.title }}</div>
      </q-card-section>

      <q-separator />

      <q-card-section style="max-height: 80vh" class="scroll">
        <q-form class="q-gutter-md" @submit="saveAcceptReq">
          <q-input
            v-model.number="newPrice"
            filled
            label="Новая цена объекта (за 1 часть)"
            :min="1"
            type="number"
            required
            :readonly="loading">
            <template #append>
              <q-badge class="q-mr-sm q-ml-sm">{{ basePriceSymbol }}</q-badge>
            </template>
          </q-input>

          <q-input
            v-model.number="dayStart"
            filled
            label="День начала (1-365)"
            :min="1"
            :max="365"
            type="number"
            required
            :readonly="loading" />

          <q-input
            v-model.number="dayFinish"
            filled
            label="День окончания (1-365)"
            :min="1"
            :max="365"
            type="number"
            required
            :readonly="loading" />

          <q-btn
            label="Начать"
            color="primary"
            type="submit"
            :loading="loading"
            :disable="!acceptReqValid" />
        </q-form>
      </q-card-section>

      <q-separator />

      <q-card-actions align="right">
        <q-btn v-close-popup flat label="Отмена" color="secondary" :disable="loading" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
  import { NftObject } from 'unicore/dist/esm/src/blockchain/contracts/nft'
  import { computed, ref, useCssModule } from 'vue'

  import { Notify, useQuasar } from 'quasar'

  import chains from '~/chainsMain'
  import { useNftStore } from '~/stores/nft'
  import { useUserStore } from '~/stores/user'
  import config from '~/config'
  import PersonalDataList from '~/components/nft/PersonalDataList.vue'

  const userStore = useUserStore()
  const nftStore = useNftStore()
  const nftWallet = computed(() => nftStore.nftWallet)
  const $q = useQuasar()

  const props = defineProps<{
    id: number
  }>()

  const $style = useCssModule()

  const CLASSES_BORDER_STATUSES: Record<string, unknown> = {
    waiting: $style.borderLeftYellow,
    accepted: $style.borderLeftGreen,
    confirmed: $style.borderLeftGreen,
    issued: $style.borderLeftGreen,
    declined: $style.borderLeftRed,
    cancelled: $style.borderLeftRed,
    completed: $style.borderLeftGreen,
  }

  const CLASSES_COLOR_STATUSES: Record<string, unknown> = {
    waiting: $style.colorYellow,
    accepted: $style.colorGreen,
    confirmed: $style.colorGreen,
    issued: $style.colorGreen,
    declined: $style.colorRed,
    cancelled: $style.colorRed,
    completed: $style.colorGreen,
  }

  const TEXT_STATUSES: Record<string, unknown> = {
    waiting: 'Создана',
    accepted: 'Принята',
    confirmed: 'Цена принята',
    issued: 'Опционы выпущены',
    declined: 'Отменена оператором',
    cancelled: 'Отменена покупателем',
    completed: 'Завершено',
  }

  const requestObject = computed(() => nftStore.getNftMarketRequestById(props.id))
  const requestStatus = computed(() => requestObject.value.status)
  const marketObject = computed(() => nftStore.getNftMarketById(requestObject.value.market_id))
  const nftObject = computed<NftObject | null>(() =>
    marketObject.value ? nftStore.getNftById(marketObject.value.object_id) : null
  )
  const currentUserIsSeller = computed(() => requestObject.value.seller === userStore.username)
  const onePriceValue = computed(() => {
    const [v] = requestObject.value.one_piece_price.split(' ')
    return v
  })
  const basePriceSymbol = computed(() => {
    const [, v] = requestObject.value.one_piece_price.split(' ')
    return v
  })

  const openedAcceptReqPopup = ref(false)
  const loading = ref(false)
  const newPrice = ref('')
  const newSafePrice = computed(() => Number(newPrice.value) || 0)
  const dayStart = ref(1)
  const dayFinish = ref(1)
  const acceptReqValid = computed(() => newPrice.value && dayStart.value <= dayFinish.value)

  const openAcceptReqPopup = () => {
    openedAcceptReqPopup.value = true
    newPrice.value = onePriceValue.value
    dayStart.value = 1
    dayFinish.value = 1
  }

  const saveAcceptReq = async () => {
    loading.value = true
    const data = {
      seller: userStore.username,
      request_id: requestObject.value.id,
      new_price: newSafePrice.value.toFixed(4) + ' ' + basePriceSymbol.value,
      day_start: dayStart.value,
      day_finish: dayFinish.value,
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
              name: 'acceptreq',
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
        message: 'Покупка начата!',
        color: 'positive',
      })
      await nftStore.loadRequests()
      openedAcceptReqPopup.value = false
    } catch (e: any) {
      console.error(e)
      Notify.create({
        message: e.message,
        color: 'negative',
      })
    }
    loading.value = false
  }

  const declineReq = () => {
    $q.dialog({
      title: 'Отклонить заявку',
      message: 'Вы действительно хотите отколнить заявку?',
      persistent: true,
      ok: 'Да',
      cancel: 'Нет',
    }).onOk(async () => {
      const data = {
        seller: userStore.username,
        request_id: requestObject.value.id,
      }

      console.log(data)
      $q.loading.show()

      try {
        const rootChain = chains.getRootChain()
        const api = rootChain.getEosPassInstance(userStore.authData?.wif as string)

        await api.transact(
          {
            actions: [
              {
                account: rootChain.nftContract.name,
                name: 'declinereq',
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
          message: 'Заявка отклонена',
          color: 'positive',
        })
        await nftStore.loadRequests()
        openedAcceptReqPopup.value = false
      } catch (e: any) {
        console.error(e)
        Notify.create({
          message: e.message,
          color: 'negative',
        })
      }

      $q.loading.hide()
    })
  }

  const acceptPrice = () => {
    $q.dialog({
      title: 'Принять цену',
      message:
        'Вы действительно хотите принять новую цену заявки?\nВы получите инструкцию для оплаты',
      persistent: true,
      ok: 'Да',
      cancel: 'Нет',
    }).onOk(async () => {
      const data = {
        buyer: userStore.username,
        request_id: requestObject.value.id,
      }

      console.log(data)
      $q.loading.show()

      try {
        const rootChain = chains.getRootChain()
        const api = rootChain.getEosPassInstance(userStore.authData?.wif as string)

        await api.transact(
          {
            actions: [
              {
                account: rootChain.nftContract.name,
                name: 'acceptprice',
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
          message: 'Цена принята!',
          color: 'positive',
        })
        await nftStore.loadRequests()
        openedAcceptReqPopup.value = false
      } catch (e: any) {
        console.error(e)
        Notify.create({
          message: e.message,
          color: 'negative',
        })
      }

      $q.loading.hide()
    })
  }

  const cancelReq = () => {
    $q.dialog({
      title: 'Отменить заявку',
      message: 'Вы действительно хотите отменить заявку?',
      persistent: true,
      ok: 'Да',
      cancel: 'Нет',
    }).onOk(async () => {
      const data = {
        buyer: userStore.username,
        request_id: requestObject.value.id,
      }

      console.log(data)
      $q.loading.show()

      try {
        const rootChain = chains.getRootChain()
        const api = rootChain.getEosPassInstance(userStore.authData?.wif as string)

        await api.transact(
          {
            actions: [
              {
                account: rootChain.nftContract.name,
                name: 'cancelreq',
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
          message: 'Цена принята!',
          color: 'positive',
        })
        await nftStore.loadRequests()
        openedAcceptReqPopup.value = false
      } catch (e: any) {
        console.error(e)
        Notify.create({
          message: e.message,
          color: 'negative',
        })
      }

      $q.loading.hide()
    })
  }

  const issueOpt = () => {
    $q.dialog({
      title: 'Выпустить опционы',
      message: 'Вы действительно хотите выпустить опционы для заявки?',
      persistent: true,
      ok: 'Да',
      cancel: 'Нет',
    }).onOk(async () => {
      const data = {
        seller: userStore.username,
        request_id: requestObject.value.id,
      }

      console.log(data)
      $q.loading.show()

      try {
        const rootChain = chains.getRootChain()
        const api = rootChain.getEosPassInstance(userStore.authData?.wif as string)

        await api.transact(
          {
            actions: [
              {
                account: rootChain.nftContract.name,
                name: 'issueoption',
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
          message: 'Опционы выпущены!',
          color: 'positive',
        })
        await nftStore.loadRequests()
        await userStore.getUserBalances()
        openedAcceptReqPopup.value = false
      } catch (e: any) {
        console.error(e)
        Notify.create({
          message: e.message,
          color: 'negative',
        })
      }

      $q.loading.hide()
    })
  }

  const confirm = () => {
    $q.dialog({
      title: 'Выкупить объект',
      message: 'Вы действительно хотите выкупить объект?',
      persistent: true,
      ok: 'Да',
      cancel: 'Нет',
    }).onOk(async () => {
      const data = {
        buyer: requestObject.value.buyer,
        request_id: requestObject.value.id,
      }

      console.log(data)

      $q.loading.show()

      try {
        const rootChain = chains.getRootChain()
        const api = rootChain.getEosPassInstance(userStore.authData?.wif as string)

        const transferData = {
          from: userStore.username as string,
          to: rootChain.nftContract.name,
          quantity: requestObject.value.total_price,
          memo: userStore.username as string,
        }

        await api.transact(
          {
            actions: [
              {
                account: nftWallet.value.contract,
                name: 'transfer',
                authorization: [
                  {
                    actor: userStore.username as string,
                    permission: 'active',
                  },
                ],
                data: transferData,
              },
              {
                account: rootChain.nftContract.name,
                name: 'confirm',
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
          message: 'Объект выкуплен!',
          color: 'positive',
        })
        await nftStore.loadRequests()
        await userStore.getUserBalances()
        openedAcceptReqPopup.value = false
      } catch (e: any) {
        console.error(e)
        Notify.create({
          message: e.message,
          color: 'negative',
        })
      }

      $q.loading.hide()
    })
  }
</script>

<style module>
  .requestCard {
    box-shadow: none;
    background-color: #fff;
    padding-top: 14px;
    padding-bottom: 16px;
    border-radius: 10px;
  }

  .requestCardHeader {
    border-left: 10px solid #607d8b;
    padding-left: 10px;
    padding-right: 20px;
  }

  .requestCardTitle {
    font-size: 18px;
    font-weight: 700;
    line-height: 24px;
    letter-spacing: 0;
    text-align: left;
    margin-bottom: 5px;
  }

  .requestCardSubTitle {
    font-size: 14px;
    font-weight: 400;
    line-height: 18px;
    letter-spacing: 0;
    text-align: left;
  }

  .borderLeftGreen {
    border-left-color: #3ac922;
  }

  .borderLeftYellow {
    border-left-color: #f7d523;
  }

  .borderLeftRed {
    border-left-color: #ff3030;
  }

  .colorGreen {
    color: #3ac922;
  }

  .colorYellow {
    color: #f7d523;
  }

  .colorRed {
    color: #ff3030;
  }

  .requestCardItems {
    padding: 20px 20px 0 20px;
  }

  .requestCardItem {
    padding: 5px 0;
  }

  .requestCardItem + .requestCardItem {
    border-top: 1px solid #d7d7d7;
  }

  .requestCardItemTitle {
    font-style: normal;
    font-weight: 400;
    font-size: 12px;
    line-height: 16px;
    color: #747474;
    margin-bottom: 5px;
  }

  .requestCardItemValue {
    font-style: normal;
    font-weight: 700;
    font-size: 14px;
    line-height: 18px;
    color: #5c5c5c;
  }

  .requestCardActions {
  }
</style>
