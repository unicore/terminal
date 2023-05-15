<template lang="pug">
div
  router-view
</template>


<script setup lang="ts">//
import { onUnmounted, onMounted, computed, ref } from 'vue';
import { useBlockchainStore } from '~/stores/blockchain'
import { useUserStore } from '~/stores/user'

const bcStore = useBlockchainStore()
const userStore = useUserStore()
let intervalId = ref(null);
import config from '~/config'


onMounted(async () => {
  removeLoader()
  intervalId.value = setInterval(() => {
    bcStore.loadInfo()
  }, 500)

  window.tiledeskSettings= 
    {
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
  }(document,'script','tiledesk-jssdk'));

})


onUnmounted(() => {
  if (intervalId.value) {
    clearInterval(intervalId.value);
  }
});


let info = computed(() => {
  return bcStore.getInfo
})


function removeLoader() {
  const loaderContainer = document.querySelector(".loader-container");
  if (loaderContainer) {
    loaderContainer.remove();
  }
}
</script>