import { Notify } from 'quasar';
import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import { routes } from './router/routes'; // Замените этот импорт на импорт из вашего файла с маршрутами
import { useUserStore } from '~/stores/user';

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else {
      return { top: 0 };
    }
  },
});

router.beforeEach((to, from, next) => {
  const userStore = useUserStore();
  if (to.meta.requiresAuth && !userStore.hasAuth) {
    Notify.create({
      message: `У вас нет доступа на страницу ${to.path}`,
      type: 'warning',
    });
    next('/');
    return;
  }
  next();
});

export default router;