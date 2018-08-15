<template xmlns="http://www.w3.org/1999/xhtml" xmlns:v-bind="http://www.w3.org/1999/xhtml">

  <div  class="tree-menu" :class="{menuBorder:isResponse}">
     <li v-if="isResponse" :class="{fontColor:properties}" @click="toggleChildren" class="table-tr">
       <span :class="{fontRight:depth>0}" class="table-td-md">{{item.name ? item.name : (keyTo ? keyTo : "无")}}</span>
       <span class="table-td-md">{{item.type ? item.type : "无"}}</span>
       <span class="table-td-md">{{item.description ? item.description : "无"}}</span>

     </li>
    <!--<table v-if="isResponse" :class="{'fontColor':properties}" @click="toggleChildren">
      <tbody>
      <tr>
        <td :class="{fontRight:depth>0}">{{item.name ? item.name : (keyTo ? keyTo : "无")}}</td>
        <td>{{item.type ? item.type : "无"}}</td>
        <td>{{item.description ? item.description : "无"}}</td>
      </tr>
      <tr>
        <transition-group colspan="6" name="slide-fade" tag="div">
        <form-fold :name="name" :key="key" :depth="depth + 1" v-show="showChildren"
                   v-for="(item,key) in childProperties"
                   :item="item" :keyTo="key" :properties="item.properties">
        </form-fold>
        </transition-group>
      </tr>
      </tbody>
    </table>
    <table :class="{fontColor:properties}" @click="toggleChildren" v-else>
      <tbody>
      <tr>
        <td :class="{fontRight:depth>0}">{{item.name ? item.name : (keyTo ? keyTo : "无")}}</td>
        <td>{{item.description ? item.description : "无"}}</td>
        <td>{{item.type}}</td>
        <td>无</td>
        <td>{{item.in ? item.in : ""}}</td>
        <td>{{(typeof item.required == 'boolean') ? item.required : ""}}</td>
      </tr>
      <tr>
        &lt;!&ndash;<transition-group colspan="6" name="slide-fade" tag="td">&ndash;&gt;
        <form-fold :name="name" :key="key" :depth="depth + 1" v-show="showChildren"
                   v-for="(item,key) in childProperties"
                   :item="item" :keyTo="key" :properties="item.properties">
        </form-fold>
        &lt;!&ndash;</transition-group>&ndash;&gt;
      </tr>
      </tbody>
    </table>-->
     <li :class="{fontColor:properties}" @click="toggleChildren" class="table-tr" v-else>
       <span :class="{fontRight:depth>0}" class="table-td">{{item.name ? item.name : (keyTo ? keyTo : "无")}}</span>
       <span class="table-td">{{item.description ? item.description : "无"}}</span>
       <span class="table-td">{{item.type}}</span>
       <span class="table-td">无</span>
       <span class="table-td">{{item.in ? item.in : ""}}</span>
       <span class="table-td">{{(typeof item.required == 'boolean') ? item.required : ""}}</span>
     </li>
    <transition-group colspan="6" name="slide-fade" tag="div">
      <form-fold :name="name" :key="key" :depth="depth + 1" v-show="showChildren"
                 v-for="(item,key) in childProperties"
                 :item="item" :keyTo="key" :properties="item.properties">
      </form-fold>
    </transition-group>
  </div>
</template>
<script>
  export default {
    props: ['name', 'item', 'properties', 'keyTo', 'depth'],
    name: 'form-fold',
    data() {
      return {showChildren: false}
    },
    computed: {
      isResponse() {
        return this.name === 'response';
      },
      childProperties() {
        if (this.properties && ((this.properties["length"]) || (typeof this.properties) === "array")) {
          return this.properties[0] && this.properties[0].properties;
        }
        return this.properties;
      },
      indent() {
        return {textAlign: `right`}
      },
    },
    methods: {
      toggleChildren() {
        this.showChildren = !this.showChildren;
      }
    }
  }
</script>
<style>
  .hides {
    display: none;
  }

  .slide-fade-enter-active, .slide-fade-leave-active {
    transition: all .5s;
  }

  .slide-fade-enter, .slide-fade-leave-to {
    opacity: 0;
  }

  .copyTr {
    display: table-row;
    vertical-align: inherit;
    border-color: inherit;
  }

  .menuBorder {
    border-bottom: 0;
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
    text-align: center;
  }

  .table-td {
    border-right: 1px solid #ddd;
    width: 15%;
    float: left;
    padding: 8px 4px;
    min-height: 18px;
    text-align: left;
  }

  .table-td:nth-child(2) {
    width: 28%;
  }

  .table-td:nth-child(3) {
    width: 10%;
  }

  .table-td:nth-child(5) {
    width: 10%;
  }

  .table-td:last-child {
    border-right: 0;
    width: 12%;
  }

  .table-td-md {
    border-right: 1px solid #ddd;
    width: 30%;
    float: left;
    padding: 8px 4px;
    text-align: left;
  }

  .table-td-md:last-child {
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
