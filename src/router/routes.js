import Home from '../layouts/default.vue';
import Blank from '../layouts/blank.vue';
import pools from '../components/core/NFTmarket.vue'
import myNFT from '../components/core/myNFT/index.vue'
import myTeam from '../pages/core/partnerPage.vue'
import withdrawer from '../components/core/withdrawer.vue'
import explorer from '../components/fullExplorer/index.vue'
import landing from '../pages/landing-user/platform.vue'
import create from '../pages/create.vue'
import hostPage from '../pages/core/hostPage.vue'
import subscribe from '../components/subscribe/index.vue'
import welcome from '../pages/landing-user/welcome.vue'
import products from '../pages/products/products.vue'
import myProducts from '../pages/products/myProducts.vue'

export const routes = [
  {
    path: '/',
    component: Home,
    children: [
      {
        path: "",
        name: "index",
        component: landing
      },
      {
        path: '/welcome',
        name: "welcome",    
        component: welcome,
      },
      {
        path: "market",
        name: "market",
        component: products
      },
      {
        path: "my-licences",
        name: "my-licences",
        component: myProducts
      },
      {
        path: "pools",
        name: "pools",
        component: pools
      },
      {
        path: "nft/:hostname?",
        name: "nft",
        component: hostPage,
        children: [
          {
          path: "my-balances",
          name: "nft-balances",
          component: hostPage
        }]
      
      },
      {
        path: '/my-nft',
        component: myNFT,
        name: "my-nft",
      },
      {
        path: '/my-team',
        component: myTeam,
        name: "my-team",
      },
      {
        path: '/explorer/:search?/:force?',
        component: explorer,
        name: "explorer",
      },
      {
        path: '/info',
        component: landing,
        name: "info",
      },
      {
        path: '/create',
        component: create,
        name: "create",
      },
      {
        path: '/withdrawer',
        component: withdrawer,
        name: "create",
      },


    ]
  }
]