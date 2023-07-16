<template lang="pug">
div
  div.row.justify-center.q-pa-md
    div.col-md-4.col-sm-6.col-xs-12
      div.row.justify-center.no-select.q-mt-lg
        div.col-12
          q-input(standout="bg-green text-white" dense rounded @keyup.enter="saveNickname" input-class='inputclass' style="text-align: right;" ref="inputRef" :readonly="!isEdit" :label="dynamicLabel" placeholder="" v-model="partner.nickname").inputclass
            template(v-slot:prepend)
              q-btn(rounded v-if="isEdit" @click="saveNickname" color="teal" flat  size="md")
                i.fas.fa-check
              
              q-btn(rounded v-if="!isEdit" @click="edit" color="teal" flat  size="md")
                i.fas.fa-pen
                
            
            template(v-slot:append)
              
              // q-btn(v-if="isEdit" @click="cancel" color="red" dense flat size="md").q-mr-xs
              //   i.fas.fa-cancel
              div
                div
                  p(style="position: relative;").q-field__label Адрес
                div
                  p(style="cursor: pointer;" @click="copy(userStore.username)").userheader @{{userStore.username}}
              q-btn(rounded icon="fa fa-copy" flat color="teal" size="sm" @click="copy(userStore.username)").q-ml-md
                  
          
          
          
        
            
          // p(style="cursor: pointer;" @click="copy(userStore.username)").userheader @{{userStore.username}}
    
        
        
        

  div.row.justify-center.q-pa-md
    div.col-md-4.col-sm-6.col-xs-12
      
      WalletsCarousel(:mini="false" :asCarousel="false").col-md-4.col-sm-6.col-xs-12
</template>

<script setup lang="ts">

import { computed, ref, onMounted, watch} from 'vue'
import { useUserStore } from '~/stores/user'
import { useHostStore } from '~/stores/host'
import { useRouter } from 'vue-router'
import userBalance from '~/components/core/oneUserBalance.vue'
import config from '~/config'
import chains from '~/chainsMain'
import WalletsCarousel from '~/components/wallet/WalletsCarousel.vue'
import { copyToClipboard, Notify } from 'quasar'

const router = useRouter()

const hostStore = useHostStore()
const userStore = useUserStore()

const username = ref('')
const partner = ref({})

const isEdit = ref(false)

const inputRef = ref(null)

onMounted(async () => {
  userStore.getUserBalances()

  username.value = userStore.username
  
  if (userStore.username){
    partner.value = await userStore.getUserPartnerInfo(userStore.username)
    if (partner.value.nickname == "")
      isEdit.value = true
  }
})

const dynamicLabel = computed(() => {
  if (nicknameIsSet.value)
    return 'Ваш псевдоним'
  else return 'Введите псевдоним'
})

const nicknameIsSet = computed(() => {
  if (userStore?.partner?.nickname != '')
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
    font-size: 10px;
    
  }
  .userheader {
    font-size: 10px;
    
  }
  .sign {
    font-size: 10px;
    color: grey;
  }

  .inputclass .q-field__append{
    align-items: stretch;
  }

      

</style>