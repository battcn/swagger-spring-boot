import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router);
import login from '@/page/login'
import list from '@/page/interfaceList';

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/swagger-login.html',
      name: 'swagger-login',
      component: login
    },
    {
      path: '/swagger-ui.html',
      name: 'swagger-ui',
      component: list
    },
    {
      path: '/',
      name: 'swagger-ui',
      redirect: '/swagger-login.html'
    }
  ]
});

