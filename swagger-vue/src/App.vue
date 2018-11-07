<template>
  <div id="app">
    <!--<list></list>-->
    <router-view></router-view>
  </div>
</template>


<script type="text/ecmascript-6">
  import 'normalize.css'
  import list from './pages/view/list.vue'
  export default {
    name: 'app',
    components: {list}
  }
</script>

<style>
  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif, 微软雅黑;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;

  }

  html, body {
    padding: 0;
  }

  ul {
    margin: 0;
    padding: 0;
  }

  li {
    list-style: none;
  }
  .key{    padding-right: 6px;line-height: 21px;  letter-spacing: 1px;}
  .string{color: green;}
  .number{color: #ee422e;}

</style>
