<template lang="pug">
div
  div.row.q-pa-md
    q-card(flat bordered).col-md-4.col-xs-12.q-pa-md
      q-input(@click="copyRLink" square bordedless label="Ссылка для приглашения" readonly v-model="link" style="cursor: pointer;")
        template(v-slot:append)
          q-btn(@click="copyRLink" icon="content_copy" flat color="teal")

        
  div(v-if="!loading")
    div(v-if="partnersTree && partnersTree.length > 0")
      h1.q-pl-md.q-mr-md Дерево партнеров
      q-list
        partnerItem(v-for="(partner, index) in partnersTree" :key="index" :partner="partner")
    p(v-else).q-pa-md.full-width.text-center У вас нет партнеров. Используйте ссылку для приглашения.
  div(v-else).q-pa-md
    loader
</template>

<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue';
import { useUserStore } from '~/stores/user'
import { useHostStore } from '~/stores/host'
import { useRouter } from 'vue-router';
import partnerItem from '~/components/core/partners/partnerItem.vue'
import loader from '~/components/common/loader.vue'
import { copyToClipboard, Notify } from 'quasar'
import config from '~/config'

const router = useRouter();
const hostStore = useHostStore();
const userStore = useUserStore();

const loading = ref(true);
const tree = ref([]);

const partnersTree = ref([]);

const MAX_DEPTH = 7;
const link = computed(() => `${config.base_url}/?r=${userStore.username}`)



  const copyRLink = () => {
    copyToClipboard(link.value)
      .then(() => {
        Notify.create({
          message: 'Ссылка скопирована',
          type: 'positive',
        })
      })
      .catch((e) => {
        console.log(e)
      })
  }


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