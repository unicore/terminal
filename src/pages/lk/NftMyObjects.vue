<template>
  <div class="pa-4">
    <h5 class="text-h5">
      Мои объекты
      <div v-if="canCreateObjects" class="q-mb-sm display-inline-block"><NftCreateObject /></div>
    </h5>

    <div v-if="!nftStore.loading" class="row q-col-gutter-md">
      <NftAdminObjectCard v-for="id in userNftIds" :id="id" :key="id" class="col-12 col-md-6" />
      <NftOwnedPiecesObjectCard
        v-for="id in ownedPieces"
        :id="id"
        :key="id"
        class="col-12 col-md-6" />
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
  import NftAdminObjectCard from '~/components/nft/NftAdminObjectCard.vue'
  import NftCreateObject from '~/components/nft/NftCreateObject.vue'
  import { useNftStore } from '~/stores/nft'
  import { useUserStore } from '~/stores/user'
  import config from '~/config'
  import NftOwnedPiecesObjectCard from '~/components/nft/NftOwnedPiecesObjectCard.vue'

  const nftStore = useNftStore()
  const userStore = useUserStore()
  const userNftIds = computed(() => nftStore.getNftIdsByUsername(userStore.username as string))
  const ownedPieces = computed(() =>
    nftStore.nftPieceIds.filter((id) => {
      const piece = nftStore.getPieceById(id)
      return nftStore.getNftById(piece.object_id)?.creator !== piece.owner
    })
  )
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

<route lang="yaml">
meta:
  menuOrder: 2
  icon: cart
</route>
