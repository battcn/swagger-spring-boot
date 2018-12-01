<template xmlns="http://www.w3.org/1999/xhtml">
  <div class="tree-menu" :style="{backgroundColor:_bg}" :class="{'menu-border':isResponse}">
    <li v-if="isResponse" :style="{backgroundColor:_bg}" :class="{'font-color':properties}" @click="_toggleChildren"
        class="table-tr">
      <span :style="{textIndent:depth*10+'px'}"
            class="table-td-md">{{item.name ? item.name : (keyTo ? keyTo : "无")}}</span>
      <span class="table-td-md">{{item.type ? item.type : "无"}}</span>
      <span class="table-td-md">{{item.description ? item.description : "无"}}</span>
    </li>
    <li :style="{backgroundColor:_bg}" :class="{'font-color':properties}" @click="_toggleChildren" class="table-tr"
        v-else>
      <span :style="{textIndent:depth*10-10+'px'}"
            class="table-td">{{item.name ? item.name : (keyTo ? keyTo : "无")}}</span>
      <span class="table-td">{{item.description ? item.description : "无"}}</span>
      <span class="table-td">{{item.type}}</span>
      <span class="table-td">无</span>
      <span class="table-td">{{item.in ? item.in : ""}}</span>
      <span class="table-td">{{isRequired}}</span>
    </li>
    <transition-group name="slide-fade" tag="ul">
      <form-fold :name="name" :key="key" :depth="depth +1" v-show="showChildren"
                 v-for="(item,key) in childProperties" :requiredArray="requiredArray"
                 :item="item" :keyTo="key" :properties="item.properties">
      </form-fold>
    </transition-group>
  </div>
</template>
<script>
  import {BGFORM} from './../../../api/config'

  export default {
    props: ['name', 'item', 'properties', 'keyTo', 'depth', 'requiredArray'],
    name: 'form-fold',
    data() {
      return {showChildren: false}
    },
    computed: {
      _bg() {
        return BGFORM[this.depth - 1];
      },
      isRequired() {
        if ((this.item.required && typeof this.item.required === 'boolean' && this.item.required) || (typeof this.item.required === 'object' && this.item.required['length'] > 0)) {
          return true;
        }
        if (this.requiredArray && typeof this.requiredArray === 'object' && this.requiredArray['length'] > 0 && (this.requiredArray.includes(this.item.name) || this.requiredArray.includes(this.keyTo))) {
          return true;
        }
        return false;
      },
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
      _toggleChildren() {
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

  .menu-border {
    border-bottom: 0;
  }

  /* 请求参数表格 */
  .table-tr {
    border-bottom: 1px solid #ddd;
    overflow: hidden;
    word-wrap: break-word;
    padding-bottom: 8px;
  }

  .table-head {
    font-size: 16px;
    font-weight: 700;
    background-color: #F8F8F8;
  }

  .table-head .table-td {
    padding: 8px 4px 999px;
    text-align: center;
  }

  .table-td {
    border-right: 1px solid #ddd;
    width: 12%;
    float: left;
    padding: 8px 4px;
    min-height: 18.4px;
    text-align: left;
    padding-bottom: 999px;
    margin-bottom: -999px;
  }

  .table-td:nth-child(1) {
    width: 20%;
  }

  .table-td:nth-child(2) {
    width: 28%;
  }

  .table-td:nth-child(3) {
    width: 10%;
  }

  .table-td:nth-child(5) {
    width: 8%;
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

  .table-tr .font-right {
    text-align: right;
  }

  .font-color {
    cursor: pointer;
    color: #4395ff;
  }
</style>
