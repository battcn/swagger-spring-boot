import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router);
import login from '@/page/login'
import list from '@/page/interfaceList';

export default new Router({
  mode:'history',
  routes:[
    {
      path:'/',
      redirect: 'swagger-ui.html'
    },
    {
      path:'swagger-ui.html',
      name:'login',
      component:login
    },
    {
      path:'/home',
      name:'list',
      component:list
    }
  ]
})
