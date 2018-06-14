<template xmlns:v-bind="http://www.w3.org/1999/xhtml" xmlns:v-on="" xmlns: xmlns:>
  <div style="padding-top:5px;">
    <div class="swagger-left" style="height: 100%;overflow-y: auto;overflow-x: hidden;">
      <ul class="nav-list">
        <select class="form-control" v-model.lazy="selected">
          <option v-for="(item,index) in swaggerLeftHead" :value="index">
            <!--{{item.serviceInstances && item.serviceInstances[0] && item.serviceInstances[0].serviceId}}-->
            {{item.url||item.location}}
          </option>
        </select>
        <li v-for="(item,index) in leftDropDownBoxContent.tags" @click="count=index"
            v-bind:class="[count==index ? 'active' : '']">
          <span class="navList-name">{{item.name}}</span>
          <span class="navList-description">{{item.description}}</span>
          <span class="navList-number">{{quantity[item.name]}}</span>
        </li>
      </ul>
    </div>
    <div class="swagger-category" style="height: 100%;overflow-y: auto;overflow-x: hidden;">
      <ul style="margin: 0;padding: 0;">
        <li class="categoryLi" v-for="item,index in swaggerCategory" @click="countTo=index"
            :style="{backgroundColor:bg[item.name.toUpperCase()]}">
          <span class="categoryLi-type">{{item.name ? item.name.toUpperCase() : ""}}</span>
          <code class="categoryLi-path">{{item.pathName ? item.pathName.toLowerCase() : ""}}</code>
          <span class="categoryLi-name">{{item.pathInfo && item.pathInfo.summary ? item.pathInfo.summary : ""}}</span>
        </li>
      </ul>
    </div>
    <interfaceMain v-on:PromptPopUpShow="PromptPopUpShow" v-bind:leftDropDownBoxContent="leftDropDownBoxContent"
                   v-bind:bg="bg" v-bind:swaggerCategory="swaggerCategory" v-bind:countTo="countTo"></interfaceMain>
  </div>
</template>
<script type="text/ecmascript-6">
  import {mapMutations} from 'vuex'
  import interfaceMain from './interfaceMain.vue'

  export default {
    name: 'app',
    data() {
      return {
        indentation: 1,
        /*testObject: {
          "test1": "wx9fdb8ble7ce3c68f",
          "test2": "123456789",
          "testData1": {
            "testdatason1": "97895455",
            "testdatason2": 3,
            "testData222": [
              {
                "testdatason4": "wosh",
                "testdatason5": "shijie"
              }
            ]
          },
          "testData2": [{"a": 23}]
        },*/
        selected: 0,
        count: 0,
        countTo: 0,
        control: false,
        hint: "",
        quantity: {},
        bg: {"GET": '#D1EAFF', "POST": '#D1FED3', "PATCH": '#FFE2D2', "DELETE": '#FFD1D1', "PUT": "#F0E0CA"}
      }
    },
    watch: {
      selected: function (newSelected) {
        this.count = 0;
        this.countTo = 0;
        /* 初始化 */
        this.$store.commit('switch', newSelected)
      }
    },
    methods: {
      PromptPopUpShow: function (hint) {
        this.$layer.msg(hint, {time: 2})
      },
      ...mapMutations(['switch']),
    },
    components: {interfaceMain},
    computed: {
      swaggerLeftHead() {
        return this.$store.state.swaggerLeftHead.data
      },
      leftDropDownBoxContent() {
        return this.$store.state.leftDropDownBoxContent.data;
      },
      swaggerCategory() {
        let current = [];
        this.quantity = {};
        for (let i in this.leftDropDownBoxContent.paths) {
          for (let n in this.leftDropDownBoxContent.paths[i]) {
            let count = this.leftDropDownBoxContent.paths[i][n].tags[0];
            /* 判断当前数据的name是否与当前激活的接口tags一致:后台接口数据顺序与前台显示不一致，需要通过name判断
             * 对name一致的进行保存
             * */
            this.quantity[count] ? this.$set(this.quantity, count, this.quantity[count] + 1) : this.$set(this.quantity, count, 1);
            if (count === this.leftDropDownBoxContent.tags[this.count].name) {
              current.push({pathName: i, name: n, pathInfo: this.leftDropDownBoxContent.paths[i][n]})
            }
          }
        }
        return current;
      }
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
    margin: 8px auto;
    padding: 4px 6px;
    height: 36px;
    border: 0;
    border-bottom: 1px solid #555;
    outline: none;
  }

  .nav-list {
    margin: 0;
    padding: 0;
  }

  .nav-list > li {
    display: block;
    margin: 0;
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
  .navList-name {
    margin-right: 14px;
    float: left;
  }

  .navList-description {

    width: 172px;
    display: inline-block;
    text-align: left;
  }

  .navList-number {
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
    margin-top: 0px;
    position: fixed;
    /* background: #337ab7; */
    height: 100%;
    transition: all 0.2s;
  }

  .swagger-category .categoryLi {
    text-align: left;
    margin-bottom: 5px;
    padding: 5px 10px;
  }

  .categoryLi .categoryLi-type {
    height: 20px;
    line-height: 20px;
  }

  .categoryLi .categoryLi-path {
    padding: 2px 4px;
    font-size: 90%;
    color: #c7254e;
    white-space: nowrap;
    background-color: #f9f2f4;
    border-radius: 4px;
  }

  .categoryLi .categoryLi-name {
    display: block;
    height: 20px;
    line-height: 20px;
  }

  .notify .notify-msg {
    height: auto;
    max-width: 260px;
  }
  /* 响应式 */
  @media screen and (min-width: 1600px){
    .swagger-left{
      width: 18%;
    }
    .swagger-category{
      width: 18%;margin-left: 18%;
    }
  }
</style>
