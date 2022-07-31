<template>
  <div>
    <q-btn color="teal" size="md" @click="open">Создать</q-btn>

    <q-dialog v-model="opened" persistent>
      <q-card style="max-width: 500px; width: 100vw">
        <q-card-section>
          <div class="text-h6">Создание NFT</div>
        </q-card-section>

        <q-separator />

        <q-card-section style="max-height: 80vh" class="scroll">
          <q-form class="q-gutter-md" @submit="save">
            <q-input
              v-model="nftObject.title"
              filled
              label="Заголовок"
              required
              :readonly="loading" />

            <q-uploader
              class="full-width q-pl-md"
              multiple
              flat
              auto-upload
              label="Изображения"
              :url="config.uploadUrl"
              :max-file-size="104857600"
              :readonly="loading"
              @removed="removed"
              @uploaded="uploaded" />

            <q-input
              v-model="nftObject.description"
              placeholder="Описание"
              type="textarea"
              rows="5"
              filled
              :readonly="loading" />

            <div style="align-items: center" class="row bg-light-blue-1">
              <div class="col-12">
                <q-input
                  v-if="nftObject.pieced"
                  v-model="nftObject.total_pieces"
                  class="full-width"
                  type="number"
                  min="1"
                  placeholder="Сколько частей у NFT"
                  :readonly="loading"
                  filled />
              </div>
            </div>

            <q-btn label="Сохранить" color="primary" type="submit" :loading="loading" />
          </q-form>
        </q-card-section>

        <q-separator />

        <q-card-actions align="right">
          <q-btn v-close-popup flat label="Отмена" color="secondary" :disable="loading" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue'
  import { Notify } from 'quasar'

  import { useUserStore } from '~/stores/user'
  import { useNftStore } from '~/stores/nft'
  import chains from '~/chainsMain'
  import config from '~/config'

  const opened = ref(false)
  const loading = ref(false)
  const userStore = useUserStore()
  const nftStore = useNftStore()
  const categories = ref([{ id: 'property', title: 'Недвижимость' }])

  const makeNftObject = () => ({
    title: '',
    category: categories.value[0].id,
    description: '',
    images: [] as string[],
    pieced: true,
    total_pieces: '',
  })

  const nftObject = ref(makeNftObject())

  const open = () => {
    opened.value = true
    nftObject.value = makeNftObject()
  }

  const save = async () => {
    loading.value = true
    const data = {
      creator: userStore.username,
      lang: 'ru',
      title: nftObject.value.title,
      description: nftObject.value.description,
      category: nftObject.value.category,
      images: JSON.stringify(nftObject.value.images),
      ipns: nftObject.value.ipns,
      meta: '{}',
      total_pieces: nftObject.value.pieced ? nftObject.value.total_pieces || 1 : 1,
    }

    try {
      const rootChain = chains.getRootChain()
      const api = rootChain.getEosPassInstance(userStore.authData?.wif as string)
      await api.transact(
        {
          actions: [
            {
              account: rootChain.nftContract.name,
              name: 'create',
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
      await nftStore.loadAvailableNfts()

      Notify.create({
        message: 'Объект успешно создан',
        color: 'positive',
      })
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

  const uploaded = (info: any) => {
    if (info.files[0].xhr.status == 200) {
      let res = JSON.parse(info.files[0].xhr.response)
      nftObject.value.images.push(res.name)
    }
  }

  const removed = (info: any) => {
    nftObject.value.images = nftObject.value.images.filter((el) => el == info.__key)
  }
</script>

<style lang="scss" scoped></style>
