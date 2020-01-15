<template xmlns:v-bind="http://www.w3.org/1999/xhtml">
  <div :class="head_class">
    <div class="api-head-method">{{method}}</div>
    <div class="api-head-name">{{api.name}}</div>
  </div>
</template>
<script type="text/ecmascript-6">
  import {mapGetters, mapMutations} from 'vuex'
  export default {
    name: 'component-api-head',
    props: ['api'],
    computed: {
      method () {
        return this.api.type.toUpperCase();
      },
      head_class () {
        const classes = ['component-api-head'];
        switch (this.method) {
          case 'GET':
            classes.push('api-head-get');
            break;
          case 'PUT':
            classes.push('api-head-put`');
            break;
          case 'DELETE':
            classes.push('api-head-delete');
            break;
          case 'POST':
          default:
            classes.push('api-head-post');
            break;
        }
        return classes.join(' ');
      }
    }
  }
</script>
