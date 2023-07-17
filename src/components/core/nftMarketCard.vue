<template lang="pug">
q-card(@click="$router.push({name: 'nft', params: {hostname: host.username}})" flat bordered style="border: 1px solid grey;").nft-card.q-mt-md
  img(:src="host?.meta.host_image")
  q-card-section
    q-badge(style="position: absolute; top: -5px; right: 0px;") {{hostType}} {{host.asset_on_sale_symbol}}
    q-badge(style="position: absolute; top: -5px; left: 0px;") DAO {{host.username.toUpperCase()}}
    div.text-h6 {{host.title}}
    
    div.q-mt-xs {{host.purpose}}
    // q-card-section
    //   q-badge шаг цены: +5%
    //   q-badge цена фракции: {{host.currentPool.quant_cost}}
    //   q-badge осталось фракций: {{host.currentPool.total_quants / 1000000}}
  
  q-card-actions(align="left")
    q-btn(flat v-if="!$route.params.hostname") Подробнее
    // buyWindow(v-if="props.host" :hostname="props.host.username")

      
      
</template>

<script setup lang="ts">
  import { useHostStore } from '~/stores/host'
  import { computed, ref} from 'vue'
  import buyWindow from '~/components/core/buyWindow.vue'

  const hostStore = useHostStore()

  let dialog = ref(false)
  
  const hostType = computed(() => {
    if (props.host.type == 'tokensale') return 'токенсейл'
      else return ''
  })

  const props = defineProps({
    host: {
      type: Object,
      required: true,
    },
  })

</script>

<style scoped lang="scss">
 
  .nft-card {
    cursor: pointer;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);

    &:hover {
      transform: scale(1.03);
      box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
    }
  }
</style>
