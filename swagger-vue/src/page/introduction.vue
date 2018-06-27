<template>
  <div class="introduction">
    <ul>
      <li class="head"><span>{{infoData && infoData.title ? infoData.title : 'swagger-vue-ui'}}</span></li>
      <li>
        <span>简介</span>
        <span>{{infoData && infoData.description ? infoData.description : '无'}}</span>
      </li>
      <li>
        <span>作者</span>
        <span>{{author && author.name ? author.name : '无'}}</span>
      </li>
      <li>
        <span>版本</span>
        <span>{{infoData && infoData.version ? infoData.version : '无'}}</span>
      </li>
      <li>
        <span>host</span>
        <span>{{hostInfo ? hostInfo : '无'}}</span>
      </li>
      <li>
        <span>服务url</span>
        <span>{{infoData && infoData.termsOfService ? infoData.termsOfService : '无'}}</span>
      </li>
    </ul>
  </div>
</template>
<script type="text/ecmascript-6">
  import {deepCopy} from  './../util/util'
  export default {
    name: 'introduction',
    data(){
      return {}
    },
    props: ['leftDropDownBoxContent'],
    computed: {
      dataAll(){
        return deepCopy(this.leftDropDownBoxContent)
      },
      hostInfo(){/* host字段 */
        return this.dataAll && this.dataAll.host;
      },
      infoData(){/*info字段 数据*/
        return this.dataAll && this.dataAll.info;
      },
      author(){/* 作者信息 */
        return this.infoData && this.infoData.contact;
      }

    }
  }
</script>
<style>
  .introduction {
    box-shadow: 1px 1px 5px #f3f4ef;
    border: 1px solid #F3F4EF;
    margin-left: 43%;
    margin-right: 15px;
    transition: all 0.2s;
  }

  .introduction > ul {
    overflow: hidden;
    border: 1px solid #ddd;
  }

  .introduction .head {
    font-size: 16px;
    font-weight: 700;
    background-color: #F8F8F8;
  }

  .introduction > ul li {
    overflow: hidden;
    border-bottom: 1px solid #ddd;
  }

  .introduction > ul li:last-child {
    border-bottom: 0;
  }

  .introduction > ul li > span {
    float: left;
    box-sizing: border-box;
    padding: 8px 4px;
    border-right: 1px solid #ddd;
  }

  .introduction > ul li > span:first-child {
    width: 30%;
  }

  .introduction > ul li > span:last-child {
    border-right: 0;
    width: 70%;
  }

  .introduction > ul li.head > span {
    width: 100%;
  }

  /* 响应式 */
  @media screen and (min-width: 1600px) {
    .introduction {
      margin-left: 36%;
    }
  }


</style>

