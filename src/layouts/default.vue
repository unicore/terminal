<template lang="pug">
q-layout(view="hHh LpR fFf")
  // q-header(v-if="!isMobile" reveal class="bg-white text-black text-left" style="border-bottom: 0.5px solid green;")
  //   q-toolbar
      
  //     q-toolbar-title
  //       q-btn(v-if="router.currentRoute.value.name != 'index'"  stretch flat class="btn-menu" @click="goToBack" size="lg" color="" :dense="isMobile")
  //         i.fa-solid.fa-circle-chevron-left
  //       q-btn(v-if="router.currentRoute.value.name == 'index'" stretch flat class="btn-title" @click="goToIndex" :dense="isMobile")
  //         img(:src="HeaderLogo" alt="" style="height: 60px;").q-mr-md
      
  

  //     // q-btn(color="" class="btn-menu2" v-if="!loggedIn" stretch size="lg" flat @click="login" :dense="isMobile")
  //     //   p.q-pr-sm регистрация
  //     //   i.fa-solid.fa-right-to-bracket
        

  //     q-btn(color="" class="btn-menu" v-if="loggedIn" size="lg" stretch flat @click="toggleRightDrawer" :dense="isMobile")
  //       // span {{userStore.username}}
  //       i.fa-solid.fa-bars
  
  // q-btn(@click="$q.dark.set(true)") set dark
  // q-btn(@click="$q.dark.set(false)") set light
  
  q-drawer(v-if="loggedIn && !isMobile && isSubscribed" :mini="isMini" show-if-above side="left" persistent :mini-width="60" :width="300" class="drawer-left")
    div(v-if="loggedIn && isAdmin").full-width.text-center
      q-toggle( size="xs" v-model="showAdmin" val="false")
      span(style="font-size: 10px;") админ

    template(v-if="!showAdmin")
      UserProfile(:mini="isMini")
      Menu(:mini="isMini")
    template(v-else)
      adminMenu(:mini="isMini")

  q-drawer(v-if="loggedIn && isMobile && isSubscribed" v-model="rightDrawerOpen" behavior="mobile" side="left" persistent :mini-width="60" :width="300" class="drawer-left")
    template(v-if="!showAdmin")
      UserProfile(:mini="false")
      Menu(:mini="false")

    template(v-else)
      adminMenu(:mini="false")  
  
  q-drawer(v-if="!loggedIn && isSubscribed" v-model="rightDrawerOpen" overlay side="left" class="drawer-left" bordered :width="300" persistent)
    template(v-if="!showAdmin")
    
      UserProfile
  

  
  q-footer(v-if="loggedIn && isMobile" style="height: 50px; border-top: 1px solid #00800038 !important; " :style="{ 'background': $q.dark.isActive ? 'black' : 'white' }") 
    // .light-bg
    // :class="{ 'dark-bg': $q.dark.isActive }"
    mobileMenu(@toogleMore="toggleRightDrawer")

  q-page-container
    q-page(v-if="subLoaded" class="page" )
      subscribe(v-if="!isSubscribed")
      
      
      router-view(v-else v-slot="{ Component }")
        component(:is="Component" )
    div(v-else).q-mt-lg
      loader

  
</template>


<script setup lang="ts">
  import { ref, computed, onMounted, watch } from 'vue'
  import { useRouter, useRoute } from 'vue-router'
  import { useQuasar, Cookies } from 'quasar'
  import { useWindowSize } from 'vue-window-size'
  import config from '~/config'
  import MenuIcon from '~/assets/menu.svg?url'
  
  import { useUserStore } from '~/stores/user'
  import { useHostStore } from '~/stores/host'
  import { useWalletStore } from '~/stores/wallet'
  import UserProfile from '~/components/user/UserProfile.vue'
  import Menu from '~/components/menu/index.vue'
  import adminMenu from '~/components/menu/admin.vue'
  
  import loader from '~/components/common/loader.vue'
  import subscribe from '~/components/subscribe/index.vue'

  import mobileMenu from '~/components/menu/footerMobileMenu.vue'

  const $q = useQuasar()
  defineExpose({
    $q,
  })


  const router = useRouter()
  const userStore = useUserStore()
  const walletStore = useWalletStore()

  const hostStore = useHostStore()
  
  const route = useRoute()
  const { width } = useWindowSize()

  const leftDrawerOpen = ref<boolean>(false)
  const leftDrawerOverOpen = ref<boolean>(false)
  const rightDrawerOpen = ref<boolean>(false)
  const subScribeIsLoaded = ref<boolean>(false)

  const showAdmin = ref<boolean>(false)

  const toggleLeftDrawer = () => {
    leftDrawerOpen.value = !leftDrawerOpen.value
  }


  const toggleRightDrawer = () => {
    rightDrawerOpen.value = !rightDrawerOpen.value
  }

  const isIndexLayout = computed(() => {
    return !!route.meta?.indexLayout
  })

  const userStatus = computed(() => {
    return hostStore.getUserStatus
  })


  const isSubscribed = computed(() => {
    return !config.subscribe.enabled || hostStore.getUserStatus
  })

  const isMobile = computed(() => {
    return width.value < 1024
  })

  const registerNow = computed(() => {
    return userStore.registerNow
  })

  const isMini = computed(() => {
    return !rightDrawerOpen.value && !rightDrawerOpen.value && !isMobile.value
  })

  const loggedIn = computed(() => {
    return userStore.hasAuth
  })

  const isAdmin = computed(() => {
    return userStore.isAdmin
  })

  const subLoaded = computed(() => {
    return hostStore.subLoaded
  })


  watch(registerNow, (newValue) => {
    // if (newValue != registerNow.value){
      rightDrawerOpen.value = newValue
      // userStore.setRegisterNow(false)
    // }
  })

  watch(route, () => {
    leftDrawerOpen.value = false
    rightDrawerOpen.value = false
    hostStore.checkSubscription(config.coreHost, userStore.username)
  })

  const goToIndex = () => {
    router.push({ name: 'index' })
  }


  const goToMarket = () => {
    router.push({ name: 'market' })
  }

  const goToBack = () => {
    if (route.name == 'explorer' && route.params.search)
      router.push({name: "explorer"})
    else router.back()
  }

  const login = () => {
    if (userStore.hasAuth) {
      router.push({ name: 'index' })
    } else {
      rightDrawerOpen.value = !rightDrawerOpen.value
    }
  }

  onMounted(async () => {
    const ref = Cookies.get('referer') || String(route.query.r || '')
    if (ref) {
      await userStore.setReferrer(ref)
    }
    await Promise.all([walletStore.loadWallets(), userStore.getUserBalances()])
    await hostStore.checkSubscription(config.coreHost, userStore.username)
  })
</script>

<style lang="scss">
  .slide-fade-enter {
    transform: translateX(8px);
    opacity: 0;
    transition: all 0.1s ease;
  }
  .slide-fade-enter-active,
  .slide-fade-leave-active {
    transition: all 0.35s ease;
  }
  .slide-fade-leave-to {
    transform: translateX(-8px);
    opacity: 0;
  }

  .btn-title {
    font-size: 20px;
    height: 60px;
    padding-top: 2px;
    padding-bottom: 6px;
  }

  .btn-menu {
    font-size: 20px;
    height: 60px;
    width: 60px;
  }


  .btn-menu2 {
    font-size: 20px;
    height: 60px;
    
  }


  .q-toolbar {
    border-bottom: 1px solid #primary;
    padding-left: 0px !important;
    padding-right: 0px !important;
  }

 
  .drawer-right {
    border-left: 1px solid #00800038 !important;
  }

  .drawer-left {
    border-right: 1px solid #00800038 !important;
  }
  .page {
    
  }

  .dark-bg {
    background: black !important;
  }

  .light-bg {
    background: white important;
  }


</style>
