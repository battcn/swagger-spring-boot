<template xmlns:v-bind="http://www.w3.org/1999/xhtml">
  <div class="jsonView" v-bind:style="{marginLeft:indentation*5+'px'}">
    <div v-if="isSet">
      <li class="jsonViewLi" @click="toggleStatus">
        <span class="font-basic">
          <span  style="color: #4C4C4C;">{{showStatus ? '&#9662;' : '&#9656;'}}</span>
          {{keyTo}}
        </span>
         <span class="quantity">
           {{  obj?(obj["length"]? "["+obj.length+"]" : (typeof obj == "object" ? "{" + subQuantity(obj) + "}" : "null")):"null"}}
         </span>
       </li>
      <json-view v-show="showStatus" :key="key" v-for="(item,key) in obj" :indentation="indentation+1" :keyTo="key"
                 :obj="item"></json-view>
    </div>
    <div v-else>
      <li @click="toggleStatus">
        <span class="font-basic">
          <span style="visibility: hidden">
            {{showStatus ? '&#9662;' : '&#9656;'}}
          </span>{{keyTo}}
        </span>:
        <span :style="{color:(typeof obj)=='number'?'#ee422e':'green'}">
          {{obj===""?'""':obj}}
        </span>
      </li>
    </div>
  </div>
</template>
<script type="text/ecmascript-6">
  export default {
    name: 'json-view',
    data() {
      return {showStatus: true}
    },
    props: ['obj', 'indentation', 'keyTo'],
    methods: {
      subQuantity: function (item) {
        return Object.keys(item)&&Object.keys(item).length;
      },
      toggleStatus: function () {
        this.showStatus = !this.showStatus;
      }
    },
    computed:{
      isSet(){
        if(this.obj&&((typeof this.obj) === 'array' || (typeof this.obj) === 'object')){
          return true;
        }
        return false;
      }
    }
  }
</script>
<style>
  .quantity {
    color: grey;
    font-size: 10pt;
    margin-left: 8px;
  }

  .font-basic {
    color: #1A1A1A;
    font-size: 18px;
  }

  .jsonViewLi {
    height: 27px;
    line-height: 27px;
    display: inline-block;
  }

  .jsonView {
    text-align: left;
  }

  .test-bottom-border {
    width: 12px;
    height: 12px;
    border-right: #000 solid 2px;
    border-bottom: #000 solid 2px;
    transform: translateY(-50%) rotate(45deg);
  }

  .test-right-border {
    width: 0;
    height: 0;
    border-top: 50px solid transparent;
    border-bottom: 50px solid transparent;
    border-left: 50px solid #ff7f50;
  }

</style>

