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
        <li><span>接口说明</span>
          <div><span>{{swaggerCategory[countTo] && swaggerCategory[countTo].pathInfo && swaggerCategory[countTo].pathInfo.description ? swaggerCategory[countTo].pathInfo.description : ""}}</span></div>
        </li>
        <li><span>consumes</span>
          <div>
            <span>{{swaggerCategory[countTo] && swaggerCategory[countTo].pathInfo && swaggerCategory[countTo].pathInfo.consumes&& swaggerCategory[countTo].pathInfo.consumes['length'] ? swaggerCategory[countTo].pathInfo.consumes[0] : ""}}</span>
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
                  <form-fold :depth="0"
                             :properties="item.properties&&item.properties.properties||(item.properties&&item.properties[0]&&item.properties[0].properties)"
                             :keyTo="key"
                             :item="item"></form-fold>
                </div>
              </ul>
            </div>
            <span v-else>暂无</span>
          </div>
        </li>
        <li><span>响应Model</span>
          <div v-if="typeof jsonObject=='object'">
            <a href="javascript:" class="fontColor copyJson" :data-clipboard-text="jsonValue">复制JSON</a>
            <span v-if="jsonObject['length']">[</span>
            <span v-else>{</span>
            <ul v-for="(item,key) in jsonObject">
              <Json-View v-bind:obj="item" :keyTo="key" v-bind:indentation="indentation"></Json-View>
            </ul>
            <span v-if="jsonObject['length']">]</span>
            <span v-else>}</span>
          </div>
          <div v-else>无</div>
        </li>
        <li><span>响应参数说明</span>
          <div class="ResponseParameter">
            <span v-if="(typeof InterfaceResponse) != 'object'">{{InterfaceResponse}}</span>
            <ul v-else>
              <li class="head"><span>参数名称</span><span>类型</span><span>说明</span></li>
              <div v-for="(item,key) in InterfaceResponse">
                <form-fold :name="'response'" :depth="0" :properties="item.properties" :keyTo="key"
                           :item="item"></form-fold>
              </div>
            </ul>
          </div>
        </li>
        <li>
          <span>响应</span>
          <div class="ResponseCode">
            <span v-show="(typeof InterfaceResponse) != 'object'">{{InterfaceResponse}}</span>
            <ul v-show="(typeof InterfaceResponse) == 'object'">
              <li class="head"><span>状态码</span><span>说明</span><span>Schema</span></li>
              <li v-for="(item,index) in InterfaceResponseCode">
                <div>
                  <span>{{index}}</span>
                </div>
                <div>
                  <span>{{item.description ? item.description : "无"}}</span>
                </div>
                <div>
                  <a v-if="responseCodeSchema(item)" @click="responseCodePreToggle(index)" class="fontColor"
                     href="javascript:">{{responseCodePre && responseCodePre[index] && responseCodePre[index] == true ?
                    '收缩' : '展开'}}</a>
                  <span v-if="responseCodeSchema(item)"
                        v-show="!responseCodePre[index]">{{item.schema ? (item.schema.$ref ? responseObjectName : (item.schema.type && item.schema.type === "array" && item.schema.items) ? item.schema.items : "无") : "无"}}</span>
                  <span v-show="responseCodePre[index]"
                        :class="{format: responseCodeSchema(item)&&responseCodePre[index]}">{{item.schema ? (item.schema.$ref ? jsonObject : (item.schema.type && item.schema.type === "array" && item.schema.items) ? jsonObject : "无") : "无"}}
                </span>
                </div>
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
                   :swaggerCategory="swaggerCategory" :selected="selected" :count="count" :countTo="countTo"
                   :InterfaceRequest="InterfaceRequest">
      </submit-form>
      <div class="debugging-result" v-show="resultShow">
      <span style="cursor:pointer;" @click="debugging='content'"
            :class="[debugging=='content'?'active':'']">响应内容</span>
        <span style="cursor:pointer;" @click="debugging='cookies'"
              :class="[debugging=='cookies'?'active':'']">Cookies</span>
        <span style="cursor:pointer;" @click="debugging='header'"
              :class="[debugging=='header'?'active':'']">Header</span>
        <span style="cursor:pointer;" @click="debugging='curl'" :class="[debugging=='curl'?'active':'']">curl方式</span>
        <b>Time:<a href="javascript:"> {{requestTime}} ms</a></b>
        <div class="result-content">
          <div class="content" v-show="debugging=='content'">
            <a href="javascript:" class="fontColor copyJson" :data-clipboard-text="jsonObjectToValue">复制JSON</a>
            <!--<div v-if="isJsonObject">
              {
              <ul>
                <li v-for="(item,key) in jsonObjectTo">
                  <Json-View v-bind:obj="item" :keyTo="key" v-bind:indentation="indentation"></Json-View>
                </li>
              </ul>
              }
            </div>-->
            <li style="white-space: pre-wrap;color: #1A1A1A;font-size: 18px;" ><span v-html="formatJsonObjectTo"></span></li>
          </div>
          <div v-show="debugging=='cookies'">
            <span>暂无</span>
          </div>
          <div class="debugging-header" v-show="debugging=='header'">
            <ul style="border: 1px solid #ddd;">
              <li class="head"><span>请求头</span><span>value</span></li>
              <li>
                <span>Date</span><span>{{debugResponse && debugResponse.headers && debugResponse.headers['Date']}}</span>
              </li>
              <li>
                <span>transfer-encoding</span><span>{{debugResponse && debugResponse.headers && debugResponse.headers['transfer-encoding']}}</span>
              </li>
              <li>
                <span>x-application-context</span><span>{{debugResponse && debugResponse.headers && debugResponse.headers['x-application-context']}}</span>
              </li>
              <li>
                <span>content-type</span><span>{{debugResponse && debugResponse.headers && debugResponse.headers['content-type']}}</span>
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
  import Clipboard from 'clipboard'
  import {mapState, mapMutations, mapActions} from 'vuex'
  import FormFold from './formFold.vue'
  import {deepCopy, basicTypeInit, formatterJson} from './../util/util'
  import SubmitForm from './submitForm.vue'
  import JsonView from './jsonView.vue'
  new Clipboard('.copyJson');
  export default {
    name: "app",
    data() {
      return {
        formatJsonObjectTo:"",/* 格式化后的响应JSON数据 */
        jsonValue:"",/* 复制的表单响应JSON数据 */
        jsonObjectToValue:"",/* 复制的实际响应JSON数据 */
        isJsonObject: false,
        childForm: {},
        indentation: 1,
        jsonObject: "",
        jsonObjectTo: "",
        switchA: 0,
        resultShow: false,
        debugging: 'content',
        curlMode: "",
        parameterValue: {},
        responseCodePre: [],
        responseObjectName: ""
      }
    },
    computed: {
      /**
       * @return {string}
       */
      ...mapState(['authorization']),
      InterfaceResponse: function () {/* 响应参数 */
        let resp = deepCopy(this.swaggerCategory[this.countTo] && this.swaggerCategory[this.countTo].pathInfo && this.swaggerCategory[this.countTo].pathInfo.responses);
        let respBasis = false;
        let respState;
        if (resp === undefined) {
          return '加载失败';
        }
        for (let key in resp) {/* 通过判断响应码判定请求是否成功 */
            if (resp.hasOwnProperty(key)&&parseInt(key) >= 200 && parseInt(key) <= 299) {
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
              let deftion = undefined;
              let definition = {};
              let Response = {};
              Response[refType] = this.formatRequest(ref);
              deftion = this.JSONinit(refType);
              if (schema["type"] && schema["type"] === "array") {
                let arrs={};
                arrs['properties'] = Response;
                arrs['type']="array";
                definition['Array'] = arrs;
                this.jsonObject = [];
                let jsonObj= {};
                jsonObj[refType]=deftion;
                this.jsonObject.push(jsonObj)
              } else {
                definition = Response;
                this.jsonObject = deftion;
              }
              this.jsonValue=JSON.stringify(this.jsonObject);
              return definition;
            } else {
              //未发现ref属性
              if (schema.hasOwnProperty("type")) {
                this.jsonObject = schema["type"];
                return schema["type"];
              }
              this.jsonValue=JSON.stringify(this.jsonObject);
              return "无";
            }
          } else {
            this.jsonValue=JSON.stringify(this.jsonObject);
            return "无";
          }
        } else {
          this.jsonValue=JSON.stringify(this.jsonObject);
          return "没有指定响应成功信息";
        }
      },
      InterfaceResponseCode: function () {/*  响应码 */
        let resp = deepCopy(this.swaggerCategory[this.countTo] && this.swaggerCategory[this.countTo].pathInfo && this.swaggerCategory[this.countTo].pathInfo.responses);
        let respBasis = false;
        let respState;
        if (resp === undefined) {
          return "加载失败";
        }
        for (let key in resp) {
            if (resp.hasOwnProperty(key)&&parseInt(key) >= 200 && parseInt(key) <= 299) {
              respBasis = true;
              respState = key;
              break;
          }
        }
        if (respBasis) {
          return resp;
        }
        return {};
      },
      InterfaceRequest: function () {/* 请求参数 */
        if (!this.swaggerCategory[this.countTo] && this.swaggerCategory[this.countTo].pathInfo && this.swaggerCategory[this.countTo].pathInfo.parameters) {
          this.childForm = [];
          return false;
        }
        /* 请求参数的遍历 */
        let result = {};
        let parameters = deepCopy(this.swaggerCategory[this.countTo].pathInfo.parameters);
        let definitions = deepCopy(this.leftDropDownBoxContent.definitions);
        if (parameters === undefined) {
          this.childForm = [];
          return result;
        }
        for (let i in parameters) {
          if(parameters.hasOwnProperty(i)) {
            result[i] = parameters[i];
            if (parameters[i].schema && parameters[i].schema.$ref) {
              result[i]['properties'] = this.formatRequest(parameters[i].schema.$ref);
            }
            if (parameters[i].$ref) {
              result[i]['properties'] = this.formatRequest(parameters[i].$ref);
            }
            if (parameters[i].schema && parameters[i].schema.type && parameters[i].schema.type === 'array' && parameters[i].schema.items && parameters[i].schema.items.$ref) {
              let arr = [];
              arr.push(this.formatRequest(parameters[i].schema.items.$ref));
              result[i]['properties'] = arr;
            }
          }
        }
        let resultCopy = deepCopy(result);
        for (let key in resultCopy) {
          /* 如果该字段没有type属性且存在子字段，子字段内有类型type属性 */
          /* 判断是否为list数组类型 */
          if(resultCopy.hasOwnProperty(key)) {
            if ((!resultCopy[key].type && resultCopy[key].properties && resultCopy[key].properties.type === "object")
              || (resultCopy[key].properties && Array.isArray(resultCopy[key].properties))) {
              /* 包含子字段 */
              if (resultCopy[key].properties && Array.isArray(resultCopy[key].properties)) {
                this.parameterValue[key] = [];
                this.parameterValue[key].push(this.iniObject(resultCopy[key].properties && resultCopy[key].properties[0] && resultCopy[key].properties[0].properties))
              } else {
                this.parameterValue[key] = {};
                this.parameterValue[key] = this.iniObject(resultCopy[key].properties.properties);
              }
            } else {
              /* 不包含子字段 */
              this.parameterValue[key] = basicTypeInit(resultCopy[key].type);
            }
          }
        }

        //提取数据传递给子数据
        this.childForm = [];
        for (let key in result) {
          if(result.hasOwnProperty(key)) {
            let array = {};
            this.childForm[key] = {};
            array['name'] = result && result[key] && result[key]['name'];
            array['default'] = this.parameterValue[key];
            array['required'] = result && result[key] && result[key]['required'];
            this.childForm[key] = deepCopy(array);
          }
        }
          for(let i in parameters){/* 对于list数据类型进行加层包装，使表格展现更加直观 */
          if (parameters.hasOwnProperty(i)&&parameters[i].schema && parameters[i].schema.type && parameters[i].schema.type === 'array' && parameters[i].schema.items && parameters[i].schema.items.$ref) {
            let formatData = this.formatRequest(parameters[i].schema.items.$ref);
            let title = formatData.title;
            let objData = {};
            objData[title]=formatData;
            result[i]['properties']=objData;
            let arrsTo = [];
            arrsTo.push(result[i]);
            result[i] = {
              'properties':arrsTo,
              'name':"Array",
              'type':"array",
              'title':"Array",
              'description':"Array"
            };
          }
        }
        return result;
      },
      debugResponse() {/* 从请求中获取到的响应参数 */
        return this.$store.state.debugRequest.debugResponse;
      },
      requestTime() {
        return this.$store.state.debugRequest.requestTime;
      },
      authorizeObj() {
        return this.$store.state.debugRequest.authorizeObj;
      },
      isExistSecurity() {
        let is = this.swaggerCategory && this.swaggerCategory[this.countTo] && this.swaggerCategory[this.countTo].pathInfo && this.swaggerCategory[this.countTo].pathInfo.security;
        return !!is;
      }
    },
    watch: {
      count: function () {
        this.iniData();
      },
      countTo: function () {
        /*this.switchA = 0;
        this.resultShow = false;*/
        this.iniData();
      }
    },
    methods: {
      ...mapActions(["carriedSend"]),
      ...mapMutations(["initialization", "send"]),
      iniData: function () {
        this.switchA = 0;
        this.resultShow = false;
        this.childForm = {};
        this.indentation = 1;
        this.isJsonObject = false;
        this.jsonObject = "";
        this.jsonObjectTo = "";
        this.debugging = 'content';
        this.curlMode = "";
        this.parameterValue = {};
        this.responseCodePre = [];
        this.responseObjectName = "";
      },
      responseCodeSchema: function (item) {/* 响应码部分 数据是否存在Schema字段 */
        if (item.schema && item.schema.type && item.schema.type === 'array' && item.schema.items) {
          return true;
        }
        if (item.schema && item.schema.$ref) {
          this.responseObjectName = item.schema.$ref.match("#/definitions/(.*)")[1];
          return true;
        }
        return false;
      },
      responseCodePreToggle: function (index) {/* 响应码部分数据JSON格式化展开收缩切换 */
        if (this.responseCodePre && this.responseCodePre[index] && this.responseCodePre[index]) {
          this.$set(this.responseCodePre, index, !this.responseCodePre[index])
        } else {
          this.$set(this.responseCodePre, index, true)
        }
      },
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
          if (this.InterfaceRequest.hasOwnProperty(key)&&!this.InterfaceRequest[key].required) {
            return false;
          }
        }
        return true;
      },
      iniObject: function (properties) {/* 传入对象，对其进行类型初始化 */
        let obj = {};
        for (let key in properties) {
          if(properties.hasOwnProperty(key)) {
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
        }
        return obj;
      },
      formatRequest: function (itemsRef) {/* 传入#/definitions/User，进行格式化 */
        let result = {};
        if (itemsRef === undefined || itemsRef === null || (typeof  itemsRef) !== "string") {
          return result;
        }
        let objName = itemsRef.match("#/definitions/(.*)") && itemsRef.match("#/definitions/(.*)")[1];
        let definitions = deepCopy(this.leftDropDownBoxContent.definitions);
        if (objName === null || objName === undefined || definitions === undefined) {
          return result;
        }
        for (let key in definitions) {
            if (definitions.hasOwnProperty(key)&&key.toLowerCase() === objName.toLowerCase()) {
              result = deepCopy(definitions[key]);
              let properties = definitions[key].properties;
              if (properties === undefined || properties === null || (typeof properties) === "string") {
                return result;
              }
              for (let k in properties) {
                if(properties.hasOwnProperty(k)) {
                  if ((properties[k].items && properties[k].items.$ref) || properties[k].$ref) {
                    let Ref = (properties[k].items && properties[k].items.$ref) ? (properties[k].items && properties[k].items.$ref) : properties[k].$ref;
                    if (properties[k].type === 'array') {
                      result.properties[k].properties = [];
                      let adds = this.formatRequest(Ref);
                      adds.name === undefined || adds.name === null ? "" : adds['name'] = Ref.match("#/definitions/(.*)")[1].toLowerCase();
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
        }
        return result;
      },
      titleCase5: function (str) {
        return str.toLowerCase().replace(/( |^)[a-z]/g, (L) => L.toUpperCase());
      },
      JSONinit: function (refType) {/*  */
        let _this = this;
        let definitionsArray = deepCopy(_this.leftDropDownBoxContent && _this.leftDropDownBoxContent.definitions);
        let deftion = undefined;
        if (definitionsArray === undefined) {
          return deftion;
        }
        for (let i in definitionsArray) {
          if (definitionsArray.hasOwnProperty(i)&&i === refType) {
            deftion = definitionsArray[i].properties;
            break
          }
        }
        if (deftion === null || deftion === undefined) {
          let obj = {};
          obj[refType] = deftion;
          return obj;
        }
        for (let key in deftion) {
          if (deftion.hasOwnProperty(key)) {
            if (deftion[key].$ref && deftion[key].type === "array") {
              deftion[key] = {};
              continue;
            }
            if (deftion[key].$ref) {
              let schema = deftion[key];
              let ref = (schema["type"] && schema["type"] === "array" && schema["items"]) ? schema["items"].$ref : schema["$ref"];
              let regex = new RegExp("#/definitions/(.*)$", "ig");
              if ((typeof ref === "string") && regex.test(ref)) {
                let a = ref.match("#/definitions/(.*)");
                let refType2 = (ref.match("#/definitions/(.*)") === null ? "" : ref.match("#/definitions/(.*)")[1]);
                deftion[key] = this.JSONinit(refType2);
                continue;
              }
            }
            if (deftion[key].type === "array" && deftion[key].items) {
              let schema = deftion[key];
              let ref = (schema["type"] && schema["type"] === "array" && schema["items"]) ? schema["items"].$ref : schema["$ref"];
              let regex = new RegExp("#/definitions/(.*)$", "ig");
              if ((typeof ref === "string") && regex.test(ref)) {
                let a = ref.match("#/definitions/(.*)");
                let refType2 = (ref.match("#/definitions/(.*)") === null ? "" : ref.match("#/definitions/(.*)")[1]);
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
            if (deftion[key].type === "integer"|| deftion[key].type === "number") {
              deftion[key] = 0;
              continue;
            }
            if (deftion[key].type === "string") {
              deftion[key] = "";
              continue;
            }
          }
        }
        return deftion;
      },
      getForm: function (data, param) {/* param为假设存在文件上传时所传输的文件对象 */
        let _this = this;
        let result = [];
        for (let key in data) {
          if (data.hasOwnProperty(key)&&data[key].required) {
            let obj = [];
            obj.push(data[key].name);
            obj.push(data[key].default);
            obj.push(_this.swaggerCategory[_this.countTo].pathInfo.parameters[key]);
            result.push(obj);
          }
        }
        _this.stitchUrl(result, param);
        /* param为假设存在文件上传时所传输的文件对象 */
      },
      stitchUrl: function (result, param) {
        let _this = this;
        let url = (_this.swaggerCategory && _this.swaggerCategory[_this.countTo] && _this.swaggerCategory[_this.countTo].pathName) ? _this.swaggerCategory[_this.countTo].pathName : '',
          params = {},
          headerParams = {'Content-Type': 'application/json;charset=UTF-8'},
          reqdata = "",
          bodyparams = "";
//
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
        /* 判断调试请求中是否有Security字段 */
        if (this.isExistSecurity) {/* headerParams */
          for (let key in this.authorizeObj) {
            if(this.authorizeObj.hasOwnProperty(key)) {
              headerParams[key] = this.authorizeObj[key];
            }
          }
        }
        /*  判断是否为文件类型上传 */
        for (let key in reqdata) {
          if (reqdata.hasOwnProperty(key)&&param !== undefined && reqdata[key] && reqdata[key]['in'] && reqdata[key]['in'] === 'formData' && reqdata[key]['type'] && reqdata[key]['type'] === 'file') {
            headerParams['Content'] = 'multipart/form-data; charset=utf-8';
            reqdata = param;
          }
        }
        _this.$store.dispatch('carriedSend', {
          url: process.env.SWAGGER_URL !== null && process.env.SWAGGER_URL.length > 0 ? process.env.SWAGGER_URL + url : url,
          headerParams: headerParams,
          type: _this.swaggerCategory[this.countTo].name,
          data: reqdata
        }).then(function () {
          _this.StitchingCurl(headerParams, jsonReqdata)
        })

      },
      StitchingCurl: function (headerParams, reqData) {
        let _this = this;
        let headers = "";
        let contentType = `--header 'application/json;charset=UTF-8'`;
        let contentUrl = "";
        let curlAccept = "-H \"accept: */*\"";
        for (let key in headerParams) {
          headers += `${key}: ${headerParams[key]}`;
        }
        /* 生成 CURL 头部数据 */
        if (headers !== '' && headers !== undefined && headers.length > 0) {
          headers = `--header '${headers}' `
        }
        if (_this.debugResponse !== null) {
          // response contentType
          if (_this.debugResponse.headers !== null && _this.debugResponse.headers !== undefined
            && _this.debugResponse.headers['content-type'] !== null && _this.debugResponse.headers['content-type'] !== undefined) {
            contentType = `--header 'Content-Type: ${_this.debugResponse.headers['content-type']}'`;
            curlAccept = `-H 'Accept: ${_this.debugResponse.headers['content-type']}'`;
          }
          // url
          if (_this.debugResponse.config !== null && _this.debugResponse.config.url !== undefined) {
            //获取当前网址，如： http://localhost:8083/battcn/index.html
            const curWwwPath = window.document.location.href;
            //获取主机地址之后的目录，如： battcn/index.html
            const pathName = window.document.location.pathname;
            const pos = curWwwPath.indexOf(pathName);
            //获取主机地址，如： http://localhost:8083
            const localhostPath = curWwwPath.substring(0, pos);
            contentUrl = process.env.SWAGGER_URL !== null && process.env.SWAGGER_URL.length > 0 ? `'${_this.debugResponse.config.url}'` : `'${localhostPath + process.env.SWAGGER_URL + _this.debugResponse.config.url}'`;
          }
        }
        if (_this.swaggerCategory[this.countTo].name.toLowerCase() === 'get') {
          _this.curlMode = `curl -X ${_this.swaggerCategory[this.countTo].name.toUpperCase()} ${curlAccept} ${headers} ${contentUrl}`;
        } else {
          /* d data 非头部附带数据,只用于非get类型请求 */
          let curlData = ` -d  '${reqData ? formatterJson(reqData) : ""}' `;
          _this.curlMode = `curl -X  ${_this.swaggerCategory[this.countTo].name.toUpperCase()} ${contentType} ${curlAccept} ${headers} ${reqData === '{}' ? "" : curlData} ${contentUrl}`;
        }
        if (this.debugResponse !== null && this.debugResponse !== undefined) {
          // 正确响应
          if (this.debugResponse.status !== null && this.debugResponse.status >= 200 && this.debugResponse.status <= 299) {
            this.isJsonObject = false;
            try {
              this.jsonObjectTo = (typeof this.debugResponse.data === 'object') ? this.debugResponse.data : JSON.parse(this.debugResponse.data);
            } catch (e) {
              this.isJsonObject = false;
            }
            this.jsonObjectTo = this.debugResponse.data;
            if (typeof this.jsonObjectTo === 'object') {
              this.isJsonObject = true;
            }
            this.jsonObjectToValue=JSON.stringify(this.jsonObjectTo);
            console.log(JSON.stringify(this.jsonObjectTo))
            this.formatJsonObjectTo=formatterJson(JSON.stringify(this.jsonObjectTo))
          } else {
            try {
              this.isJsonObject = (typeof this.debugResponse.response.data === 'object' ? this.debugResponse.response.data : JSON.parse(this.debugResponse.response.data));
            } catch (e) {
              this.isJsonObject = false;
            }
            this.jsonObjectTo = this.debugResponse.response.data;
            this.jsonObjectToValue=JSON.stringify(this.jsonObjectTo);
            this.formatJsonObjectTo=formatterJson(JSON.stringify(this.jsonObjectTo))
          }
        }
        this.resultShow = true;
        /* 显示结果 */
      },
      failureJump: function () {/* 请求失败时跳转至登录路由 */
        this.$router.push('swagger-login.html');
        console.log("请进行身份验证后使用！")
      }
    },
    props: ['swaggerCategory', 'selected', 'count', 'countTo', 'bg', 'leftDropDownBoxContent'],
    components: {FormFold, SubmitForm, JsonView},
    created() {
      let methods = this.failureJump;
      this.initialization(methods);
    }
  }
</script>
<style>
  .copyJson{
    float: right;text-decoration: none;    font-size: 12px;
  }

  /* 响应参数说明部分 */
  .ResponseParameter .head {
    font-size: 16px;
    font-weight: 700;
    background-color: #F8F8F8;
  }

  .ResponseParameter > ul {
    overflow: hidden;
    border: 1px solid #ddd;
    border-bottom: 0;
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

  .ResponseParameter .head span {
    text-align: center;
  }

  .ResponseParameter > ul li > span:last-child {
    border-right: 0;
    width: 35%;
  }

  /*  响应状态码部分 */
  .ResponseCode li.head {
    font-size: 16px;
    font-weight: 700;
    background-color: #F8F8F8;
  }

  .ResponseCode > ul {
    overflow: hidden;
    border: 1px solid #ddd;
  }

  .ResponseCode > ul li {
    overflow: hidden;
    border-bottom: 1px solid #ddd;
    position: relative;
  }

  .ResponseCode > ul li:last-child {
    border-bottom: 0;
  }

  .ResponseCode > ul li > div,
  .ResponseCode li.head span {
    width: 50%;
    float: left;
    position: relative;
    padding-bottom: 8px;
    box-sizing: border-box;
  }

  .ResponseCode li.head span {
    padding: 8px 4px;
    border-right: 1px solid #ddd;
  }

  .ResponseCode > ul li > div:first-child,
  .ResponseCode li.head span:first-child {
    width: 15%;
  }

  .ResponseCode > ul li > div:last-child,
  .ResponseCode li.head span:last-child {
    border-right: 0;
    width: 35%;
  }

  .ResponseCode > ul li > div:last-child a {
    text-decoration: none;
    font-size: 12px;
    position: absolute;
    right: 0;
    top: 5px;
  }

  .ResponseCode > ul li > div span {
    padding-bottom: 1000px;
    margin-bottom: -1000px;
    display: block;
    border-right: 1px solid #ddd;
    padding-top: 8px;
    padding-left: 4px;
    padding-right: 4px;
  }

  .ResponseCode > ul li div span.format {
    white-space: pre-wrap;
  }

  .ResponseCode > ul li > div:last-child span {
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

  .debugging-result > b {
    font-size: 12px;
    float: right;
    color: #858585;
    margin-top: 12px;
  }

  .debugging-result > b a {
    text-decoration: none;
    color: #2E8BF0;
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

  /* td部分 */
  .content-list > li > div .request-table table {
    min-height: 18px;
    width: 100%;
    border: 1px solid #ddd;
    border-collapse: collapse
  }

  .content-list > li > div .request-table table tbody {

  }

  .content-list > li > div .request-table table tbody tr {
  }

  .content-list > li > div .request-table table tbody tr th {
    text-align: center;
    border: 1px solid #ddd;
    padding: 8px 4px;
    font-size: 16px;
    font-weight: 700;
    background-color: #F8F8F8;
  }

  .content-list > li > div .request-table table tbody tr th:nth-child(1),
  .content-list > li > div .request-table table tbody tr th:nth-child(6),
  .content-list > li > div .request-table table tbody tr td:nth-child(1),
  .content-list > li > div .request-table table tbody tr td:nth-child(6) {
    width: 15%;
  }

  .content-list > li > div .request-table table tbody tr th:nth-child(3),
  .content-list > li > div .request-table table tbody tr th:nth-child(4),
  .content-list > li > div .request-table table tbody tr td:nth-child(3),
  .content-list > li > div .request-table table tbody tr td:nth-child(4) {
    width: 10%;
  }

  .content-list > li > div .request-table table tbody tr th:nth-child(5),
  .content-list > li > div .request-table table tbody tr td:nth-child(5) {
    width: 5%;
  }

  .content-list > li > div .request-table table tbody tr td {
    border: 1px solid #ddd;
    padding: 8px 4px;
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

  /* 响应式 */
  @media screen and (min-width: 1600px) {
    .swagger-main {
      margin-left: 36%;
    }
  }

</style>
