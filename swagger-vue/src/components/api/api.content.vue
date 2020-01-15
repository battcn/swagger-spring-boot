<template xmlns:v-bind="http://www.w3.org/1999/xhtml">
<transition name="api-content" :duration="{enter: 250, leave: 250}">
  <div class="component-api-content" v-if="api.selected">
    <div :class="content_class">
      <div class="content-close" @click="OnCloseContent()"></div>
      <api-head :api="api"></api-head>
      <api-tag :api="api.model"></api-tag>
      <div>{{api.description}}</div>
      <card-content title="Params"></card-content>
      <api-params></api-params>
      <api-response></api-response>
    </div>
  </div>
    </transition>

</template>
<script type="text/ecmascript-6">
  import {mapGetters, mapMutations} from 'vuex'
  import ApiHead from '@/components/api/api.head'
  import ApiTag from '@/components/api/api.tag'
  import CardContent from '@/components/card/card.content'
  import ApiParams from '@/components/api/api.params'
  import ApiResponse from '@/components/api/api.response'
  export default {
    name: 'component-api-content',
    components: {ApiHead, ApiTag, ApiParams, ApiResponse, CardContent},
    props: ['api'],
    computed: {
      method () {
        return this.api.type.toUpperCase();
      },
      content_class () {
        const classes = ['api-content'];
        switch (this.method) {
          case 'GET':
            classes.push('api-content-get');
            break;
          case 'PUT':
            classes.push('api-content-put`');
            break;
          case 'DELETE':
            classes.push('api-content-delete');
            break;
          case 'POST':
          default:
            classes.push('api-content-post');
            break;
        }
        return classes.join(' ');
      }
    },
    methods: {
      ...mapMutations(['REMOVE_API_CONTENT']),
      OnCloseContent () {
        if (!this.api) {
          return;
        }
        this.REMOVE_API_CONTENT(this.api);
      }
    }
  }
</script>
