import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router);
import list from '@/pages/interface_list';

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'swagger',
      redirect: '/swagger-ui.html'
    },
    {
      path: '(\.*)/swagger-ui.html',
      name: 'swagger-ui',
      component: list
    }
  ]
});

