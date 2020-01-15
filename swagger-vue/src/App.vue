<template>
  <div id="swagger-ui">
    <layout-header-component></layout-header-component>
    <layout-content-component v-if="loaded"></layout-content-component>
    <layout-foot-component></layout-foot-component>
  </div>
</template>


<script type="text/ecmascript-6">
  import {mapMutations, mapGetters} from 'vuex'
  import {getDropDown, getBoxContent} from '@/api/data'

  import 'normalize.css'
  import LayoutHeaderComponent from '@/components/layout/layout.header.vue'
  import LayoutContentComponent from '@/components/layout/layout.vue'
  import LayoutFootComponent from '@/components/layout/layout.foot.vue'
  export default {
    name: 'SwaggerUI',
    components: {LayoutHeaderComponent, LayoutContentComponent, LayoutFootComponent},
    data () {
      return {
        loaded: false
      }
    },
    created () {
      this.GetDropDown();
    },
    methods: {
      ...mapMutations(['DECIDE_ACCOUNT_ISVERIFY', 'UPDATE_TABDATA_UPDATETABSHOW', 'UPDATE_DROPDOWN_DROPDOWNCOUNT', 'DELETE_TABDATA_DELETETAB', 'CLEAR_TABDATA_CLEARTAB', 'UPDATE_DROPDOWN_DROPDOWNDATA', 'UPDATE_BOXCONTENT_BOXCONTENT']),
      GetDropDown: function () {
        getDropDown().then((res) => {
          this.DECIDE_ACCOUNT_ISVERIFY(false);
          this.UPDATE_DROPDOWN_DROPDOWNDATA(res.data);
          this.GetBoxContent(res.data[2].location)
        }).catch((error) => {
          let response = error.response;
          if (response && response.status === HTTP_STATUS.logCode) {
            this.DECIDE_ACCOUNT_ISVERIFY(true);
          }
          this.UPDATE_DROPDOWN_DROPDOWNDATA(MESSAGES.ERROR + error);
        })
      },
      GetBoxContent: function (url) {
        getBoxContent(url).then((res) => {
          this.UPDATE_BOXCONTENT_BOXCONTENT(res.data)
          this.loaded = true;
        }).catch((err) => {
          this.UPDATE_BOXCONTENT_BOXCONTENT(MESSAGES.ERROR + err);
        })
      },
    }
  }
</script>

<style lang="less" rel="stylesheet/less">
  @import "styles/index.less";
</style>
