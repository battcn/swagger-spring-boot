<template xmlns:v-bind="http://www.w3.org/1999/xhtml">
  <div class="component-api-list">
      <api-component-content v-for="(api,index) in linkList" :api="api" :key="index"></api-component-content>
  </div>
</template>
<script type="text/ecmascript-6">
  import {mapGetters, mapMutations} from 'vuex'
  import ApiComponentContent from '@/components/api/api.content'
  export default {
    name: 'component-api-list',
    components: {ApiComponentContent},
    computed: {
      ...mapGetters(['linkList']),
    }
  }
</script>
