<template xmlns="http://www.w3.org/1999/xhtml" xmlns:v-bind="http://www.w3.org/1999/xhtml">
  <div class="tree-menu">
    <li :class="{fontColor:properties}" @click="toggleChildren" class="table-tr">
      <span :class="{fontRight:depth>0}" class="table-td">{{item.name ? item.name : (keyTo ? keyTo : "无")}}</span>
      <span class="table-td">{{item.description ? item.description : "无"}}</span>
      <span class="table-td">{{item.type}}</span>
      <span class="table-td">无</span>
      <span class="table-td">{{item.in ? item.in : ""}}</span>
      <span class="table-td">{{(typeof item.required == 'boolean') ? item.required : ""}}</span>
    </li>
    <!--<tr :class="{fontColor:properties}" @click="toggleChildren">
      <td  style="width: 20%;">{{item.name ? item.name : (keyTo ? keyTo : "无")}}</td>
      <td  style="width: 30%;">{{item.description ? item.description : "无"}}</td>
      <td style="width: 10%;">{{item.type}}</td>
      <td style="width: 20%;">无</td>
      <td style="width: 10%;">{{item.in ? item.in : ""}}</td>
      <td style="width: 10%;">{{(typeof item.required == 'boolean') ? item.required : ""}}</td>
    </tr>-->
    <transition-group name="slide-fade" tag="div">
       <form-fold :key="key" :depth="depth + 1" v-show="showChildren" v-for="(item,key) in properties"
                  :item="item" :keyTo="key" :properties="item.properties">
       </form-fold>
      <!--<form-fold :key="key" :depth="depth + 1" v-show="showChildren" v-for="(item,key) in properties"
                 :item="item" :keyTo="key" :properties="item.properties">
      </form-fold>-->
    </transition-group>
  </div>
</template>
<script>
  export default {
    props: ['item', 'properties', 'keyTo', 'depth'],
    name: 'form-fold',
    data() {
      return {showChildren: false}
    },
    computed: {
      indent() {
        return {textAlign: `right`}
      }
    },
    methods: {
      toggleChildren() {
        this.showChildren = !this.showChildren;
      }
    }
  }
</script>
<style>
  .slide-fade-enter-active, .slide-fade-leave-active {
    transition: all .5s;
  }

  .slide-fade-enter, .slide-fade-leave-to {
    opacity: 0;
  }

  /* 请求参数表格 */
  .table-tr {
    border-bottom: 1px solid #ddd;
    overflow: hidden;
    word-wrap: break-word;
  }

  .table-head {
    font-size: 16px;
    font-weight: 700;
    background-color: #F8F8F8;
  }

  .table-head .table-td {
    padding: 8px 4px;
    /*padding-bottom: 1000px;
    margin-bottom: -1000px;
    height: 30px;
    line-height: 30px;*/
  }

  .table-td {
    border-right: 1px solid #ddd;
    width: 15%;
    float: left;
    padding: 8px 4px;
    /*padding-bottom: 1000px;
    margin-bottom: -1000px;
    min-height: 30px;*/
    /*line-height: 30px;*/
    text-align: left;
  }

  .table-td:last-child {
    border-right: 0;
  }

  .table-tr .fontRight {
    text-align: right;
  }

  .fontColor {
    cursor: pointer;
    color: #4395ff;
  }
</style>
