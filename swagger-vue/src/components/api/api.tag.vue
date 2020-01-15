<template xmlns:v-bind="http://www.w3.org/1999/xhtml">
  <div class="component-api-tag">
    <span :class="current_tag_class(tag)" v-for="(tag,index) in api.tags" :key="index" @click="route_tag_list(tag)">{{tag}}</span>
  </div>
</template>
<script type="text/ecmascript-6">
  import {mapGetters, mapMutations} from 'vuex'
  export default {
    name: 'component-api-tag',
    props: ['api'],
    data () {
      return {
        current_tag: this.$route.params.tag
      }
    },
    methods: {
      current_tag_class (tag) {
        return tag === this.current_tag ? 'current-tag' : '';
      },
      route_tag_list (tag) {
        this.$router.push({path: `/swagger-ui/${encodeURI(tag)}.html`});
      }
    }
  }
</script>
