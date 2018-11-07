<template xmlns:v-bind="http://www.w3.org/1999/xhtml" xmlns:v-on="" xmlns: xmlns:>
  <div style="padding-top:5px;">
    <login v-on:getDropDown="getDropDown" v-if="lock"></login>
    <div class="swagger-left" style="height: 100%;overflow-y: auto;overflow-x: hidden;">
      <ul class="nav-list">
        <select class="form-control" v-model.lazy="selected">
          <option v-for="(item,index) in dropDownData" :value="index">
            {{item.url || item.location}}
          </option>
        </select>
        <li v-for="(item,index) in dropDownBoxContent.tags" @click="count=index"
            v-bind:class="[count==index ? 'active' : '']">
          <span class="nav-list-name">{{item.name}}</span>
          <span class="nav-list-description">{{item.description}}</span>
          <span class="nav-list-number">{{quantity[item.name]}}</span>
        </li>
      </ul>
    </div>
    <div class="swagger-category" style="height: 100%;overflow-y: auto;overflow-x: hidden;">
      <ul style="margin: 0;padding: 0;">
        <li class="category-li" v-for="item,index in swaggerCategory" @click="_changeCountTo(index)"
            :style="{backgroundColor:BG[item.name.toUpperCase()]}">
          <span class="category-li-type">{{item.name ? item.name.toUpperCase() : ""}}</span>
          <code class="category-li-path">{{item.pathName ? item.pathName.toLowerCase() : ""}}</code>
          <span class="category-li-name">{{item.pathInfo && item.pathInfo.summary ? item.pathInfo.summary : ""}}</span>
        </li>
      </ul>
    </div>
    <div class="tab-switch">
      <div class="management">
        <a @click="managementShow=!managementShow" class="font-color" href="javascript:">&#9662;</a>
        <transition name="fade">
          <ul v-show="managementShow">
            <li @click="_closeTab">关闭当前</li>
            <li @click="_closeOthersTab">关闭其它</li>
            <li @click="_closeAllTab">关闭所有</li>
          </ul>
        </transition>
      </div>
      <ul>
        <li v-for="(value,key) in tabDataInfo" @click="_controlTab(key,value)" :class="{active:tabDataShow==key}">
          <span>{{key}}</span><a href="javascript:">X</a></li>
      </ul>
    </div>
    <introduction v-show="countTo==-1"></introduction>
    <interface-main v-show="countTo!==-1"
                   v-bind:swaggerCategory="swaggerCategory" v-bind:selected="selected"
                   v-bind:count="count" v-bind:countTo="countTo"></interface-main>
    <authorizations></authorizations>
  </div>
</template>
<script type="text/ecmascript-6">
  import {mapGetters, mapMutations} from 'vuex'
  import {ERR_OK, CONSOLE,BG} from './../api/config'
  import {getDropDown, getBoxContent} from '../api/get_data'

  import Login from './login.vue'
  import Introduction from './introduction.vue'
  import InterfaceMain from './interface_main.vue'
  import Authorizations from './authorizations.vue'

  export default {
    name: 'app',
    data() {
      return {
        BG: BG,
        selected: 0,
        count: 0,
        countTo: -1,
        control: false,
        hint: "",
        quantity: {},
        managementShow: false
      }
    },
    watch: {
      selected: function (newSelected) {
        this.count = 0;
        this.countTo = 0;
        /* 初始化 */
        this.UPDATE_DROPDOWN_DROPDOWNCOUNT(newSelected)
        this.getDropDown()
        let key = this.swaggerCategory[this.countTo].name.toUpperCase() + "" + this.swaggerCategory[this.countTo].pathName;
        this.UPDATE_TABDATA_UPDATETABSHOW(key);
      },
      count: function () {
        if (this.swaggerCategory && this.swaggerCategory[this.countTo] === undefined) {
          this.countTo = -1;
          this.UPDATE_TABDATA_UPDATETABSHOW("");
          return;
        }
        let key = this.swaggerCategory[this.countTo].name.toUpperCase() + "" + this.swaggerCategory[this.countTo].pathName;
        this.UPDATE_TABDATA_UPDATETABSHOW(key);
      },
      countTo() {
        if (this.countTo === -1) {
          this.UPDATE_TABDATA_UPDATETABSHOW("");
          return;
        }
        let key = this.swaggerCategory[this.countTo].name.toUpperCase() + "" + this.swaggerCategory[this.countTo].pathName;
        this.UPDATE_TABDATA_UPDATETABSHOW(key);
      }
    },
    methods: {
      getDropDown: function () {
        let _this = this;
        getDropDown().then((res) => {
          _this.DECIDE_ACCOUNT_ISVERIFY(false);
          _this.UPDATE_DROPDOWN_DROPDOWNDATA(res.data);
          if (res.data && res.data[_this.dropDownCount || 0] && res.data[_this.dropDownCount || 0]['location']) {
            _this._getBoxContent(res.data[_this.dropDownCount].location)
          }
        }).catch((error) => {
          let response=error.response;
          if(response&&response.status===ERR_OK.logCode){
            _this.DECIDE_ACCOUNT_ISVERIFY(true);
            console.error(CONSOLE.PERMISSION_ERROR + error);
          }
          _this.UPDATE_DROPDOWN_DROPDOWNDATA(CONSOLE.ERROR + error);
        })
      },
      _getBoxContent: function (url) {
        let _this = this;
        getBoxContent(url).then((res) => {
          _this.UPDATE_BOXCONTENT_BOXCONTENT(res.data)
        }).catch((err) => {
          _this.UPDATE_BOXCONTENT_BOXCONTENT(CONSOLE.ERROR + err);
        })
      },
      _closeTab: function () {/* 删除当前 */
        if (this.tabDataShow && this.tabDataInfo && this.tabDataInfo[this.tabDataShow]) {
          this.DELETE_TABDATA_DELETETAB(this.tabDataShow);
          this.managementShow = false;
          this.countTo = -1;
        }
      },
      _closeOthersTab: function () {/* 删除其他 */
        if (this.tabDataShow && this.tabDataInfo) {
          for (let key in this.tabDataInfo) {
            if (key !== this.tabDataShow) {
              this.DELETE_TABDATA_DELETETAB(key);
            }
          }
          this.managementShow = false;
        }
      },
      _closeAllTab: function () {
        if (this.tabDataInfo !== {}) {
          this.CLEAR_TABDATA_CLEARTAB();
        }
        this.countTo = -1;
        this.managementShow = false;
      },
      _controlTab: function (key, value) {
        let e = window.event;
        let target = e.target || e.srcElement;
        if (this.selected === value[2] && this.count === value[3] && this.countTo === value[4]) {
          if (target && target.nodeName && target.nodeName.toLowerCase() === 'a') {
            this.DELETE_TABDATA_DELETETAB(key);
            this.countTo = -1;
          }
          return false;
        }
        if (target && target.nodeName && target.nodeName.toLowerCase() === 'a') {
          this.DELETE_TABDATA_DELETETAB(key)
        } else {
          this.selected = value[2];
          this.count = value[3];
          this.countTo = value[4];
        }
      },
      _changeCountTo: function (index) {
        this.countTo = index;
      },
      ...mapMutations(['DECIDE_ACCOUNT_ISVERIFY', 'UPDATE_TABDATA_UPDATETABSHOW', 'UPDATE_DROPDOWN_DROPDOWNCOUNT', 'DELETE_TABDATA_DELETETAB', 'CLEAR_TABDATA_CLEARTAB', 'UPDATE_DROPDOWN_DROPDOWNDATA', 'UPDATE_BOXCONTENT_BOXCONTENT']),
    },
    components: {Login, InterfaceMain, Introduction, Authorizations},
    computed: {
      ...mapGetters(['accountIsSecurity', 'tabDataInfo', 'tabDataShow', 'dropDownData', 'dropDownBoxContent', 'dropDownCount']),
      lock() {
        return this.accountIsSecurity;
      },
      swaggerCategory() {
        let current = [];
        this.quantity = {};
        for (let i in this.dropDownBoxContent.paths) {
          for (let n in this.dropDownBoxContent.paths[i]) {
            let count = this.dropDownBoxContent.paths[i][n].tags[0];
            /* 判断当前数据的name是否与当前激活的接口tags一致:后台接口数据顺序与前台显示不一致，需要通过name判断
             * 对name一致的进行保存
             * */
            this.quantity[count] ? this.$set(this.quantity, count, this.quantity[count] + 1) : this.$set(this.quantity, count, 1);
            if (count === this.dropDownBoxContent.tags[this.count].name) {
              current.push({pathName: i, name: n, pathInfo: this.dropDownBoxContent.paths[i][n]})
            }
          }
        }
        return current;
      }
    },
    created() {
      this.getDropDown()
    }
  }
</script>
<style>
  /* 动画 */
  .fade-enter-active, .fade-leave-active {
    transition: opacity 5s;
  }

  .fade-enter, .fade-leave-to {
    opacity: 0;
  }

  /* select及其下方的接口宽度样式 */
  .swagger-left {
    width: 21%;
    margin-top: 0px;
    position: fixed;
    height: 100%;
    transition: all 0.2s;
  }

  /* 单选框 */
  .form-control {
    display: block;
    width: 86%;
    margin: 0 auto 5px;
    padding: 4px 6px;
    border: 0;
    border-bottom: 1px solid #555;
    outline: none;
    height: 50px;
  }

  .nav-list {
    margin: 0;
    padding: 0;
  }

  .nav-list > li {
    display: block;
    margin: 0 auto 5px;
    border: 0;
    position: relative;
    border-left: 5px solid #fff;
    cursor: pointer;
    text-align: left;
    padding: 16px 0 16px 5%;
  }

  .nav-list > li:hover, .nav-list > li.active {
    background-color: #F3F8E4;
    color: #8ABF00;
    border-left: 5px solid #8ABF00;
  }

  /* 第一层接口列表名字 */
  .nav-list-name {
    margin-right: 14px;
    float: left;
  }

  .nav-list-description {
    width: 172px;
    display: inline-block;
    text-align: left;
  }

  .nav-list-number {
    position: absolute;
    right: 27px;
    top: 16px;
    width: 20px;
    height: 20px;
    background-color: #FF3C43;
    border-radius: 10px;
    text-align: center;
    line-height: 20px;
    color: #fff;
    font-size: 14px;
  }

  /* 接口列表 */
  .swagger-category {
    padding: 0;
    margin-left: 21%;
    width: 22%;
    margin-top: 0;
    position: fixed;
    height: 100%;
    transition: all 0.2s;
  }

  .swagger-category .category-li {
    text-align: left;
    margin-bottom: 5px;
    padding: 5px 10px;
  }

  .category-li .category-li-type {
    height: 20px;
    line-height: 20px;
  }

  .category-li .category-li-path {
    padding: 2px 4px;
    font-size: 90%;
    color: #c7254e;
    background-color: #f9f2f4;
    border-radius: 4px;
    word-break: break-all;
  }

  .category-li .category-li-name {
    display: block;
    padding: 2px 0 0;
  }

  .notify .notify-msg {
    height: auto;
    max-width: 260px;
  }

  /*  tab切换选项 */
  .tab-switch {
    position: relative;
    margin-left: 43%;
    margin-right: 51px;
    transition: all 0.2s;
    white-space: nowrap;
    overflow-y: hidden;
    overflow-x: scroll;
    height: 50px;
  }

  .tab-switch > ul {
    font-size: 0;
    text-align: left;
  }

  /* 滚动条样式 */
  .swagger-left::-webkit-scrollbar,
  .tab-switch::-webkit-scrollbar,
  .swagger-category::-webkit-scrollbar { /*滚动条整体样式*/
    width: 5px; /*高宽分别对应横竖滚动条的尺寸*/
    height: 8px;
  }

  .swagger-left::-webkit-scrollbar-thumb,
  .tab-switch::-webkit-scrollbar-thumb,
  .swagger-category::-webkit-scrollbar-thumb { /*滚动条小方块*/
    border-radius: 5px;
    -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
    background: #EBEBEB;
  }

  .swagger-left::-webkit-scrollbar-track,
  .tab-switch::-webkit-scrollbar-track,
  .swagger-category::-webkit-scrollbar-track { /*滚动条轨道*/
    -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
    border-radius: 10px;
    background: #FFF;
  }

  .tab-switch > ul li {
    padding: 10px 6px 10px 15px;
    font-size: 14px;
    font-weight: 500;
    border-top: 1px solid #dbdbdb;
    cursor: pointer;
    display: inline-block;
    float: none;
    box-shadow: 1px 1px 2px #e9e4e4;
  }

  .tab-switch > ul li.active {
    background-color: #89BF05;
    color: #fff;
  }

  .tab-switch > ul li span {
    padding-right: 9px;
  }

  .tab-switch > ul li a {
    text-decoration: none;
    color: black;
  }

  .tab-switch > ul li.active span,
  .tab-switch > ul li.active a {
    color: #fff;
  }

  .tab-switch > ul li a:hover,
  .tab-switch > ul li.active a:hover {
    color: rgb(235, 91, 91);
  }

  /* 历史记录管理 */
  .tab-switch .management {
    position: fixed;
    top: 0;
    right: 0;
  }

  .tab-switch .management a {
    text-decoration: none;
    color: #30ABF9;
    font-size: 30px;
    display: block;
    width: 36px;
    height: 36px;
    line-height: 37px;
    text-align: center;
    border-top: 1px solid #dbdbdb;
    box-shadow: 1px 1px 2px #e9e4e4;
    margin: 5px 15px auto auto;
  }

  .tab-switch .management ul {
    position: fixed;
    transition: all .4s;
    z-index: 99;
    text-align: left;
    background: #30ABF9;
    padding: 10px;
    border-radius: 5px;
    color: #fff;
    right: 0;
  }

  .tab-switch .management ul li {
    cursor: pointer;
    margin: 4px auto;
    padding: 4px 10px;
    border-radius: 5px;
  }

  .tab-switch .management ul li:hover {
    background: rgb(57, 146, 208);
  }

  /* 响应式 */
  @media screen and (min-width: 1600px) {
    .swagger-left {
      width: 18%;
    }

    .swagger-category {
      width: 18%;
      margin-left: 18%;
    }

    .tab-switch {
      margin-left: 36%;
    }
  }
</style>
