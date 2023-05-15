<template lang="pug">
div().full-width
  // p(style="font-size: 14px;") 
  q-input(filled label-color="white" label="Отправьте USDT в сети TRON на адрес:" v-model="address" readonly )
  q-btn(type="success" color="teal" style="padding: 0px !important;").full-width
    i.fa.fa-copy

</template>//

<script setup lang="ts">
  import axios from 'axios'
  import { computed } from 'vue'
  import { useUserStore } from '~/stores/user'
  import chains from '~/chainsMain'
  import config from '~/config'
  import { Notify } from 'quasar'
  const address = computed(async () => {
    const params = {
      // username: user.eosname,
      // currency,
      // type,
      // chat: {
      //   union_chat_id: unionchat,
      //   reply_to_message_id: ctx.update.message.reply_to_message.message_id,
      //   reply_to_message_chat_id: ctx.update.message.reply_to_message.chat.id,
      //   goal_message_id: ctx.update.message.reply_to_message.forward_from_message_id,
      //   goal_channel_id: ctx.update.message.reply_to_message.forward_from_chat.id,
      // },
      // botName: bot.instanceName,
      // hostname: host,
      // contract: helix.host.root_token_contract,
      // symbol: helix.host.symbol,
      // meta,
    };

    try{

      const path = `${config.paymentUrl}/generate`;

      const result = await axios.post(
        path,
        params,
      );

      if (result.data.status === 'ok') { 
        return result.data.address; 
      } else {
        Notify.create({
          message: `Произошла ошибка на получении адреса`,
          color: 'negative',
        })
      }

    } catch(e){

        console.log(e);

        Notify.create({
          message: `Произошла ошибка на получении адреса: ${e.message}`,
          color: 'negative',
        })
      
    }
  })

</script>

<style lang="scss" scoped>
  
</style>
