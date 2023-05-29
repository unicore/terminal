<template lang="pug">
div().full-width
  
  q-input(dark filled label-color="white" color="white" label="Отправьте USDT в сети TRC20 на адрес:" v-model="address" readonly )
  q-btn(type="success" style="padding: 0px !important;" @click="copy").full-width
    i.fa.fa-copy
    span.q-ml-md скопировать

</template>//

<script setup lang="ts">
  import axios from 'axios'
  import { computed, ref, onMounted } from 'vue'
  import { copyToClipboard, Notify } from 'quasar'
  import { useUserStore } from '~/stores/user'
  import chains from '~/chainsMain'
  import config from '~/config'
  
  const userStore = useUserStore()

  let address = ref("")

  onMounted(async () => {
    generateAddress()
  })

  const copy = async () => {
    copyToClipboard(address.value)
      .then(() => {
        Notify.create({
          message: 'Адрес скопирован',
          type: 'positive',
        })

      })
      .catch((e) => {
        console.log(e)
      })
  }

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
