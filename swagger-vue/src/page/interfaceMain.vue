<template xmlns:v-bind="http://www.w3.org/1999/xhtml" xmlns:v-on="">
  <div class="swagger-main">
    <div class="switch">
      <span style="cursor:pointer;" @click="switchA=0" :class="[switchA==0?'active':'']">接口说明</span>
      <span style="cursor:pointer;" @click="switchA=1" :class="[switchA==1?'active':'']">在线调试</span>
    </div>
    <div v-show="switchA==0" style="" class="swagger-content">
      <ul class="content-list" style="">
        <li><span>接口url</span>
          <div>
            <span>{{swaggerCategory[countTo] && swaggerCategory[countTo].pathName ? swaggerCategory[countTo].pathName : ""}}</span>
          </div>
        </li>
        <li><span>接口名称</span>
          <div>
            <span>{{swaggerCategory[countTo] && swaggerCategory[countTo].pathInfo ? swaggerCategory[countTo].pathInfo.summary : ""}}</span>
          </div>
        </li>
        <li><span>请求方式</span>
          <div><span>{{swaggerCategory[countTo] ? swaggerCategory[countTo].name : ""}}</span></div>
        </li>
        <li><span>consumes</span>
          <div>
            <span>{{swaggerCategory[countTo] && swaggerCategory[countTo].pathInfo && swaggerCategory[countTo].pathInfo.consumes ? swaggerCategory[countTo].pathInfo.consumes[0] : ""}}</span>
          </div>
        </li>
        <li><span>produces</span>
          <div>
            <span>{{swaggerCategory[countTo] && swaggerCategory[countTo].pathInfo && swaggerCategory[countTo].pathInfo.produces ? swaggerCategory[countTo].pathInfo.produces[0] : ""}}</span>
          </div>
        </li>
        <li><span>请求参数</span>
          <div>
            <div class="request-table"
                 v-if="swaggerCategory[countTo]&&swaggerCategory[countTo].pathInfo&&swaggerCategory[countTo].pathInfo.parameters">
              <ul>
                <li class="table-tr table-head">
                  <span class="table-td">参数名称</span>
                  <span class="table-td">说明</span>
                  <span class="table-td">类型</span>
                  <span class="table-td">条件</span>
                  <span class="table-td">in</span>
                  <span class="table-td">是否必须</span>
                </li>
                <div v-for="(item,key) in InterfaceRequest">
                  <form-fold :depth="0" :properties="item.properties&&item.properties.properties" :keyTo="key"
                             :item="item"></form-fold>
                </div>
              </ul>
            </div>
            <span v-else>暂无</span>
          </div>
        </li>
        <li><span>响应Model</span>
          <div v-if="typeof jsonObject=='array'||typeof jsonObject=='object' ">
            {
            <ul v-for="(item,key) in jsonObject">
              <Json-View v-bind:obj="item" :keyTo="key" v-bind:indentation="indentation"></Json-View>
            </ul>
            }
          </div>
          <div v-else>无</div>
        </li>
        <li><span>响应参数说明</span>
          <div class="ResponseParameter">
            <span v-show="(typeof InterfaceResponse) != 'object'">{{InterfaceResponse}}</span>
            <ul v-show="(typeof InterfaceResponse) == 'object'">
              <li class="head"><span>参数名称</span><span>类型</span><span>说明</span></li>
              <li v-for="(item,index) in InterfaceResponse">
                <span>{{index}}</span>
                <span>{{item.type}}</span>
                <span>{{item.description ? item.description : "无"}}</span>
              </li>
            </ul>
          </div>
        </li>
      </ul>
    </div>
    <div v-show="switchA==1" class="debugging-content">
      <!-- 此处为接收 -->
      <submit-form v-on:deleteCopyChildForm="deleteChildForm" v-on:getCollection="getForm" :childForm.sync="childForm"
                   :bg="bg" v-on:shijian="fatherValue"
                   :parameterValue="parameterValue" :leftDropDownBoxContent="leftDropDownBoxContent"
                   v-if="swaggerCategory[countTo]&&swaggerCategory[countTo].pathInfo"
                   :swaggerCategory="swaggerCategory" :countTo="countTo" :InterfaceRequest="InterfaceRequest">
      </submit-form>
      <div class="debugging-result" v-show="resultShow">
      <span style="cursor:pointer;" @click="debugging='content'"
            :class="[debugging=='content'?'active':'']">响应内容</span>
        <span style="cursor:pointer;" @click="debugging='cookies'"
              :class="[debugging=='cookies'?'active':'']">Cookies</span>
        <span style="cursor:pointer;" @click="debugging='header'"
              :class="[debugging=='header'?'active':'']">Header</span>
        <span style="cursor:pointer;" @click="debugging='curl'" :class="[debugging=='curl'?'active':'']">curl方式</span>
        <div class="result-content">
          <div class="content" v-show="debugging=='content'">
            <div v-if="isJsonObject">
              {
              <ul>
              <li v-for="(item,key) in jsonObjectTo">
                <Json-View v-bind:obj="item" :keyTo="key" v-bind:indentation="indentation"></Json-View>
              </li>
              </ul>
              }
            </div>
            <li v-else>{{jsonObjectTo}}</li>
          </div>
          <div v-show="debugging=='cookies'">
            <span>暂无</span>
          </div>
          <div class="debugging-header" v-show="debugging=='header'">
            <ul style="border: 1px solid #ddd;">
              <li class="head"><span>请求头</span><span>value</span></li>
              <li><span>date</span><span></span></li>
              <li><span>transfer-encoding</span><span></span></li>
              <li><span>x-application-context</span><span></span></li>
              <li>
                <span>content-type</span><span>{{debugResponse && debugResponse.headers && debugResponse.headers['map'] && debugResponse.headers['map']['content-type'] && debugResponse.headers['map']['content-type'][0]}}</span>
              </li>
              <li><span>response-code</span><span>{{debugResponse && debugResponse.status}}</span></li>
            </ul>
          </div>
          <div class="debugging-curl" v-show="debugging=='curl'">
            <div>{{curlMode}}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script type="text/ecmascript-6">
  import {mapMutations} from 'vuex'
  import FormFold from './formFold.vue'
  import {deepCopy, basicTypeInit} from './../util/util'
  import SubmitForm from './submitForm.vue'
  import JsonView from './jsonView.vue'

  export default {
    name: "app",
    data() {
      return {
        isJsonObject: false,
        childForm: {},
        indentation: 1,
        jsonObject: "",
        jsonObjectTo: "",
        switchA: 0,
        resultShow: false,
        debugging: 'content',
        curlMode: "",
        linkageSection: "",
        parameterValue: {}
      }
    },
    computed: {
      /**
       * @return {string}
       */
      InterfaceResponse: function () {/* 响应参数 */
        let resp = deepCopy(this.swaggerCategory[this.countTo] && this.swaggerCategory[this.countTo].pathInfo && this.swaggerCategory[this.countTo].pathInfo.responses);
        let respBasis = false;
        let respState;
        for (let key in resp) {
          if (parseInt(key) >= 200 && parseInt(key) <= 299) {
            respBasis = true;
            respState = key;
            break;
          }
        }
        if (respBasis) {
          let ok = resp[respState];
          if (ok.hasOwnProperty("schema")) {
            let schema = ok["schema"];
            let ref = (schema["type"] && schema["type"] === "array" && schema["items"]) ? schema["items"].$ref : schema["$ref"];
            let regex = new RegExp("#/definitions/(.*)$", "ig");
            if (regex.test(ref)) {
              let refType = RegExp.$1;
              let flag = false;
              let definitionsArray = deepCopy(this.leftDropDownBoxContent && this.leftDropDownBoxContent.definitions);
              let deftion = null;
              let definition = null;
              for (let i in definitionsArray) {
                if (i === refType) {
                  definition = deepCopy(definitionsArray[i].properties);
                  break
                }
              }
              deftion = this.JSONinit(refType);
              this.jsonObject = deftion;
              return definition;
            } else {
              //未发现ref属性
              if (schema.hasOwnProperty("type")) {
                this.jsonObject = schema["type"];
                return schema["type"];
              }
              return "无";
            }
          }
        }
      },
      /**
       * @return {{}}
       */
      InterfaceRequest: function () {
        if (!this.swaggerCategory[this.countTo] && this.swaggerCategory[this.countTo].pathInfo && this.swaggerCategory[this.countTo].pathInfo.parameters) {
          return false;
        }
        /* 请求参数的遍历 */
        let result = {};
        let parameters = deepCopy(this.swaggerCategory[this.countTo].pathInfo.parameters);
        let definitions = deepCopy(this.leftDropDownBoxContent.definitions);
        for (let i in parameters) {
          if ((parameters[i].schema && parameters[i].schema.$ref) || parameters[i].$ref) {
            result[i] = parameters[i];
            result[i]['properties'] = this.formatRequest(parameters[i].schema.$ref || parameters[i].$ref);
          } else {
            result[i] = parameters[i];
          }
        }
        let resultCopy = deepCopy(result);
        for (let key in resultCopy) {
          /* 如果该字段没有type属性且存在子字段，子字段内有类型type属性 */
          if ((!resultCopy[key].type && resultCopy[key].properties && resultCopy[key].properties.type === "object") || resultCopy[key].type === 'array' && resultCopy[key].properties) {
            /* 包含子字段 */
            if (resultCopy[key].type === 'array' && resultCopy[key].properties) {
              this.parameterValue[key] = [];
              this.parameterValue[key].push(this.iniObject(resultCopy[key].properties.properties))
            } else {
              this.parameterValue[key] = {};
              this.parameterValue[key] = this.iniObject(resultCopy[key].properties.properties);
            }
          } else {
            /* 不包含子字段 */
            this.parameterValue[key] = basicTypeInit(resultCopy[key].type);
          }
        }
        //提取数据传递给子数据
        this.childForm = [];
        for (let key in result) {
          let array = {};
          this.childForm[key] = {};
          array['name'] = result && result[key] && result[key]['name'];
          array['default'] = this.parameterValue[key];
          array['required'] = result && result[key] && result[key]['required'];
          this.childForm[key] = deepCopy(array);
        }
        return result;
      },
      debugResponse() {/* 从请求中获取到的响应参数 */
        return this.$store.state.debugRequest.debugResponse;
      },
      /*linkagePath(){
       let path=(this.swaggerCategory&&this.swaggerCategory[this.countTo]&&this.swaggerCategory[this.countTo].pathName)?this.swaggerCategory[this.countTo].pathName:"";
       let digits=path.indexOf("{")
       let digitsEnd=path.indexOf("}")
       if(path!==undefined&&digits>0){
       let linkageNoun=path.slice(digits+1,digitsEnd)
       this.linkageSection=path.slice(digits+1,digitsEnd)
       return [path.slice(0,digits+1),path.slice(digitsEnd)] ;
       }
       return path;
       }*/
    },
    watch: {
      countTo: function () {
        this.switchA = 0;
        this.resultShow = false;
      }
    },
    methods: {
      deleteChildForm: function (key) {
        this.$delete(this.childForm, key);
      },
      fatherValue: function (myValue) {
        this.$set(this.parameterValue, 0, myValue);
        this.resultShow = !this.resultShow;
        this.resultShow = !this.resultShow;
      },
      tickRequired: function (item, event) {
        for (let key in this.InterfaceRequest) {
          if (!this.InterfaceRequest[key].required) {
            return false;
          }
        }
        return true;
      },
      iniObject: function (properties) {/* 传入对象，对其进行类型初始化 */
        let obj = {}
        for (let key in properties) {
          if ((properties[key].type && properties[key].properties && properties[key].type === "object") || (properties[key].type === 'array' && properties[key].properties)) {
            /* 包含子字段 */
            if (properties[key].type === 'array' && properties[key].properties) {
              obj[key] = {};
              obj[key] = (Object.values(this.iniObject(properties[key].properties)))
            } else {
              obj[key] = this.iniObject(properties[key].properties)
            }
          } else {
            /* 不包含子字段 */
            obj[key] = basicTypeInit(properties[key].type)
          }
        }
        return obj;
      },
      formatterJson: function (text_value) {
        let res = "";
        for (let i = 0, j = 0, k = 0, ii, ele; i < text_value.length; i++) {//k:缩进，j:""个数
          ele = text_value.charAt(i);
          if (j % 2 === 0 && ele === "}") {
            k--;
            for (ii = 0; ii < k; ii++) ele = "    " + ele;
            ele = "\n" + ele;
          }
          else if (j % 2 === 0 && ele === "{") {
            ele += "\n";
            k++;
            //debugger;
            for (ii = 0; ii < k; ii++) ele += "    ";
          }
          else if (j % 2 === 0 && ele === ",") {
            ele += "\n";
            for (ii = 0; ii < k; ii++) ele += "    ";
          }
          else if (ele === "\"") j++;
          res += ele;
        }
        return res;
      },
      formatRequest: function (itemsRef) {
        let objName = itemsRef.match("#/definitions/(.*)")[1];
        let result = {};
        let definitions = deepCopy(this.leftDropDownBoxContent.definitions);
        for (let key in definitions) {
          if (key.toLowerCase() === objName.toLowerCase()) {
            result = deepCopy(definitions[key]);
            let properties = definitions[key].properties;
            for (let k in properties) {
              if ((properties[k].items && properties[k].items.$ref) || properties[k].$ref) {
                let Ref = (properties[k].items && properties[k].items.$ref) ? (properties[k].items && properties[k].items.$ref) : properties[k].$ref
                if (properties[k].type === 'array') {
                  result.properties[k].properties = [];
                  let adds = this.formatRequest(Ref);
                  adds.name ? "" : adds['name'] = Ref.match("#/definitions/(.*)")[1].toLowerCase();
                  result.properties[k].properties.push(adds);
                  continue;
                }
                //  result.properties[k].properties={};
                // result.properties[k].properties[Ref.match("#/definitions/(.*)")[1].toLowerCase()]=this.formatRequest(Ref);
                result.properties[k] = this.formatRequest(Ref);
              } else {
                result.properties[k] = properties[k];
              }
            }
          }
        }
        return result;
      },
      titleCase5: function (str) {
        return str.toLowerCase().replace(/( |^)[a-z]/g, (L) => L.toUpperCase());
      },
      JSONinit: function (refType) {
        let _this = this;
        let definitionsArray = deepCopy(_this.leftDropDownBoxContent && _this.leftDropDownBoxContent.definitions);
        let deftion = null;
        for (let i in definitionsArray) {
          if (i === refType) {
            deftion = definitionsArray[i].properties;
            break
          }
        }
        for (let key in deftion) {
          if (deftion[key].$ref && deftion[key].type === "array") {
            deftion[key] = {};
            continue;
          }
          if (deftion[key].$ref) {
            let schema = deftion[key];
            let ref = (schema["type"] && schema["type"] === "array" && schema["items"]) ? schema["items"].$ref : schema["$ref"];
            let regex = new RegExp("#/definitions/(.*)$", "ig");
            if (regex.test(ref)) {
              let a = ref.match("#/definitions/(.*)");
              let refType2 = a[1];
              deftion[key] = this.JSONinit(refType2);
              continue;
            }
          }
          if (deftion[key].type === "array" && deftion[key].items) {
            let schema = deftion[key];
            let ref = (schema["type"] && schema["type"] === "array" && schema["items"]) ? schema["items"].$ref : schema["$ref"];
            let regex = new RegExp("#/definitions/(.*)$", "ig");
            if (regex.test(ref)) {
              let a = ref.match("#/definitions/(.*)");
              let refType2 = a[1];
              deftion[key] = [];
              deftion[key].push(this.JSONinit(refType2));
              continue;
            }
          }
          if (deftion[key].type === "array") {
            deftion[key] = [];
            continue;
          }
          if (deftion[key].type === "boolean") {
            deftion[key] = true;
            continue;
          }
          if (deftion[key].type === "integer") {
            deftion[key] = 0;
            continue;
          }
          if (deftion[key].type === "string") {
            deftion[key] = "";
            continue;
          }
        }
        return deftion;
      },
      getForm: function (data) {
        let _this = this;
        let result = [];
        for (let key in data) {
          if (data[key].required) {
            let obj = [];
            obj.push(data[key].name);
            obj.push(data[key].default);
            obj.push(_this.swaggerCategory[_this.countTo].pathInfo.parameters[key]);
            result.push(obj);
          }
        }
        _this.stitchUrl(result);
      },
      stitchUrl: function (result) {
        let _this = this;
        let url = (_this.swaggerCategory && _this.swaggerCategory[_this.countTo] && _this.swaggerCategory[_this.countTo].pathName) ? _this.swaggerCategory[_this.countTo].pathName : '',
          params = {},
          headerParams = {},
          reqdata = "",
          bodyparams = "";
        if (typeof (_this.leftDropDownBoxContent.basePath) !== "undefined" && _this.leftDropDownBoxContent.basePath !== "") {
          if (_this.leftDropDownBoxContent.basePath !== "/") {
            url = _this.leftDropDownBoxContent.basePath + url;
          }
        }
        let isQuery = false;
        for (let i = 0, n = result.length; i < n; i++) {
          if (result[i][2]["in"] === "path") {
            url = url.replace("{" + result[i][0] + "}", result[i][1]);
          } else if (result[i][2]["in"] === "query") {
            url += ((isQuery ? '&' : isQuery = '?') + result[i][0] + '=' + result[i][1]);
          } else {
            if (result[i][2]["in"] === "body") {
              bodyparams += JSON.stringify(result[i][1]);
            } else {
              if (result[i][2]["in"] === "header") {
                headerParams[result[i][0]] = result[i][1];
              } else {
                result[i][1] ? params[result[i][0]] = result[i][1] : '';
              }
            }
          }
        }
        for (let j = 0, k = result.length; j < k; j++) {
          if (result && result[j] && result[j][2] && result[j][2]["in"] && result[j][2]["in"] === "body") {
            reqdata = bodyparams;
            break;
          } else {
            reqdata = params;
          }
        }
        let jsonReqdata = reqdata;
        this.$store.commit('send', {
          url: "http://" + _this.leftDropDownBoxContent.host + url,
          headerParams: headerParams,
          type: _this.swaggerCategory[this.countTo].name,
          data: reqdata,
          method: function () {
            _this.StitchingCurl(headerParams, jsonReqdata)
          }
        });
      },
      StitchingCurl: function (headerParams, reqdata) {
        let _this = this;
        let headerss = "";
        let contentUrl = "\'" + _this.debugResponse.url + "\'";
        let curlAccept = " --header \'Accept:  " + _this.debugResponse.headers['map']&&_this.debugResponse.headers['map']['content-type']&&_this.debugResponse.headers['map']['content-type'][0] + "\' ";
        for (let key in headerParams) {
          headerss += (key + ": " + headerParams[key]);
        }
        /*  生成curl命令组成部分 */
        /* 头部数据 */
        headerss !== "" ? headerss = " --header \'" + headerss + "\' " : "";
        let contentType = " --header \'Content-Type:  " + _this.debugResponse.headers['map']&&_this.debugResponse.headers['map']['content-type']&&_this.debugResponse.headers['map']['content-type'][0] + "\' "
        if (_this.swaggerCategory[this.countTo].name.toLowerCase() === 'get') {
          let curlTable = ("curl -X " + _this.swaggerCategory[this.countTo].name.toUpperCase() +
          " --header \'Accept:  " + _this.debugResponse.headers['map']['content-type'][0] + "\' " +
          headerss + contentUrl);
          _this.curlMode = curlTable;
        } else {
          /* d data 非头部附带数据,只用于非get类型请求 */
          let curlData = " -d \'" + (reqdata ? this.formatterJson(reqdata).replace(/[\r\n]/g, " \\\n") : "") + "\' ";
          let curlTable = ("curl -X " + _this.swaggerCategory[this.countTo].name.toUpperCase() + contentType + curlAccept + headerss + (reqdata === '{}' ? "" : curlData) + contentUrl);
          _this.curlMode = curlTable;
        }
        /* 响应内容JSON序列化 */
        try {
          let obj = JSON.parse(this.debugResponse.bodyText);
          if (typeof obj === 'object' && obj) {
            this.isJsonObject = true;
            this.jsonObjectTo = obj;
          } else {
            this.isJsonObject = false;
            this.jsonObjectTo = String(this.debugResponse.bodyText);
          }
        } catch (e) {
          this.isJsonObject = false;
          this.jsonObjectTo = String(this.debugResponse.bodyText);
        }
        this.resultShow = true;
        /* 显示结果 */
      },
      ...mapMutations(['send']),
    },
    props: ['swaggerCategory', 'countTo', 'bg', 'leftDropDownBoxContent'],
    components: {FormFold, SubmitForm, JsonView}
  }
</script>
<style>


  /* 响应参数说明部分 */
  .ResponseParameter .head {
    font-size: 16px;
    font-weight: 700;
    background-color: #F8F8F8;
  }

  .ResponseParameter > ul {
    overflow: hidden;
    border: 1px solid #ddd;
  }

  .ResponseParameter > ul li {
    overflow: hidden;
    border-bottom: 1px solid #ddd;
  }

  .ResponseParameter > ul li:last-child {
    border-bottom: 0;
  }

  .ResponseParameter > ul li > span {
    width: 30%;
    float: left;
    padding: 8px 4px;
    border-right: 1px solid #ddd;
  }

  .ResponseParameter > ul li > span:last-child {
    border-right: 0;
  }

  /* 调试结果区域样式 */
  .debugging-result {
    text-align: left;
    font-size: 0;
  }

  .debugging-result > span {
    font-size: 14px;
    display: inline-block;
    padding: 10px 15px;
    border: 1px solid #EBEBEB;
    position: relative;
    border-right: 0;
    bottom: -1px;
  }

  .debugging-result > span:last-of-type {
    border-right: 1px solid #EBEBEB;
  }

  .debugging-result > span.active {
    box-shadow: 0 3px #89BF05 inset;
    color: #89BF05;
    border-bottom: 1px solid transparent;
    border-bottom: 1px solid #FFFFFF;
  }

  .debugging-curl > div {
    color: #393939;
    font-size: 13px;
    white-space: pre;
    overflow-x: auto;
    padding: 15px;
  }

  .result-content {
    border-top: 1px solid #EBEBEB;
    padding-top: 15px;
  }

  .result-content > div {
    border: 1px solid #ddd;
    min-height: 210px;
    font-size: 16px;
    text-align: left;
    padding: 40px 15px 15px;
  }

  .debugging-header > ul {
    border: 1px solid #ddd;
  }

  .debugging-header li {
    border-bottom: 1px solid #ddd;
  }

  .debugging-header li > span {
    padding: 10px 15px 10px 5px;
    display: inline-block;
  }

  .debugging-header li > span:first-child {
    font-weight: 700;
    width: 38%;
    border-right: 1px solid #ddd;
  }

  .debugging-header li > span:last-child {
    width: 45%;
  }

  .debugging-header .head {
    font-weight: 700;
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
  }

  .table-td {
    border-right: 1px solid #ddd;
    width: 15%;
    float: left;
    padding: 8px 4px;
    text-align: left;
  }

  .table-td:last-child {
    border-right: 0;
  }

  /* 调试：附带参数列表 */

  /*!* 调试页面 *!
  .content-url {
    overflow: hidden;
    height: 35px;
    margin-bottom: 10px;
    position: relative;
  }

  .content-url > span {
    width: 80px;
    color: #fff;
    text-align: center;
    height: 100%;
    line-height: 35px;
    position: absolute;
    left: 0;
    top: 0;
  }

  .content-url > div {
    display: block;
    margin-left: 80px;
    margin-right: 88px;
    height: 35px;
  }

  .content-url > div input {
    color: #858585;
    background-color: #fff;
    border: 1px solid #d5d5d5;
    padding: 5px 4px;
    line-height: 1.2;
    font-size: 14px;
    font-family: inherit;
  }

  .content-url > button{
    position: absolute;
    right: 0;
    top: 0;
    height: 35px;
    background: #40A8FF;
    padding: 0 23px;
    border: 0;
    color: #fff;
  }

  .content-url > button:active {
    background-color: #1b6aaa !important;
    border-color: #428bca;
  }
*/
  /* 接口详细信息列表 */
  .swagger-content, .debugging-content {
    border-top: 1px solid #dbdbdb;
    padding: 20px 10px;
  }

  .content-list {
    text-align: left;
    margin: 0;
    padding: 15px;
    border: 1px solid #DDDDDD;
  }

  .content-list > li {
    list-style: none;
    text-align: left;
    border-bottom: 1px solid #DDDDDD;
    overflow: hidden;
  }

  .content-list > li > span {
    display: inline-block;
    width: 108px;
    padding: 10px 8px 8px;
  }

  .content-list > li > div {
    margin-left: 125px;
    padding: 10px;
  }

  .content-list > li > div > span {
    display: inline-block;
  }

  .content-list > li > div .request-table {
    padding: 8px;
  }

  .content-list > li > div .request-table > ul {
    border: 1px solid #ddd;
    border-bottom: 0;
  }

  .content-list > li > span:nth-child(1) {
    font-weight: 700;
    border-right: 1px solid #ddd;
    margin-bottom: -1000px;
    padding-bottom: 1000px;
    min-height: 26px;
    vertical-align: top;
    float: left;
  }

  /*  接口详细内容 */
  .swagger-main {
    box-shadow: 1px 1px 5px #f3f4ef;
    border: 1px solid #F3F4EF;
    margin-left: 43%;
    margin-right: 15px;
    transition: all 0.2s;
  }

  .switch {
    margin-top: 15px;
    text-align: left;
    padding-left: 20px;
    font-size: 0;
  }

  .switch span {
    font-size: 14px;
    display: inline-block;
    padding: 10px 15px;
    border: 1px solid #EBEBEB;
    position: relative;
    top: 1px;
  }

  .switch span:nth-child(1) {
    position: relative;
    right: -1px;
  }

  .switch span.active {
    box-shadow: 0 3px #89BF05 inset;
    color: #89BF05;
    border-bottom: 1px solid #FFFFFF;
  }

</style>
