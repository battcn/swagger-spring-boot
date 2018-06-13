// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store/index'
import layer from 'vue-layer'

Vue.prototype.$layer = layer(Vue);
/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  // template: '<App/>',
  // components: { App }
  render: h => h(App)
});

