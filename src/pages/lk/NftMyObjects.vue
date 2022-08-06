<template>
  <div class="pa-4">
    <h5 class="text-h5">
      Мои объекты
      <div v-if="canCreateObjects" class="q-mb-sm display-inline-block"><NftCreateObject /></div>
    </h5>

    <div v-if="!nftStore.loading" class="row q-col-gutter-md">
      <NftObjectCard
        v-for="id in userNftIds"
        :id="id"
        :key="id"
        class="col-12 col-md-6"
        with-owner-controls />
    </div>
    <div v-else class="row q-col-gutter-md">
      <div v-for="i in 4" :key="i" class="col-12 col-md-6">
        <q-card>
          <q-skeleton height="300px" width="100%" />

          <q-item-section>
            <q-item-label>
              <q-skeleton type="text" />
            </q-item-label>
            <q-item-label caption>
              <q-skeleton type="text" />
            </q-item-label>
          </q-item-section>

          <q-item-section>
            <q-item-label caption>
              <q-skeleton type="text" />
            </q-item-label>
          </q-item-section>

          <q-item-section>
            <q-item-label caption>
              <q-skeleton type="text" />
            </q-item-label>
          </q-item-section>

          <q-item-section>
            <q-item-label caption>
              <q-skeleton type="text" />
            </q-item-label>
          </q-item-section>

          <q-card-actions class="q-gutter-md">
            <q-skeleton type="QBtn" />
            <q-skeleton type="QBtn" />
          </q-card-actions>
        </q-card>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { onMounted, computed } from 'vue'
  import NftObjectCard from '~/components/nft/NftObjectCard.vue'
  import NftCreateObject from '~/components/nft/NftCreateObject.vue'
  import { useNftStore } from '~/stores/nft'
  import { useUserStore } from '~/stores/user'
  import config from '~/config'

  const nftStore = useNftStore()
  const userStore = useUserStore()
  const userNftIds = computed(() => nftStore.getNftIdsByUsername(userStore.username as string))
  const canCreateObjects = computed(
    () =>
      userStore.hasAuth &&
      (config.allowedNftCreatingAccounts || [userStore.username]).includes(
        userStore.username as string
      )
  )

  const loadObjectsList = async () => {
    await nftStore.loadAvailableNfts()
  }

  onMounted(() => {
    loadObjectsList()
  })
</script>
