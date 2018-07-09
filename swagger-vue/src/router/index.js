import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router);
import login from '@/page/login'
import list from '@/page/interfaceList';

export default new Router({
  mode: 'history',
  routes: [

    {
      path: '/login',
      name: 'login',
      component: login
    },
    {
      path: '/list',
      name: 'list',
      component: list
    },
    {
      path: '/',
      name: 'home',
      redirect: '/login'
      // component:login
    }
  ]
});

