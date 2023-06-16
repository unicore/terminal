import config from '../config'; // Импортируйте конфигурацию маршрутов

const routeConfig = config.routeConfig;

export const componentsMap = {
  index: () => import('../pages/index.vue'),
  Home: () => import('../layouts/default.vue'),
  Blank: () => import('../layouts/blank.vue'),
  pools: () => import('../components/core/NFTmarket.vue'),
  myNFT: () => import('../components/core/myNFT/index.vue'),
  myTeam: () => import('../pages/core/partnerPage.vue'),
  withdrawer: () => import('../components/dashboard/admin/withdrawer.vue'),
  explorer: () => import('../components/fullExplorer/index.vue'),
  landing: () => import('../pages/landing-user/platform.vue'),
  create: () => import('../pages/create.vue'),
  hostPage: () => import('../pages/core/hostPage.vue'),
  subscribe: () => import('../components/subscribe/index.vue'),
  welcome: () => import('../pages/landing-user/welcome.vue'),
  products: () => import('../pages/products/products.vue'),
  myProducts: () => import('../pages/products/myProducts.vue'),
  listInfoProducts: () => import('../components/products/admin/listProducts.vue'),
  listInfoClients: () => import('../components/products/admin/listClients.vue'),
  adminDashboard: () => import('../components/dashboard/admin.vue'),
  adminCore: () => import('../components/dashboard/admin/core.vue'),
  adminPartners: () => import('../components/dashboard/admin/partners.vue'),
  // Добавьте остальные компоненты из componentsMap
};

const createRoute = (route) => {
  const component = componentsMap[route.component];
  if (!component) {
    throw new Error(`Компонент "${route.component}" не подключен.`);
  }
  const children = route.children ? route.children.map(child => createRoute(child)) : [];

  return {
    ...route,
    component: component,
    children: children
  };
};

export const routes = routeConfig.reduce((result, route) => {
  if (componentsMap.hasOwnProperty(route.component)) {
    result.push(createRoute(route));
  }
  return result;
}, []);


// import Home from '../layouts/default.vue';
// import Blank from '../layouts/blank.vue';
// import pools from '../components/core/NFTmarket.vue'
// import myNFT from '../components/core/myNFT/index.vue'
// import myTeam from '../pages/core/partnerPage.vue'
// import withdrawer from '../components/core/withdrawer.vue'
// import explorer from '../components/fullExplorer/index.vue'
// import landing from '../pages/landing-user/platform.vue'
// import create from '../pages/create.vue'
// import hostPage from '../pages/core/hostPage.vue'
// import subscribe from '../components/subscribe/index.vue'
// import welcome from '../pages/landing-user/welcome.vue'
// import products from '../pages/products/products.vue'
// import myProducts from '../pages/products/myProducts.vue'



// export const routes = [
//   {
//     path: '/',
//     component: Home,
//     children: [
//       {
//         path: "",
//         name: "index",
//         component: landing
//       },
//       {
//         path: '/welcome',
//         name: "welcome",    
//         component: welcome,
//       },
//       {
//         path: "market/:hostname?/:id?",
//         name: "market",
//         component: products
//       },
//       {
//         path: "my-licences",
//         name: "my-licences",
//         component: myProducts
//       },
//       {
//         path: "pools",
//         name: "pools",
//         component: pools
//       },
//       {
//         path: "nft/:hostname?",
//         name: "nft",
//         component: hostPage,
//         children: [
//           {
//           path: "my-balances",
//           name: "nft-balances",
//           component: hostPage
//         }]
      
//       },
//       {
//         path: '/my-nft',
//         component: myNFT,
//         name: "my-nft",
//       },
//       {
//         path: '/my-team',
//         component: myTeam,
//         name: "my-team",
//       },
//       {
//         path: '/explorer/:search?/:force?',
//         component: explorer,
//         name: "explorer",
//       },
//       {
//         path: '/info',
//         component: landing,
//         name: "info",
//       },
//       {
//         path: '/create',
//         component: create,
//         name: "create",
//       },
//       {
//         path: '/withdrawer',
//         component: withdrawer,
//         name: "create",
//       },


//     ]
//   }
// ]