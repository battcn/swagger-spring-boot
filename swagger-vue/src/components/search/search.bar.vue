<template xmlns:v-bind="http://www.w3.org/1999/xhtml">
  <div class="component-search-bar">
    <input type="text" name="search" placeholder="TAG/API" v-model="searchKey" @input="search()"/>
  </div>
</template>
<script type="text/ecmascript-6">
  import {mapGetters, mapMutations} from 'vuex'
  import {getDropDown, getBoxContent} from '../../api/data'
  import {HTTP_STATUS, MESSAGES, BG} from '../../api/config'
  export default {
    name: 'component-search-bar',
    data () {
      return {
        searchKey: "",
      }
    },
    methods: {
      ...mapMutations(['SEARCH_CONETENT', 'DECIDE_ACCOUNT_ISVERIFY', 'UPDATE_TABDATA_UPDATETABSHOW', 'UPDATE_DROPDOWN_DROPDOWNCOUNT', 'DELETE_TABDATA_DELETETAB', 'CLEAR_TABDATA_CLEARTAB', 'UPDATE_DROPDOWN_DROPDOWNDATA', 'UPDATE_BOXCONTENT_BOXCONTENT']),
      GetDropDown: function () {
        getDropDown().then((res) => {
          this.DECIDE_ACCOUNT_ISVERIFY(false);
          this.UPDATE_DROPDOWN_DROPDOWNDATA(res.data);
          this.GetBoxContent(res.data[0].location)
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
        }).catch((err) => {
          this.UPDATE_BOXCONTENT_BOXCONTENT(MESSAGES.ERROR + err);
        })
      },
      search () {
        this.SEARCH_CONETENT(this.searchKey);
      }
    }
  }
</script>
