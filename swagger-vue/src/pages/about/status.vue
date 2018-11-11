<template>
  <div class="status-code">
    <ul class="code-list">
      <li class="list-head"><span style="padding-right: 6px;">状态码</span><span>说明</span><span>schema</span></li>
      <li><span>{{ERR_OK.min}} ~ {{Err_OK.max}}</span><span>http响应成功</span><span></span></li>
      <li><span>400</span><span>Bad Request 请求出现语法错误,一般是请求参数不对</span><span></span></li>
      <li><span>404</span><span>Not Found 无法找到指定位置的资源</span><span></span></li>
      <li><span>401</span><span>Unauthorized 访问被拒绝</span><span></span></li>
      <li><span>403</span><span>Forbidden 资源不可用</span><span></span></li>
    </ul>
  </div>
</template>
<script type="text/ecmascript-6">
  import {ERR_OK} from '../../api/config'

  export default {
    name: "app"
  }
</script>
<style>
  .status-code {
    float: left;
  }

  .code-list {
    margin: 0;
    padding: 0;
  }

  .code-list li {
    border-bottom: 1px solid #ddd;
    list-style: none;
  }

  .code-list > .list-head {
    font-weight: 700;
  }

  .code-list span {
    display: inline-block;
    padding: 8px;
  }

  .code-list span:nth-child(1) {
    min-width: 46px;
    border-right: 1px solid #ddd;
    margin-bottom: -1000px;
    padding-bottom: 1000px;
  }

  .code-list span:nth-child(2) {

  }

  .code-list span:nth-child(3) {
    min-width: 62px;
    float: right;
    border-left: 1px solid #ddd;
    margin-bottom: -1000px;
    padding-bottom: 1000px;
  }
</style>
