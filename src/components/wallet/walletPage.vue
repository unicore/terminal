<template lang="pug">
div
  div.row.justify-center.no-select
    div.col-md-4.col-sm-6.col-xs-12
      div.row.justify-center.no-select
        div.col-12
          q-input(color="white" label-color="white" bg-color="primary" square @blur="saveNickname" filled dense  @keyup.enter="saveNickname" input-class='inputclass' style="text-align: right;" ref="inputRef" :readonly="!isEdit" :label="dynamicLabel" placeholder="" v-model="partner.nickname").inputclass
            template(v-slot:prepend)
              q-btn( v-if="isEdit" @click="isEdit=false" color="white" flat  size="md")
                i.fas.fa-check
              
              q-btn( v-if="!isEdit" @click="edit" color="white" flat  size="md")
                i.fas.fa-pen
                
            
            template(v-slot:append)
              
              // q-btn(v-if="isEdit" @click="cancel" color="red" dense flat size="md").q-mr-xs
              //   i.fas.fa-cancel
              div
                div
                  p(style="font-size: 8px; padding-top: 6px; color: white;") Ваш адрес
                div()
                  p(style="cursor: pointer; padding-top: 0px;" @click="copy(userStore.username)").userheader @{{userStore.username}}
              q-btn( icon="fa fa-copy" flat color="white" size="sm" @click="copy(userStore.username)").q-ml-md
                  
          

  div.row.justify-center.q-pa-md.q-mt-lg
    div.col-md-4.col-sm-6.col-xs-12
      // div.full-width.text-center
      //   span.text-grey кошелёк
      
      WalletsCarousel(:mini="false" :asCarousel="false").col-md-4.col-sm-6.col-xs-12

  div(style="margin-top: 30px;").row.justify-center
    accountExplorer(:username="userStore.username")
    //userStore.username
</template>

<script setup lang="ts">

import { computed, ref, onMounted, watch, onUnmounted} from 'vue'
import { useUserStore } from '~/stores/user'
import { useHostStore } from '~/stores/host'
import { useRouter } from 'vue-router'
import userBalance from '~/components/core/oneUserBalance.vue'
import config from '~/config'
import chains from '~/chainsMain'
import WalletsCarousel from '~/components/wallet/WalletsCarousel.vue'
import { copyToClipboard, Notify } from 'quasar'
import { useP2PStore } from '../p2p/store/index'
import accountExplorer from '~/components/explorer/AccountEvents.vue'

const p2pStore = useP2PStore()

const router = useRouter()

const hostStore = useHostStore()
const userStore = useUserStore()

const username = ref('')
const partner = ref({})

const isEdit = ref(false)

const inputRef = ref(null)

// onUnmounted(async() => {
//     clearInterval(refresh_id.value)
// })

onMounted(async () => {
  
  
  if (userStore.username){
    userStore.getUserBalances()
    userStore.getAccount(userStore.username)
    username.value = userStore.username
    hostStore.getUserStat(userStore.username, config.chains[0].coreSymbol, "eosio.token")

    partner.value = await userStore.getUserPartnerInfo(userStore.username)
    if (partner.value.nickname == "")
      isEdit.value = true
  }
})

const dynamicLabel = computed(() => {
  if (nicknameIsSet.value)
    return 'Ваш псевдоним'
  else return 'Введите ваш псевдоним'
})

const nicknameIsSet = computed(() => {
  if (partner.value.nickname != '')
    return true
  else return false
})

const edit = () => {
  isEdit.value = true
  inputRef.value.focus();

}

const saveNickname = async() => {

  try{


    await userStore.saveNickname(partner.value.nickname)
    Notify.create({
      message: 'Псевдоним сохранён',
      type: 'positive',
    })
    isEdit.value = false
  } catch(e){
    cancel()
    Notify.create({
      message: 'Произошла ошибка: ' + e.message,
      type: 'negative',
    })
  }

}

const cancel = async() => {
  partner.value = userStore.partner
  isEdit.value = false
}

const copy = async (address) => {
  copyToClipboard(address)
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



</script>

<style> 
  .inputclass .q-field__label{
    font-size: 10px;
    
  }
  .inputclass{
    color: white;
    font-size: 10px;
    
  }
  .userheader {
    font-size: 10px;
    color: white;
  }
  .sign {
    font-size: 10px;
    color: white;
  }

  .inputclass .q-field__append{
    align-items: stretch;
  }

      

</style>