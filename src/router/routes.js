import Home from '../layouts/default.vue';
import lk from '../pages/lk/index.vue'

export const routes = [
  {
    path: '/',
    name: 'index',
    component: Home,
  },
  {
    path: '/lk',
    component: lk,
    name: "market",
  },
]