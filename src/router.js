import Vue from 'vue';
import Router from 'vue-router';
import Home from './views/Home.vue';
import Edit from './views/Edit.vue';
import View from './views/View.vue';
import auth from './auth/authService';
import Callback from './views/Callback.vue';

Vue.use(Router);

const router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
    },
    {
      path: '/edit/:id',
      name: 'edit',
      component: Edit,
    },
    {
      path: '/view/:id',
      name: 'view',
      component: View,
    },
    {
      path: '/callback',
      name: 'callback',
      component: Callback,
    },
  ],
});

router.beforeEach((to, from, next) => {
  if (to.path === '/callback' || auth.isAuthenticated()) {
    return next();
  }
  return auth.login({ target: to.path });
});

export default router;
