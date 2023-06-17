<template lang="pug">
div
  div(v-if="!loading")
    div(v-if="partnersTree && partnersTree.length > 0")
      h1.q-pl-md.q-mr-md Дерево партнеров
      q-list
        partnerItem(v-for="(partner, index) in partnersTree" :key="index" :partner="partner")
    p(v-else).q-pa-md У вас нет партнеров. Используйте ссылку в меню для приглашения.
  div(v-else).q-pa-md
    loader
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { useUserStore } from '~/stores/user'
import { useHostStore } from '~/stores/host'
import { useRouter } from 'vue-router';
import partnerItem from '~/components/core/partners/partnerItem.vue'
import loader from '~/components/common/loader.vue'

const router = useRouter();
const hostStore = useHostStore();
const userStore = useUserStore();

const loading = ref(true);
const tree = ref([]);

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

watch(tree, (newValue) => {
  partnersTree.value = getPartners(userStore.username);
})

onMounted(async () => {
  try {
    tree.value = await hostStore.loadTreeOfPartners();
  } finally {
    loading.value = false;
  }
});
</script>