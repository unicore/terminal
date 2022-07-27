<template>
  <q-btn color="primary" label="продать" @click="open" />

  <q-dialog v-model="opened" persistent>
    <q-card style="max-width: 500px; width: 100vw">
      <q-card-section>
        <div class="text-h6">
          Выставить <span class="text-light-green-10">{{ object.title }}</span> на продажу
        </div>
      </q-card-section>

      <q-separator />

      <q-card-section style="max-height: 80vh" class="scroll">
        <q-form class="q-gutter-md" @submit="save">
          <q-input
            v-model="basePrice"
            filled
            label="Себестоимость"
            min="1"
            type="number"
            required
            :readonly="loading">
            <template #append>
              <q-badge class="q-mr-sm q-ml-sm">{{ rootChain.coreSymbol }}</q-badge>
            </template>
          </q-input>

          <q-input
            v-model="minPrice"
            filled
            label="Минимальная цена"
            min="1"
            type="number"
            required
            :readonly="loading">
            <template #append>
              <q-badge class="q-mr-sm q-ml-sm">{{ rootChain.coreSymbol }}</q-badge>
            </template>
          </q-input>

          <q-input
            v-if="object.total_pieces > 1"
            v-model="piecesToSell"
            filled
            label="Сколько частей выставляем на продажу"
            min="1"
            :max="maxPieces"
            type="number"
            required
            :readonly="loading">
            <template #append>
              <q-badge class="q-mr-sm q-ml-sm">доступно: {{ maxPieces }}</q-badge>
            </template>
          </q-input>

          <q-input
            v-model="deliveryFrom"
            filled
            label="Откуда производится доставка" />

          <q-card class="q-pa-md">
            <h6>Запросить у покупателя</h6>
            <div v-for="q in deliveryFromQuestions" :key="q.id" class="flex">
              <q-btn icon="delete" color="primary" flat size="md" @click="remove(q)" />
              <q-input v-model="q.placeholder" dense filled t label="Запрос" />
            </div>
            <q-btn icon="add" @click="plus" />
          </q-card>

          <q-btn
            label="Продать"
            color="primary"
            type="submit"
            :loading="loading"
            :disable="!basePrice || !minPrice || (!piecesToSell && object.total_pieces > 1)" />
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
  import { ref, computed } from 'vue'
  import { Notify } from 'quasar'
  import { NftObject } from 'unicore/ts/src/blockchain/contracts/nft'

  import { useUserStore } from '~/stores/user'
  import { useNftStore } from '~/stores/nft'
  import chains from '~/chainsMain'

  const props = defineProps<{
    id: number
    remainPieces?: number
  }>()
  const nftStore = useNftStore()

  const object = computed<NftObject>(() => nftStore.getNftById(props.id))
  const rootChain = chains.getRootChain()

  const maxPieces = computed(() => {
    if (!Number.isNaN(props.remainPieces)) {
      return props.remainPieces
    }

    return object.value.total_pieces
  })
  const opened = ref(false)
  const loading = ref(false)
  const deliveryFrom = ref('')
  const basePrice = ref('')
  const minPrice = ref('')
  const piecesToSell = ref('')
  const userStore = useUserStore()
  let idCounter = 4
  const deliveryFromQuestions = ref([
    { type: 'text', placeholder: 'Фамилия', id: 1 },
    { type: 'text', placeholder: 'Имя', id: 2 },
    { type: 'text', placeholder: 'Отчество', id: 3 },
    { type: 'text', placeholder: 'Телефон', id: 4 },
  ])
  const plus = () => {
    deliveryFromQuestions.value = [
      ...deliveryFromQuestions.value,
      { type: 'text', placeholder: '', id: ++idCounter },
    ]
  }
  const remove = (origQ: any) => {
    deliveryFromQuestions.value = deliveryFromQuestions.value.filter((q) => q.id !== origQ.id)
  }

  const baseSafePrice = computed(() => Number(basePrice.value) || 0)
  const minSafePrice = computed(() => Number(minPrice.value) || 0)
  const safePiecesToSell = computed(() => Number(piecesToSell.value) || 1)

  const totalSum = computed(
    () => `${(baseSafePrice.value * safePiecesToSell.value).toFixed(4)} ${rootChain.coreSymbol}`
  )

  const open = () => {
    opened.value = true
  }

  const save = async () => {
    loading.value = true
    const data = {
      seller: userStore.username,
      object_id: object.value.id,
      pieces_to_sell: piecesToSell.value,
      token_contract: 'eosio.token',
      base_piece_price: baseSafePrice.value.toFixed(4) + ' ' + rootChain.coreSymbol,
      min_piece_price: minSafePrice.value.toFixed(4) + ' ' + rootChain.coreSymbol,
      meta: JSON.stringify({
        delivery_request: deliveryFromQuestions.value.map((q) => ({
          type: q.type,
          placeholder: q.placeholder,
        })),
      }),
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
              name: 'sell',
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
        message: `Объект ${object.value.title} выставлен на продажу`,
        color: 'positive',
      })
      await nftStore.loadAvailableNfts()
      opened.value = false
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

<style lang="scss" scoped></style>
