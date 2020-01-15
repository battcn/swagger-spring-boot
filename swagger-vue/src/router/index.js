import Vue from 'vue'
import Router from 'vue-router'
import index from '@/pages/view/index.vue';
import list from '@/pages/view/list.vue';

Vue.use(Router);

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'swagger',
      redirect: '/swagger-ui.html'
    },
    {
      path: '/swagger-ui.html',
      name: 'swagger-ui',
      component: index
    },
    {
      path: '/swagger-ui/:tag.html',
      name: 'swagger-list',
      component: list
    },
    {
      path: '*',
      redirect: 'swagger-ui.html'
    }
  ]
});

