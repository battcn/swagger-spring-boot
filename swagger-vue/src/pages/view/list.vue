<template xmlns:v-bind="http://www.w3.org/1999/xhtml" xmlns:v-on="" xmlns: xmlns:>
  <div class="list">
    <layout-link-content>
      <div slot="content-left" class="">
          <link-list></link-list>
      </div>
      <div slot="content-right" class="">
          <api-list></api-list>
      </div>
    </layout-link-content>
  </div>
</template>
<script type="text/ecmascript-6">
  import {mapGetters, mapMutations} from 'vuex'
  import LinkList from '@/components/link/link.list'
  import ApiList from '@/components/api/api.list'
  import LayoutLinkContent from '@/components/layout/layout.link.content'
  export default {
    name: 'swagger-list',
    components: {LinkList, ApiList, LayoutLinkContent},
    data() {
      return {
      }
    },
    watch: {},
    computed: {},
    created() {},
    mounted() {
      this.init_list();
    },
    watch: {
      '$route.params.tag' () {
        this.init_list()
      }
    },
    methods: {
      ...mapMutations(['SET_CONTENT']),
      init_list () {
        const tag = decodeURI(this.$route.params.tag);
        this.SET_CONTENT(tag);
      }
    },
  }
</script>
