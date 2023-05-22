import Home from '../layouts/default.vue';
import Blank from '../layouts/blank.vue';
import market from '../components/core/NFTmarket.vue'
import myNFT from '../components/core/myNFT/index.vue'
import myTeam from '../pages/core/partnerPage.vue'
import withdrawer from '../components/core/withdrawer.vue'
import explorer from '../components/fullExplorer/index.vue'
import landing from '../pages/landing-user/index.vue'
import create from '../pages/create.vue'
import hostPage from '../pages/core/hostPage.vue'

export const routes = [
  {
    path: '/welcome',
    name: "landing",    
    component: landing,
  },
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
        path: "market",
        name: "market",
        component: market
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