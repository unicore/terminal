<template>
  <q-btn
    v-if="object.blocked_pieces === 0 && userStore.username === object.seller"
    dialog
    color="grey"
    label="Отменить продажу"
    @click="cancel" />
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { Notify, useQuasar } from 'quasar'
  import { NftMarketObject } from 'unicore/ts/src/blockchain/contracts/nft'

  import { useUserStore } from '~/stores/user'
  import { useNftStore } from '~/stores/nft'
  import chains from '~/chainsMain'

  const userStore = useUserStore()
  const $q = useQuasar()

  const props = defineProps<{
    id: number
  }>()
  const nftStore = useNftStore()
  const object = computed<NftMarketObject>(() => nftStore.getNftMarketById(props.id))

  const cancel = async () => {
    $q.dialog({
      title: 'Отмена продажи',
      message: 'Вы действительно хотите отменить продажу?',
      persistent: true,
      ok: 'Да',
      cancel: 'Нет',
    }).onOk(async () => {
      $q.loading.show()

      const data = {
        seller: userStore.username,
        market_id: props.id,
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
                name: 'cancelsell',
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
          message: 'Продажа отменена!',
          color: 'positive',
        })
        await nftStore.loadAvailableNfts()
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
