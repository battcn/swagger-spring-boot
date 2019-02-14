<template>
  <div class="search">
    <a @click="toggleSearch" class="button-search" href="javascript:void(0)">S</a>
    <div v-show="searchShow">
      <div class="ins-search-mask" @click="hideSearch"></div>
      <div class="ins-search-container">
        <div class="ins-input-wrapper">
          <input v-model="selected" type="text" class="ins-search-input" placeholder="想要查找什么...">
          <span class="ins-close ins-selectable" @click="deleteSearchParam"><i class="fa fa-times-circle">x</i></span>
        </div>
        <div class="ins-section-wrapper">
          <div class="ins-section-container">
            <section class="ins-section">
              <div v-for="params in filterPathParams" @click="changeSearch(params)"
                   class="ins-selectable ins-search-item">
                <header>{{params.summary}}</header>
                <p class="ins-search-preview">{{params.name}} {{params.path}}</p>
              </div>
            </section>
          </div>
        </div>
        <!--<select v-model="selected" @change="changeSearch">-->
        <!--<option v-for="path in pathParams" :value="path">{{path.name.toUpperCase()}} {{path.path}} {{path.summary}}-->
        <!--</option>-->
        <!--</select>-->
      </div>
    </div>
  </div>
</template>
<script>
  import {mapGetters, mapMutations} from 'vuex'
  import {POPUPS_MESSAGES} from './../../../api/config'
  import {promptPopUpShow} from './../../../common/util'

  export default {
    name: 'search',
    data () {
      return {
        authorizeShow: false,
        authorizeVal: '',
        searchShow: false,
        selected: '', // 搜索内容
        pathParams: [], // 处理过后的路由数据，用于联想搜索
        filterPathParams: [] // 搜索过滤后的数组
      }
    },
    computed: {
      ...mapGetters(['debugAuthorization', 'dropDownBoxContent']),
      authorizeInfo () {
        return this.dropDownBoxContent && this.dropDownBoxContent.securityDefinitions && this.dropDownBoxContent.securityDefinitions['X-Authorization']
      },
    },
    methods: {
      ...mapMutations(['SET_DEBUGREQUEST_SECRETKEY', 'SET_DEBUGREQUEST_SECRETKEYS']),
      /**
       * 点击条目进行搜索
       */
      changeSearch (params) {
        this.$emit('changTab', params)
        this.hideSearch()
      },
      initFilterPathParams () {
        this.filterPathParams = []
      },
      deleteSearchParam () {
        this.selected = ''
      },
      /**
       * 关闭搜索功能
       * 初始化已输入的值和已过滤的
       */
      hideSearch () {
        this.deleteSearchParam()
        this.initFilterPathParams()
        this.toggleSearch()
      },
      initSearchParams () {
        for (let key in this.dropDownBoxContent.paths) {
          const pathKeys = Object.keys(this.dropDownBoxContent.paths[key])
          if (pathKeys && pathKeys.length > 0) {
            for (let pathKey in this.dropDownBoxContent.paths[key]) {
              this.pathParams.push({
                name: pathKey,
                path: key,
                tags: this.dropDownBoxContent.paths[key][pathKey].tags,
                summary: this.dropDownBoxContent.paths[key][pathKey].summary
              })
            }
          }
        }
      },
      toggleSearch () {
        this.searchShow = !this.searchShow
      },
      _setAuthorizeShow: function () {
        this.authorizeShow = !this.authorizeShow
      },
      _setAuthorizeVal: function () {
        this.SET_DEBUGREQUEST_SECRETKEY(this.authorizeVal)
        if (window.sessionStorage) {
          let arr = [this.authorizeInfo && this.authorizeInfo.name, this.authorizeVal]
          sessionStorage.setItem('authorize', JSON.stringify(arr))
        }
        this._setAuObj(this.authorizeInfo.name)
        promptPopUpShow.call(this, POPUPS_MESSAGES.SUCCESS)
        this._closeAuthorize()
      },
      /**
       * 保存附加参数对象
       * @param name 附加参数名称
       * @private
       */
      _setAuObj: function (name) {
        let key = name || (this.authorizeInfo && this.authorizeInfo.name)
        let value = this.authorizeVal
        let obj = {}
        obj[key] = value
        this.SET_DEBUGREQUEST_SECRETKEYS(obj)
      },
      _closeAuthorize: function () {
        this.authorizeShow = false
      }
    },
    watch: {
      selected (newVal, oldVal) {
        if (newVal && newVal !== oldVal) {
          this.filterPathParams = this.pathParams.filter(item => item.path.match(newVal))
        }
        if (!newVal) {
          this.initFilterPathParams()
        }
      },
      dropDownBoxContent () {
        this.initSearchParams()
      },
      authorizeShow () {
        this.authorizeVal = this.debugAuthorization
      }
    },
    created () {
      let _this = this
      if (window.sessionStorage) {
        let val = sessionStorage.getItem('authorize')
        if (val) {
          _this.authorizeVal = JSON.parse(val)[1]
          _this.SET_DEBUGREQUEST_SECRETKEY(_this.authorizeVal)
          _this._setAuObj(JSON.parse(val)[0])
        }
      }
    }
  }
</script>
<style>
  .search .ins-search-mask {
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 100;
    background: rgba(0, 0, 0, 0.5);
  }

  .ins-search-container {
    left: 50%;
    top: 100px;
    z-index: 101;
    bottom: 100px;
    /*-webkit-box-sizing: border-box;*/
    /*-moz-box-sizing: border-box;*/
    /*-webkit-box-sizing: border-box;*/
    /*-moz-box-sizing: border-box;*/
    box-sizing: border-box;
    width: 540px;
    margin-left: -270px;
    text-align: left;
  }

  .ins-search-mask, .ins-search-container {
    position: fixed;
  }

  .ins-input-wrapper {
    position: relative;
  }

  .ins-search-input {
    width: 100%;
    border: none;
    outline: none;
    font-size: 16px;
    -webkit-box-shadow: none;
    box-shadow: none;
    font-weight: 200;
    border-radius: 0;
    background: #fff;
    line-height: 20px;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
    padding: 12px 28px 12px 20px;
    border-bottom: 1px solid #e2e2e2;
    font-family: "Microsoft Yahei Light", "Microsoft Yahei", Helvetica, Arial, sans-serif;
  }

  .ins-close {
    top: 50%;
    right: 6px;
    width: 20px;
    height: 20px;
    font-size: 16px;
    margin-top: -11px;
    position: absolute;
    text-align: center;
    display: inline-block;
  }

  .ins-selectable {
    cursor: pointer;
  }

  .fa {
    color: #e84d1c;
    display: inline-block;
    font: normal normal normal 14px/1 FontAwesome;
    font-size: inherit;
    text-rendering: auto;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  .ins-section-wrapper {
    left: 0;
    right: 0;
    top: 45px;
    bottom: 0;
    overflow-y: auto;
    position: absolute;
  }

  .ins-section {
    font-size: 14px;
    line-height: 16px;
  }

  .ins-section-container {
    position: relative;
    background: #f7f7f7;
  }

  .ins-section .ins-search-item:hover,
  .ins-section .ins-search-item.active {
    color: #fff;
    background: #006bde;
  }

  .ins-section .ins-search-item:hover .ins-search-preview,
  .ins-section .ins-search-item.active .ins-search-preview {
    color: #fff;
  }

  .ins-section .ins-section-header {
    color: #9a9a9a;
    border-bottom: 1px solid #e2e2e2;
  }

  .ins-section .ins-search-item header, .ins-section .ins-search-item .ins-search-preview {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  .ins-section .ins-search-item .ins-search-preview {
    height: 15px;
    font-size: 12px;
    color: #9a9a9a;
    margin: 5px 0 0 0;
  }

  .ins-section .ins-section-header, .ins-section .ins-search-item {
    padding: 8px 15px;
  }

  .ins-selectable {
    cursor: pointer;
  }

  .search a.button-search {
    text-decoration: none;
    z-index: 99;
    position: fixed;
    bottom: 20px;
    right: 40px;
    width: 20px;
    height: 20px;
    border-radius: 20px;
    border: 2px solid #30ABF9;
    font-weight: 400;
    color: #30ABF9;
    line-height: 20px;
    background-color: #fff;
  }

  /*.search > div > div {*/
  /*left: 50%;*/
  /*top: 100px;*/
  /*z-index: 101;*/
  /*bottom: 100px;*/
  /*-webkit-box-sizing: border-box;*/
  /*-moz-box-sizing: border-box;*/
  /*box-sizing: border-box;*/
  /*width: 540px;*/
  /*margin-left: -270px;*/
  /*}*/

  .search .header { /* 标题 */
    border-bottom: 1px solid #ccc;
    background-color: rgb(209, 234, 255);
    position: relative;
    overflow: hidden;
  }

  .search .header h3 {
    text-align: left;
    margin-left: 20px;
  }

  .search .header .close {
    position: absolute;
    right: 10px;
    top: 20px;
    text-decoration: none;
    font-weight: 700;
    color: black;
  }

  .search .header .close:hover {
    color: rgb(235, 91, 91);
  }

  .search .content {
    text-align: left;
    width: 86%;
    margin: auto;
    padding: 20px 0;
  }

  .search .content p {
    font-size: 14px;
  }

  .search .content p:last-of-type {
    font-weight: 600;
  }

  .search .content .title {
    font-weight: 600;
    font-size: 16px;
  }

  .search .content .enter {
    border: 1px solid #E9E9E9;
    width: 60%;
    outline: none;
    height: 30px;
    padding-left: 5px;
    min-width: 200px;
  }

  .search .content .control {
    margin: 16px auto 0;
    text-align: center;
  }

  .search .content .control button {
    outline: none;
    padding: 5px 24px;
    border: 2px solid;
    font-weight: 600;
    border-radius: 5px;
    background-color: #fff;
  }

  .search .content .control button:first-child {
    border-color: #5FD09C;
    color: #5FD09C;
    margin-right: 10px;

  }

  .search .content .control button:last-child {
    border-color: #7A7078;
    color: #7A7078;
  }

</style>

