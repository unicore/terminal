<template lang="pug">
div().full-width
  q-input(filled label-color="white" label="Отправьте USDT в сети TRON на адрес:" v-model="address" readonly )
  q-btn(type="success" color="teal" style="padding: 0px !important;").full-width
    i.fa.fa-copy

</template>//

<script setup lang="ts">
  import axios from 'axios'
  import { computed, ref, onMounted } from 'vue'
  import { useUserStore } from '~/stores/user'
  import chains from '~/chainsMain'
  import config from '~/config'
  import { Notify } from 'quasar'
  
  const userStore = useUserStore()

  let address = ref("")

onMounted(async () => {
  generateAddress()
})

  const generateAddress = async () => {
    
    const params = {
      username: userStore.username,
      currency: "USDT.TRC20",
      type: 'issue',
      hostname: "core",
      contract: "usdt.token",
      symbol: "USDT",
    };

    try{

      const path = `${config.paymentUrl}/generate`;

      const result = await axios.post(
        path,
        params,
      );

      if (result.data.status === 'ok') { 
        address.value = result.data.address; 
      } else {
        Notify.create({
          message: `Произошла ошибка на получении адреса`,
          color: 'negative',
        })
      }

    } catch(e){

        console.log(e);
        address.value = e.message
        Notify.create({
          message: `Произошла ошибка на получении адреса: ${e.message}`,
          color: 'negative',
        })
      
    }    
  }

</script>

<style lang="scss" scoped>
  
</style>
