<template lang="pug">
div

  div#super.section.q-pa-lg
    div.row.justify-center
      div(v-if="!showRegistration").col-md-6.col-xs-12
        div.full-width.text-center
          img(:src="HeaderLogo" alt="Homeunity logo" style="height: 120px; margin: auto;")

        q-card(flat style="padding-bottom: 100px;")
          div.text-center
            p.header.text-green Экосистема 
            p.header.text-black Финансовых 
            p.header.text-green Продуктов 
            p(style="font-size: 18px;").q-mt-lg.q-ml-lg
              vueWriter(:array="hello" :typeSpeed="20" :eraseSpeed="20")
              
          // q-separator
        
          div(style="padding-top: 50px;").full-width.text-center
            div.row.justify-center
              div
                q-btn(flat size="lg" @click="showRegistration = true").bg-green.text-white регистрация
            
                q-btn(flat size="md" @click="goToGithub").button_header
                
                  div.full-width
                    i.fa-brands.fa-telegram.q-mr-sm
                    span.text-grey открытый код
            
                q-btn(flat size="md" @click="goToGitbook").button_header
                  div.full-width
                    i.fa-brands.fa-github.q-mr-sm
                    span.text-grey белая книга
                  // q-btn(flat).text-grey-8
                  //   i.fa-brands.fa-youtube.q-mr-xs
                  //   span посмотреть видео
      div(v-if="showRegistration").col-md-6.col-xs-12
        div.row.justify-center
          div(style="padding-bottom: 50px;").col-md-6.col-xs-12
            authForm
        



</template>

<script setup lang="ts">//
import {ref, onMounted} from 'vue'

import main from '~/assets/main.svg?url'
import club1 from '~/assets/club1.svg?url'
import daofree from '~/assets/dao_free.svg?url'
import flow1 from '~/assets/flow1.svg?url'
import flow2 from '~/assets/flow2.svg?url'
import flow3 from '~/assets/flow3.svg?url'
import flow4 from '~/assets/flow4.svg?url'
import ticket from '~/assets/ticket.svg?url'
import buycheaper from '~/assets/buycheaper.svg?url'
import sellmore from '~/assets/sellmore.svg?url'
import bizsystem from '~/assets/bizsystem.svg?url'
import systemgov from '~/assets/systemgov.svg?url'
import systemadmin from '~/assets/systemadmin.svg?url'
import systemfunds from '~/assets/systemfunds.svg?url'
import systemprojects from '~/assets/systemprojects.svg?url'
import systemgoals from '~/assets/systemgoals.svg?url'
import systemtasks from '~/assets/systemtasks.svg?url'
import blockchain from '~/assets/blockchain.svg?url'
import anime from 'animejs'
import { useUserStore } from '~/stores/user'
import AuthForm from '~/components/user/AuthForm.vue'
const userStore = useUserStore()
import config from '~/config'
import HeaderLogo from '~/assets/logo.svg?url'

let hello = ref([
  'имени братьев Мавроди'
  // 'Управляй развитием бизнеса и получай доход', 
  // 'Учись новому на практике',
  // 'Создавай прогресс',
  // 'Играй в дополненной реальности',
  // 'Совладей',
  ])


let options = ref(
  {
      mouseControls: true,
      touchControls: true,
      minHeight: 500.00,
      minWidth: 200.00,
      scale: 1.00,
      scaleMobile: 1.00
  }
)

const showRegistration = ref(false)

let register = () => {
  userStore.setRegisterNow(!userStore.registerNow)
}

let goToGitbook = () => {
  window.open(config.gitBook, "_blank")
}

let goToGithub = () => {
  window.open(config.gitHub, "_blank")
}


onMounted(async () => {

  // anime({
  //   targets: '#main',
  //   keyframes: [
  //     { rotate: '360deg', scale: 1 },
  //     { rotate: '720deg', scale: 1.5 },
  //     { rotate: '1080deg', scale: 1 },
  //   ],
  //   loop: true,
  //   duration: 5000,
  //   easing: 'linear',
  // });

})
</script>

<style scoped>

.section{
  
  
}

.section h1{
  font-size: 80px;
}

.section h2{
  font-size: 70px;
  font-weight: 500;
}

.section h3{
  font-size: 30px;
  font-weight: 500;
}

.section h4 {
  font-size: 26px;
  font-weight: 500;
}

.section h5 {
  font-size: 24px;
  font-weight: 500;
}

.header{ 
  font-size: 60px;
}

@media (max-width: 768px) {
  .header {
    font-size: 38px !important;
  }

  .section{
    padding-top: 10px !important;
    padding-bottom: 15px !important;
  }

  .button_header { 
    font-size: 14px !important; 
  }
}



.section img {
  max-height: 300px;
}

.section .image-container{
  margin: auto;
  text-align: -webkit-center;
}

.background-green{
  background: #0AC05E;
}

.section .size1 {
  width: 100px; 
  height: 100px;  
  border-radius: 50px; 
}

.section .size2 {
  width: 120px; 
  height: 120px;  
  border-radius: 60px; 
}

.section .size3 {
  width: 44px; 
  height: 44px;  
  border-radius: 22px; 
}

.section .size4 {
  width: 74px; 
  height: 74px;
  border-radius: 37px;   
}

.section .size5 {
  width: 114px; 
  height: 114px;  
  border-radius: 57px; 
}

.section .size6 {
  width: 170px; 
  height: 170px;  
  border-radius: 85px; 
}


.section .size7 {
  width: 60px; 
  height: 60px;  
  border-radius: 30px; 
}


.section .pool p{
  font-size: 12px !important;
}

.section .pool_white{
  border: 2px solid black; 
  background: white;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: auto !important;
  margin-bottom: 10px !important;
  
}

.button_header { 
  font-size: 16px;
}
.section .pool_black{
  border: 2px solid grey; 
  background: black;
  margin: auto !important;
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  margin-bottom: 10px !important;
}


</style>