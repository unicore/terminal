<template>
  <q-card>
    <q-card-section class="text-white" :class="CLASSES_STATUSES[requestStatus] || 'bg-primary'">
      <div class="text-h6">Заявка на покупку {{ nftObject?.title }}</div>
      <div class="text-subtitle2">Статус: {{ TEXT_STATUSES[requestStatus] }}</div>
    </q-card-section>
    <q-list>
      <q-item v-if="currentUserIsSeller">
        <q-item-section>
          <q-item-label>Покупатель</q-item-label>
          <q-item-label caption>{{ requestObject.buyer }}</q-item-label>
        </q-item-section>
      </q-item>
      <q-item v-else>
        <q-item-section>
          <q-item-label>Продавец</q-item-label>
          <q-item-label caption>{{ requestObject.seller }}</q-item-label>
        </q-item-section>
      </q-item>
      <q-item>
        <q-item-section>
          <q-item-label>Частей к покупке</q-item-label>
          <q-item-label caption>{{ requestObject.requested_pieces }}</q-item-label>
        </q-item-section>
      </q-item>
      <q-item>
        <q-item-section>
          <q-item-label>Цена одной части</q-item-label>
          <q-item-label caption>{{ requestObject.one_piece_price }}</q-item-label>
        </q-item-section>
      </q-item>
      <q-item>
        <q-item-section>
          <q-item-label>Сумма</q-item-label>
          <q-item-label caption>{{ requestObject.total_price }}</q-item-label>
        </q-item-section>
      </q-item>
      <q-item>
        <q-item-section>
          <q-item-label>Себестоимость одной части</q-item-label>
          <q-item-label caption>{{ requestObject.base_piece_price }}</q-item-label>
        </q-item-section>
      </q-item>
      <q-item v-if="requestObject.day_start">
        <q-item-section>
          <q-item-label>День в году начала</q-item-label>
          <q-item-label caption>{{ requestObject.day_start }}</q-item-label>
        </q-item-section>
      </q-item>
      <q-item v-if="requestObject.day_finish">
        <q-item-section>
          <q-item-label>День в году окончания</q-item-label>
          <q-item-label caption>{{ requestObject.day_finish }}</q-item-label>
        </q-item-section>
      </q-item>
      <q-item>
        <q-item-section>
          <q-item-label>Себестоимость одной части</q-item-label>
          <q-item-label caption>{{ requestObject.base_piece_price }}</q-item-label>
        </q-item-section>
      </q-item>
      <q-item v-for="(d, i) in requestObject.delivery_to" :key="`${i}_${d.placeholder}`">
        <q-item-section>
          <q-item-label>{{ d.placeholder }}</q-item-label>
          <q-item-label caption>{{ d.value }}</q-item-label>
        </q-item-section>
      </q-item>
      <q-item v-if="!currentUserIsSeller && requestStatus === 'accepted'">
        <q-item-section>
          <q-item-label>Инструкция по оплате</q-item-label>
          <q-item-label caption>{{ config.nft.buyString }}</q-item-label>
        </q-item-section>
      </q-item>
    </q-list>
    <q-card-actions>
      <template v-if="currentUserIsSeller">
        <q-btn v-if="requestStatus === 'waiting'" flat color="green" @click="openAcceptReqPopup">
          Начать
        </q-btn>
        <q-btn v-if="requestStatus === 'confirmed'" flat color="green" @click="issueOpt">
          Выпустить опционы
        </q-btn>
        <q-btn v-if="requestStatus === 'issued'" flat color="green" @click="confirm">
          Выкупить
        </q-btn>
        <q-btn
          v-if="
            requestStatus !== 'declined' &&
            requestStatus !== 'cancelled' &&
            requestStatus !== 'completed'
          "
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
        <q-btn v-if="requestStatus === 'waiting'" flat color="red" @click="cancelReq">
          Отменить
        </q-btn>
      </template>
    </q-card-actions>
  </q-card>

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
  import { NftObject } from 'unicore/dist/src/blockchain/contracts/nft'
  import { computed, ref } from 'vue'
  import { Notify, useQuasar } from 'quasar'

  import chains from '~/chainsMain'
  import { useNftStore } from '~/stores/nft'
  import { useUserStore } from '~/stores/user'
  import config from '~/config'

  const userStore = useUserStore()
  const nftStore = useNftStore()
  const $q = useQuasar()

  const props = defineProps<{
    id: number
  }>()

  const CLASSES_STATUSES: Record<string, unknown> = {
    waiting: 'bg-primary',
    accepted: 'bg-orange',
    confirmed: 'bg-red',
    issued: 'bg-yellow-10',
    declined: 'bg-blue-grey',
    cancelled: 'bg-blue-grey',
    completed: 'bg-green',
  }

  const TEXT_STATUSES: Record<string, unknown> = {
    waiting: 'создана',
    accepted: 'принята',
    confirmed: 'цена принята',
    issued: 'опционы выпущены',
    declined: 'отменена оператором',
    cancelled: 'отменена покупателем',
    completed: 'завершено',
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

<style lang="scss" scoped></style>
