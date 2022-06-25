<template>
  <q-btn color="red" label="Удалить NFT" @click="open" />

  <q-dialog v-model="opened" persistent>
    <q-card>
      <q-card-section class="row items-center">
        <q-avatar icon="delete" color="red" text-color="white" />
        <span class="q-ml-sm">Вы действительно хотите удалить {{ object.title }}?</span>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn
          v-close-popup
          flat
          label="Нет"
          color="primary"
          :loading="loading"
          @click="opened = false" />
        <q-btn v-close-popup flat label="Да" color="red" :loading="loading" @click="remove" />
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
  }>()
  const nftStore = useNftStore()

  const object = computed<NftObject>(() => nftStore.getNftById(props.id))

  const opened = ref(false)
  const loading = ref(false)
  const userStore = useUserStore()

  const open = () => {
    opened.value = true
  }

  const remove = async () => {
    loading.value = true
    const data = {
      creator: userStore.username,
      object_id: object.value.id,
    }

    try {
      const rootChain = chains.getRootChain()
      const api = rootChain.getEosPassInstance(userStore.authData?.wif as string)

      await api.transact(
        {
          actions: [
            {
              account: rootChain.nftContract.name,
              name: 'remove',
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
        message: `Объект ${object.value.title} удалён`,
        color: 'positive',
      })
      await nftStore.removeNft(props.id)
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
