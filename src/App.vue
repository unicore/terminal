<template lang="pug">
div
  router-view

</template>


<script setup lang="ts">
import { onUnmounted, onMounted, computed, ref } from 'vue';
import { useBlockchainStore } from '~/stores/blockchain'
import { useUserStore } from '~/stores/user'
import { useHostStore } from '~/stores/host'
import { Notify } from 'quasar'
const bcStore = useBlockchainStore()
const userStore = useUserStore()
const hostStore = useHostStore()
let intervalId = ref(null);
import config from '~/config'
const $q = useQuasar()
import { useQuasar } from 'quasar'

onMounted(async () => {

  try{


    let tg = window.Telegram.WebApp;
    let scheme = tg.colorScheme
    if (scheme == "dark")
      $q.dark.set(true)
    
  } catch(e){
    console.log("e", e)
  }



  try {
    

    removeLoader()
    intervalId.value = setInterval(() => {
      bcStore.loadInfo()
    }, 500)

    window.tiledeskSettings= 
      {
          startHidden: true,
          projectid: config.tiledeskProject,
          customAttributes: { 
            "eosname": userStore.username || "не зарегистрирован", 
          },
      };
      
    (function(d, s, id) { 
            var w=window; var d=document; var i=function(){i.c(arguments);};
            i.q=[]; i.c=function(args){i.q.push(args);}; w.Tiledesk=i;                    
            var js, fjs=d.getElementsByTagName(s)[0];
            if (d.getElementById(id)) return;
            js=d.createElement(s); 
            js.id=id; js.async=true; js.src="https://widget.tiledesk.com/v5/launch.js";
            fjs.parentNode.insertBefore(js, fjs);

            w.Tiledesk('onClose', function(event_data) {
               console.log("on CLOSE!")
               w.Tiledesk('hide')
            });


        }(document,'script','tiledesk-jssdk'));
  } catch(e){
    Notify.create({
      message: e.message,
      type: 'negative',
    })
  }
})


onUnmounted(() => {
  if (intervalId.value) {
    clearInterval(intervalId.value);
  }


});


const openWidget = () => {
      window.Tiledesk('show');
      window.Tiledesk('open');

  }

// programmatically close the widget
const closeWidget = () => {
      window.Tiledesk('close');
      window.Tiledesk('hide');
}


let info = computed(() => {
  return bcStore.getInfo
})


function removeLoader() {
  const loaderContainer = document.querySelector(".loader-container");
  if (loaderContainer) {
    loaderContainer.remove();
  } else {
    Notify.create({
      message: "Возникла ошибка при загрузке сайта :(",
      type: 'negative',
    })
  }
}
</script>