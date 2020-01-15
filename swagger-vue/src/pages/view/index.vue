<template xmlns:v-bind="http://www.w3.org/1999/xhtml" xmlns:v-on="" xmlns: xmlns:>
  <div class="list">
    <search-bar></search-bar>
    <search-content></search-content>
  </div>
</template>
<script type="text/ecmascript-6">
  var less = { env: 'production' };
  import SearchBar from '@/components/search/search.bar.vue'
  import SearchContent from '@/components/search/search.content.vue'
  export default {
    name: 'swagger-ui',
    components: {SearchBar, SearchContent},
    data() {
      return {
      }
    },
    watch: {},
    computed: {},
    created() {},
    mounted() {},
    methods: {},
  }
</script>