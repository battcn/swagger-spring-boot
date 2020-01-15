<template xmlns:v-bind="http://www.w3.org/1999/xhtml">
  <div class="component-link-list">
    <link-component v-for="(link,index) in linkList" :link="link" :key="index" @click.native="ShowLink(link)"></link-component>
  </div>
</template>
<script type="text/ecmascript-6">
  import {mapGetters, mapMutations} from 'vuex'
  import LinkComponent from '@/components/link/link'
  export default {
    name: 'component-link-list',
    components: {LinkComponent},
    computed: {
      ...mapGetters(['linkList']),
    },
    methods: {
      ...mapMutations(['SET_CURRENT_API', 'SET_CURRENT_CLICK']),
      ShowLink (link) {
        this.SET_CURRENT_API(link);
      },
    }
  }
</script>
