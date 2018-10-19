import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router);
import list from '@/page/interfaceList';

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '(\.*)/swagger-ui.html',
      name: 'swagger-ui',
      component: list
    },
    {
      path: '/',
      name: 'swagger',
      redirect: '/swagger-ui.html'
    }
  ]
});

