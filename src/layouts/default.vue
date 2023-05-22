<template lang="pug">
q-layout(view="hHh LpR fFf")
  
  q-header( class="bg-white text-black text-left")
    q-toolbar
      
      q-toolbar-title
        template(v-if="loggedIn")
          q-btn(v-if="router.currentRoute.value.name != 'market'"  stretch flat class="btn-menu" @click="goToBack" size="lg" color="teal")
            i.fa-solid.fa-circle-chevron-left
          
          q-btn(stretch flat class="btn-title" @click="goToMarket")
            img(:src="HeaderLogo" alt="Homeunity logo" style="height: 60px;").q-mr-md
        
        template(v-if="!loggedIn")
          q-btn(v-if="router.currentRoute.value.name != 'index'"  stretch flat class="btn-menu" @click="goToBack" size="lg" color="teal")
            i.fa-solid.fa-circle-chevron-left
          
          q-btn(v-if="router.currentRoute.value.name == 'index'" stretch flat class="btn-title" @click="goToIndex")
            img(:src="HeaderLogo" alt="Homeunity logo" style="height: 60px;").q-mr-md
        
      // q-btn(color="teal" stretch size="lg" flat @click="router.push({name: 'info'})") 
        // i.fa-solid.fa-info
        // p(style="padding-right: 10px;") о платформе
        
      // q-btn(color="teal" v-if="loggedIn" stretch size="lg" flat @click="router.push({name: 'create'})") 
        // p(style="font-size: 12px; font-weight: 600; padding-right: 10px;") создать NFT
        // i.fa.fa-plus
      q-btn(color="teal" class="btn-menu" v-if="!loggedIn" stretch size="lg" flat @click="login") 
        i.fa-solid.fa-right-to-bracket
    
      q-btn(color="teal" class="btn-menu" v-if="loggedIn" size="lg" stretch flat @click="toggleRightDrawer")
        i.fa.fa-user

  q-drawer(v-if="loggedIn && !isMobile" :mini="isMini" show-if-above side="right" persistent :mini-width="60" :width="300" class="drawer")
    UserProfile(:mini="isMini")
    Menu(:mini="isMini")
    MenuFooter(:mini="isMini")


  q-drawer(v-if="loggedIn && isMobile" v-model="rightDrawerOpen" behavior="mobile" side="right" persistent :mini-width="60" :width="300" class="drawer")
    // div(class="flex justify-end q-pr-sm q-pt-sm" style="margin-bottom: -40px; z-index: 1; position: relative")
    //   q-btn(dense flat round @click="toggleRightDrawer")
    //     q-icon(name="close" color="teal" size="20px")
    UserProfile(:mini="false")
    Menu(:mini="false")
    MenuFooter(:mini="false")

  q-drawer(v-if="!loggedIn" v-model="rightDrawerOpen" overlay side="right" class="drawer" bordered :width="300" persistent)
    // div(v-if="isMobile" class="flex justify-end q-pr-sm q-pt-sm" style="margin-bottom: -40px; z-index: 1; position: relative")
    //   q-btn(dense flat round @click="login")
    //     q-icon(name="close" color="teal" size="20px")
    UserProfile
    MenuFooter(:mini="isMini")

  q-page-container
    q-page(class="page")
      router-view(v-slot="{ Component }")
        component(:is="Component" style="padding-bottom: 100px;")
</template>


<script setup lang="ts">
  import { ref, computed, onMounted, watch } from 'vue'
  import { useRouter, useRoute } from 'vue-router'
  import { useQuasar, Cookies } from 'quasar'
  import { useWindowSize } from 'vue-window-size'
  import config from '~/config'
  import MenuIcon from '~/assets/menu.svg?url'
  import HeaderLogo from '~/assets/logo.svg?url'
  import { useUserStore } from '~/stores/user'
  import { useWalletStore } from '~/stores/wallet'
  import UserProfile from '~/components/user/UserProfile.vue'
  import Menu from '~/components/menu/index.vue'
  import MenuFooter from '~/components/menu/MenuFooter.vue'

  const $q = useQuasar()
  defineExpose({
    $q,
  })

  const router = useRouter()
  const userStore = useUserStore()
  const walletStore = useWalletStore()
  const route = useRoute()
  const { width } = useWindowSize()

  const leftDrawerOpen = ref<boolean>(false)
  const leftDrawerOverOpen = ref<boolean>(false)
  const rightDrawerOpen = ref<boolean>(false)

  const toggleLeftDrawer = () => {
    leftDrawerOpen.value = !leftDrawerOpen.value
  }

  const toggleRightDrawer = () => {
    rightDrawerOpen.value = !rightDrawerOpen.value
  }

  const isIndexLayout = computed(() => {
    return !!route.meta?.indexLayout
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

  watch(registerNow, (newValue) => {
    // if (newValue != registerNow.value){
      rightDrawerOpen.value = newValue
      // userStore.setRegisterNow(false)
    // }
  })

  watch(route, () => {
    leftDrawerOpen.value = false
    rightDrawerOpen.value = false
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


  .q-toolbar {
    border-bottom: 1px solid #00800038 !important;
    padding-left: 0px !important;
    padding-right: 0px !important;
  }

 
  .drawer {
    border-left: 1px solid #00800038 !important;
  }
</style>
