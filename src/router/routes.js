import Home from '../layouts/default.vue';
import lk from '../pages/lk/index.vue'
import market from '../components/core/NFTmarket.vue'
import myNFT from '../components/core/myNFT/index.vue'
import myTeam from '../pages/core/partnerPage.vue'

import explorer from '../components/fullExplorer/index.vue'
import infoAbout from '../components/core/infoAbout.vue'
import support from '../components/core/support.vue'
import create from '../components/core/create.vue'
import hostPage from '../pages/core/hostPage.vue'

export const routes = [
  {
    path: '/',
    component: Home,
    children: [
      {
        path: "",
        name: "index",
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
        component: infoAbout,
        name: "info",
      },
      // {
      //   path: '/support',
      //   component: support,
      //   name: "support",
      // },
      {
        path: '/create',
        component: create,
        name: "create",
      },

    ]
  }
]