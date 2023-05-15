<template lang="pug">
div
  div(v-if="!loading")
    h1.q-pl-md.q-mr-md Дерево партнеров
    q-list(v-if="partnersTree.length > 0")
      partnerItem(v-for="(partner, index) in partnersTree" :key="index" :partner="partner")
    p(v-else).q-pa-md У вас нет партнеров. Используйте ссылку в меню для приглашения.
  div(v-else).q-pa-md
    loader
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useUserStore } from '~/stores/user'
import { useHostStore } from '~/stores/host'
import { useRouter } from 'vue-router';
import partnerItem from '~/components/core/partners/partnerItem.vue'
import loader from '~/components/common/loader.vue'

const router = useRouter();
const hostStore = useHostStore();
const userStore = useUserStore();

const loading = ref(true);
let tree = ref([]);

const partnersTree = ref([]);

const MAX_DEPTH = 7;

function getPartners(username, depth = 0) {
  if (depth >= MAX_DEPTH) return [];

  const partners = tree.value.filter(user => user.referer === username)
    .map(user => {
      const subpartners = getPartners(user.username, depth + 1);
      return {
        username: user.username,
        level: depth + 1,
        count: subpartners.reduce((total, partner) => total + partner.count, 0) + 1,
        partners: subpartners
      }
    });

  return partners;
}

onMounted(async () => {
  try {
    tree.value = await hostStore.loadTreeOfPartners();
    partnersTree.value = getPartners(userStore.username);
  } finally {
    loading.value = false;
  }
});
</script>