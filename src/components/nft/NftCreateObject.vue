<template>
  <q-btn color="teal" size="md" @click="open">{{
    props.isEditing ? 'Редактировать' : 'Создать'
  }}</q-btn>

  <q-dialog v-model="opened" persistent>
    <q-card style="max-width: 500px; width: 100vw">
      <q-card-section>
        <div class="text-h6">
          {{ props.isEditing ? 'Редактирование объекта' : 'Создание объекта' }}
        </div>
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

          <div v-if="props.isEditing">
            <q-img
              v-for="g in nftObject.originalImages"
              :key="g"
              :src="makeAbsoluteImgSrc(g)"
              no-native-menu>
              <div class="absolute-bottom-right text-subtitle2">
                <q-btn
                  label="Удалить"
                  color="white"
                  flat
                  type="button"
                  :loading="loading"
                  @click="removeImg(g)" />
              </div>
            </q-img>
          </div>

          <q-uploader
            class="full-width q-pl-md"
            multiple
            flat
            auto-upload
            :label="props.isEditing ? 'Добавить изображения' : 'Изображения'"
            :url="config.uploadUrl"
            :max-file-size="104857600"
            :readonly="loading"
            @removed="removed"
            @uploaded="uploaded" />

          <div class="q-text-h6">Описание:</div>
          <Tiptap v-model="nftObject.description" :readonly="loading" />

          <div v-if="props.isEditing" class="q-text-h6">Сколько частей у NFT:</div>
          <div style="align-items: center" class="row bg-light-blue-1">
            <div class="col-12">
              <q-input
                v-if="nftObject.pieced"
                v-model="nftObject.total_pieces"
                class="full-width"
                type="number"
                min="1"
                placeholder="Сколько частей у NFT"
                :readonly="loading || props.isEditing"
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
</template>

<script setup lang="ts">
  import { ref, computed } from 'vue'
  import { Notify } from 'quasar'
  import { NftObject } from 'unicore/ts/src/blockchain/contracts/nft'

  import { useUserStore } from '~/stores/user'
  import { useNftStore } from '~/stores/nft'
  import chains from '~/chainsMain'
  import config from '~/config'
  import Tiptap from '~/components/common/Tiptap.vue'

  const props = defineProps<{
    isEditing?: boolean
    editId?: number
  }>()

  const opened = ref(false)
  const loading = ref(false)
  const userStore = useUserStore()
  const nftStore = useNftStore()
  const categories = ref([{ id: 'property', title: 'Недвижимость' }])
  const object = computed(() =>
    props.editId || props.editId === 0 ? nftStore.getNftById(props.editId) : null
  )

  const makeNftObject = (baseObject?: NftObject | null) => ({
    title: baseObject?.title || '',
    category: baseObject?.category || categories.value[0].id,
    description: baseObject?.description || '',
    images: [] as string[],
    originalImages: baseObject?.images || ([] as string[]),
    pieced: true,
    total_pieces: baseObject?.total_pieces || '',
    ipns: baseObject?.ipns || '',
  })

  const nftObject = ref(makeNftObject())

  const open = () => {
    opened.value = true
    nftObject.value = makeNftObject(object.value)
  }

  const removeImg = (src: string) => {
    nftObject.value = {
      ...nftObject.value,
      originalImages: nftObject.value.originalImages.filter((s) => s !== src),
    }
  }

  const save = async () => {
    loading.value = true
    let data: Record<string, unknown> = {
      creator: userStore.username,
      title: nftObject.value.title,
      description: nftObject.value.description,
      category: nftObject.value.category,
      ipns: nftObject.value.ipns,
      meta: '{}',
    }

    if (!props.isEditing) {
      data = {
        ...data,
        total_pieces: nftObject.value.pieced ? nftObject.value.total_pieces || 1 : 1,
        images: JSON.stringify(nftObject.value.images),
      }
    } else {
      data = {
        ...data,
        object_id: props.editId,
        images: JSON.stringify([...nftObject.value.originalImages, ...nftObject.value.images]),
      }
    }

    try {
      const rootChain = chains.getRootChain()
      const api = rootChain.getEosPassInstance(userStore.authData?.wif as string)
      await api.transact(
        {
          actions: [
            {
              account: rootChain.nftContract.name,
              name: props.isEditing ? 'edit' : 'create',
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
        message: props.isEditing ? 'Объект успешно отредактирован' : 'Объект успешно создан',
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

  const makeAbsoluteImgSrc = (src: string) => {
    if (src.startsWith('http')) {
      return src
    }
    return `${config.storageUrl}${src}`
  }
</script>

<style lang="scss" scoped></style>
