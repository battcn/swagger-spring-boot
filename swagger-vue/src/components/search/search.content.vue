<template xmlns:v-bind="http://www.w3.org/1999/xhtml">
  <Tabs class="component-search-content">
      <TabPane label="TAG">
        <tag-card v-for="(tag,index) in tagResult" :tag="tag" :key="index" @click.native="ShowApiList(tag)"></tag-card>
      </TabPane>
      <TabPane label="API"></TabPane>
  </Tabs>
</template>
<script type="text/ecmascript-6">
  import {mapGetters, mapMutations} from 'vuex'

  import TagCard from '@/components/card/card.tag.vue';
  import TagLink from '@/components/card/card.link.vue';
  export default {
    name: 'component-search-content',
    components: {TagCard, TagLink},
    computed: {
      ...mapGetters(['tagResult', 'apiResult']),
    },
    watch: {
      tagResult () {
        console.log(this.tagResult);
      }
    },
    methods: {
      ShowApiList (tag) {
        console.log(encodeURI(tag.name));
        this.$router.push({path: `/swagger-ui/${encodeURI(tag.name)}.html`});
      }
    }
  }
</script>
