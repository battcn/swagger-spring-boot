<template xmlns:v-bind="http://www.w3.org/1999/xhtml" xmlns:v-on="">
  <div class="swagger-main">
    <div class="switch">
      <span @click="switchA=0" :class="[switchA==0?'active':'']">接口说明</span>
      <span @click="switchA=1" :class="[switchA==1?'active':'']">在线调试</span>
    </div>
    <div v-show="switchA==0" class="swagger-content">
      <ul class="content-list">
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
          <div>
            <span>{{swaggerCategory[countTo] && swaggerCategory[countTo].pathInfo && swaggerCategory[countTo].pathInfo.description ? swaggerCategory[countTo].pathInfo.description : ""}}</span>
          </div>
        </li>
        <li><span>consumes</span>
          <div>
            <span>{{swaggerCategory[countTo] && swaggerCategory[countTo].pathInfo && swaggerCategory[countTo].pathInfo.consumes && swaggerCategory[countTo].pathInfo.consumes['length'] ? swaggerCategory[countTo].pathInfo.consumes[0] : ""}}</span>
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
                  <!--<span class="table-td">in</span>-->
                  <span class="table-td">是否必须</span>
                </li>
                <div v-for="(item,key) in interfaceRequest">
                  <form-fold :depth="1"
                             :properties="item.properties&&item.properties.properties||(item.properties&&item.properties[0]&&item.properties[0].properties)"
                             :keyTo="key"
                             :item="item" :requiredArray="requiredArray"></form-fold>
                </div>
              </ul>
            </div>
            <span v-else>暂无</span>
          </div>
        </li>
        <li><span>Example Model</span>
          <div v-if="typeof jsonObject=='object'">
            <a href="javascript:" class="font-color copy-json" :data-clipboard-text="jsonValue">复制JSON</a>
            <span v-if="jsonObject['length']">[</span>
            <span v-else>{</span>
            <ul v-for="(item,key) in jsonObject">
              <json-view v-bind:obj="item" :keyTo="key" v-bind:indentation="indentation"></json-view>
            </ul>
            <span v-if="jsonObject['length']">]</span>
            <span v-else>}</span>
          </div>
          <div v-else>无</div>
        </li>
        <li><span>响应参数说明</span>
          <div class="response-parameter">
            <span v-if="(typeof interfaceResponse) != 'object'">{{interfaceResponse}}</span>
            <ul v-else>
              <li class="head"><span>参数名称</span><span>类型</span><span>说明</span></li>
              <div v-for="(item,key) in interfaceResponse">
                <form-fold :name="'response'" :depth="0" :properties="item.properties" :keyTo="key"
                           :item="item"></form-fold>
              </div>
            </ul>
          </div>
        </li>
        <li>
          <span>响应</span>
          <div class="response-code">
            <span v-show="(typeof interfaceResponse) != 'object'">{{interfaceResponse}}</span>
            <ul v-show="(typeof interfaceResponse) == 'object'">
              <li class="head"><span>状态码</span><span>说明</span><span>Schema</span></li>
              <li v-for="(item,index) in interfaceResponseCode">
                <div>
                  <span>{{index}}</span>
                </div>
                <div>
                  <span>{{item.description ? item.description : "无"}}</span>
                </div>
                <div>
                  <a v-if="_responseCodeSchema(item)" @click="_responseCodePreToggle(index)" class="font-color"
                     href="javascript:">{{responseCodePre && responseCodePre[index] && responseCodePre[index] == true ?
                    '收缩' : '展开'}}</a>
                  <span v-if="_responseCodeSchema(item)"
                        v-show="!responseCodePre[index]">{{item.schema ? (item.schema.$ref ? responseObjectName : (item.schema.type && item.schema.type === "array" && item.schema.items) ? item.schema.items : "无") : "无"}}</span>
                  <span v-show="responseCodePre[index]"
                        :class="{'format': _responseCodeSchema(item)&&responseCodePre[index]}">{{item.schema ? (item.schema.$ref ? jsonObject : (item.schema.type && item.schema.type === "array" && item.schema.items) ? jsonObject : "无") : "无"}}
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
      <commit v-on:getCollection="getForm" :childForm.sync="childForm"
              :parameterValue="parameterValue"
              v-if="swaggerCategory[countTo]&&swaggerCategory[countTo].pathInfo"
              :swaggerCategory="swaggerCategory" :selected="selected" :count="count" :countTo="countTo"
              :interfaceRequest="interfaceRequest">
      </commit>
      <div class="debugging-result" v-show="resultShow">
      <span @click="debugging='content'"
            :class="[debugging=='content'?'active':'']">响应内容</span>
        <span @click="debugging='cookies'"
              :class="[debugging=='cookies'?'active':'']">Cookies</span>
        <span @click="debugging='header'"
              :class="[debugging=='header'?'active':'']">Header</span>
        <span @click="debugging='curl'" :class="[debugging=='curl'?'active':'']">curl方式</span>
        <b>Time:<a href="javascript:"> {{debugRequestTime}} ms</a></b>
        <div class="result-content">
          <div class="content" v-show="debugging=='content'">
            <a v-if="debugResponse && debugResponse.headers && debugResponse.headers['content-type']!=='image/jpeg'"
               href="javascript:" class="font-color copy-json" :data-clipboard-text="jsonObjectToValue">复制JSON</a>
            <li>
              <pre
                v-if="debugResponse && debugResponse.headers && debugResponse.headers['content-type']!=='image/jpeg'||(debugResponse&&debugResponse.response&&debugResponse.response.headers&&debugResponse.response.headers['content-type'])"
                style="font-family: inherit;" v-html="formatJsonObjectTo"></pre>
              <p v-else-if="!debugResponse.data&&debugResponse.config&&debugResponse.config.data"
                 v-text="debugResponse.config.data"></p>
              <p v-else v-html="codeImgUrl"></p>
            </li>
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
                <span>content-type</span><span>{{debugResponse && debugResponse.headers && debugResponse.headers['content-type'] || (debugResponse && debugResponse.response && debugResponse.response.headers && debugResponse.response.headers['content-type'])}}</span>
              </li>
              <li>
                <span>response-code</span><span>{{(debugResponse && debugResponse.status) || (debugResponse && debugResponse.response && debugResponse.response.status)}}</span>
              </li>
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
  import {mapGetters, mapState, mapMutations} from 'vuex'
  import {getDebugRequest} from '../../api/debug_request'
  import {SWAGGER_URL, HTTP_STATUS, MESSAGES} from '../../api/config'
  import FormFold from '../util/view/form_fold.vue'
  import {deepCopy, basicTypeInit, formatterJson, syntaxHighlight} from '../../common/util'
  import Commit from './commit.vue'
  import JsonView from '../util/view/json_view.vue'

  new Clipboard('.copy-json');
  export default {
    name: "info",
    data() {
      return {
        formatJsonObjectTo: "", /* 格式化后的响应JSON数据 */
        jsonValue: "", /* 复制的表单响应JSON数据 */
        jsonObjectToValue: "", /* 复制的实际响应JSON数据 */
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
        responseObjectName: "",
        codeImgUrl: "",
        isImgResponse: false
      }
    },
    computed: {
      ...mapGetters(['dropDownBoxContent', 'debugResponse', 'debugRequestTime', 'debugAuthorizeObj']),
      /**
       * @returns {Array} 提取必需请求参数数组
       */
      requiredArray: function () {
        let requiredAr = [];
        let obj = undefined;
        for (let key in this.interfaceRequest) {
          if (this.interfaceRequest.hasOwnProperty(key)) {
            if (this.interfaceRequest[key].properties && ((this.interfaceRequest[key].properties["length"]) || (typeof this.interfaceRequest[key].properties) === "array")) {
              obj = this.interfaceRequest[key].properties[0] && this.interfaceRequest[key].properties[0].properties;
              for (let i in obj) {
                if (obj.hasOwnProperty(i)) {
                  if (typeof  obj[i].required === "object" && obj[i].required['length'] > 0) {
                    requiredAr = requiredAr.concat(obj[i].required);
                  }
                  if (typeof  obj[i].required === "string") {
                    requiredAr.push(obj[i].required);
                  }
                }
              }
            } else {
              obj = this.interfaceRequest[key].properties;
              for (let i in obj) {
                if (obj.hasOwnProperty(i)) {
                  if (i === 'required' && typeof  obj[i] === "object" && obj[i]['length'] > 0) {
                    requiredAr = requiredAr.concat(obj[i]);
                  }
                  if (i === 'required' && typeof  obj[i] === "string") {
                    requiredAr.push(obj[i]);
                  }
                }
              }
            }

          }
        }
        return requiredAr;
      },
      /**
       * @returns {*} 响应参数
       */
      interfaceResponse: function () {
        let pathInfo = deepCopy(this.swaggerCategory[this.countTo] && this.swaggerCategory[this.countTo].pathInfo);
        let resp = pathInfo && pathInfo.responses;
        let respBasis = false;
        let respState;
        if (resp === undefined) {
          return MESSAGES.LOAD_STATUS;
        }
        for (let key in resp) {// 通过判断响应码判定请求是否成功
          if (resp.hasOwnProperty(key) && parseInt(key) >= HTTP_STATUS.min && parseInt(key) <= HTTP_STATUS.max) {
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
              let response = {};
              // response[refType] = this._formatRequest(ref, [ref]);
              response[refType] = Object.assign({}, this._formatRequest(ref, [ref]), ok)
              deftion = this._jsonInit(refType, [refType]);
              //数组类型加外层[]包裹
              if (schema["type"] && schema["type"] === "array") {
                let arrs = {};
                arrs['properties'] = response;
                arrs['type'] = "array";
                definition['Array'] = arrs;
                this.jsonObject = [];
                let jsonObj = {};
                jsonObj[refType] = deftion;
                this.jsonObject.push(jsonObj)
              } else {
                definition = response;
                this.jsonObject = deftion;
              }
              this.jsonValue = JSON.stringify(this.jsonObject);
              return definition;
            } else {
              //未发现ref属性
              if (schema.hasOwnProperty("type")) {
                this.jsonObject = schema["type"];
                return schema["type"];
              }
              this.jsonValue = JSON.stringify(this.jsonObject);
              return "无";
            }
          } else {
            // 判断其响应是否为图片
            if (pathInfo.produces) {
              for (let key in pathInfo.produces) {
                if (pathInfo.produces[key].indexOf("image") === 0) {
                  this.isImgResponse = true;
                  return pathInfo.produces[key];
                }
              }
            }
            this.jsonValue = JSON.stringify(this.jsonObject);
            return "无";
          }
        } else {
          this.jsonValue = JSON.stringify(this.jsonObject);
          return "没有指定响应成功信息";
        }
      },
      /**
       * @returns {*} 响应码
       */
      interfaceResponseCode: function () {
        let resp = deepCopy(this.swaggerCategory[this.countTo] && this.swaggerCategory[this.countTo].pathInfo && this.swaggerCategory[this.countTo].pathInfo.responses);
        let respBasis = false;
        let respState;
        if (resp === undefined) {
          return "加载失败";
        }
        for (let key in resp) {
          if (resp.hasOwnProperty(key) && parseInt(key) >= HTTP_STATUS.min && parseInt(key) <= HTTP_STATUS.max) {
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
      /**
       * @returns {*} 请求参数
       */
      interfaceRequest: function () {
        if (!this.swaggerCategory[this.countTo] && this.swaggerCategory[this.countTo].pathInfo && this.swaggerCategory[this.countTo].pathInfo.parameters) {
          this.childForm = [];
          return false;
        }
        /* 请求参数的遍历 */
        let result = {};
        let parameters = deepCopy(this.swaggerCategory[this.countTo].pathInfo.parameters);
        if (parameters === undefined) {
          this.childForm = [];
          return result;
        }
        for (let i in parameters) {
          if (parameters.hasOwnProperty(i)) {
            result[i] = parameters[i];
            if (parameters[i].schema && parameters[i].schema.$ref) {
              result[i]['properties'] = this._formatRequest(parameters[i].schema.$ref);
            }
            if (parameters[i].$ref) {
              result[i]['properties'] = this._formatRequest(parameters[i].$ref);
            }
            if (parameters[i].schema && parameters[i].schema.type && parameters[i].schema.type === 'array' && parameters[i].schema.items && parameters[i].schema.items.$ref) {
              let arr = [];
              arr.push(this._formatRequest(parameters[i].schema.items.$ref));
              result[i]['properties'] = arr;
            }
            if (parameters[i].schema && parameters[i].schema.type === "object" && parameters[i].schema.additionalProperties) {
              result[i]['properties'] = undefined;
            }
          }
        }
        let resultCopy = deepCopy(result);
        for (let key in resultCopy) {
          // 如果该字段没有type属性且存在子字段，子字段内有类型type属性
          // 判断是否为list数组类型
          if (resultCopy.hasOwnProperty(key)) {
            if ((!resultCopy[key].type && resultCopy[key].properties && resultCopy[key].properties.type === "object")
              || (resultCopy[key].properties && Array.isArray(resultCopy[key].properties))
              || (resultCopy[key].properties && resultCopy[key].schema && resultCopy[key].schema.type === "object" && resultCopy[key].schema.additionalProperties)) {
              // 当前字段为object类型或附带additionalProperties字段
              if (resultCopy[key].properties && Array.isArray(resultCopy[key].properties)) {
                this.parameterValue[key] = [];
                this.parameterValue[key].push(this._iniObject(resultCopy[key].properties && resultCopy[key].properties[0] && resultCopy[key].properties[0].properties))
              } else {
                this.parameterValue[key] = {};
                this.parameterValue[key] = this._iniObject(resultCopy[key].properties.properties);
              }
              // 附带additionalProperties的字段需要转为object类型
              if (resultCopy[key].properties && resultCopy[key].schema && resultCopy[key].schema.type === "object" && resultCopy[key].schema.additionalProperties) {
                this.parameterValue[key] = undefined;
              }
            } else {
              // 当前字段为基础类型
              this.parameterValue[key] = basicTypeInit(resultCopy[key].type);
            }
          }
        }

        //提取数据传递给子组件
        this.childForm = [];
        for (let key in result) {
          if (result.hasOwnProperty(key)) {
            let array = {};
            this.childForm[key] = {};
            array['name'] = result && result[key] && result[key]['name'];
            array['default'] = result[key]['default'] || this.parameterValue[key];
            array['required'] = result && result[key] && result[key]['required'];
            this.childForm[key] = deepCopy(array);
          }
        }
        for (let i in parameters) {// 对于list数据类型进行加层包装，使表格展现更加直观
          if (parameters.hasOwnProperty(i) && parameters[i].schema && parameters[i].schema.type && parameters[i].schema.type === 'array' && parameters[i].schema.items && parameters[i].schema.items.$ref) {
            let formatData = this._formatRequest(parameters[i].schema.items.$ref);
            let title = formatData.title;
            let objData = {};
            objData[title] = formatData;
            result[i]['properties'] = objData;
            let arrsTo = [];
            arrsTo.push(result[i]);
            result[i] = {
              'properties': arrsTo,
              'name': "Array",
              'type': "array",
              'title': "Array",
              'description': "Array",
              'required': true
            };
          }
        }
        return result;
      },
      /**
       * 判断源数据下是否存在 security 属性
       * @returns {boolean}
       */
      isExistSecurity() {
        let is = this.swaggerCategory && this.swaggerCategory[this.countTo] && this.swaggerCategory[this.countTo].pathInfo && this.swaggerCategory[this.countTo].pathInfo.security;
        return !!is;
      }
    },
    watch: {
      count: function () {
        this._iniData();
      },
      countTo: function () {
        this._iniData();
      }
    },
    methods: {
      ...mapMutations(["SET_DEBUGREQUEST_REQUESTTIME", "SET_DEBUGREQUEST_RESPONSE"]),
      /**
       * 初始化当前vue组件的data数据，用于数据页的切换
       * @private
       */
      _iniData: function () {
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
        this.isImgResponse = false;
      },
      /**
       * 响应码部分
       * @param item 源数据
       * @returns {boolean}  是否存在Schema字段
       * @private
       */
      _responseCodeSchema: function (item) {
        if (item.schema && item.schema.type && item.schema.type === 'array' && item.schema.items) {
          return true;
        }
        if (item.schema && item.schema.$ref) {
          this.responseObjectName = item.schema.$ref.match("#/definitions/(.*)")[1];
          return true;
        }
        return false;
      },
      /**
       * 响应码列表中数据JSON格式化展开收缩切换
       * @param index 点击数据索引位置
       * @private
       */
      _responseCodePreToggle: function (index) {/*  */
        if (this.responseCodePre && this.responseCodePre[index] && this.responseCodePre[index]) {
          this.$set(this.responseCodePre, index, !this.responseCodePre[index])
        } else {
          this.$set(this.responseCodePre, index, true)
        }
      },
      /**
       *传入对象properties属性，将对象的 properties属性 替换成 真实对象(不包含顶层)
       * @param properties 待提取属性
       * @returns {*} 属性的value值初始化后的对象
       * @private
       */
      _iniObject: function (properties) {
        let obj = {};
        for (let key in properties) {
          if (properties.hasOwnProperty(key)) {
            if ((properties[key].type && properties[key].properties && properties[key].type === "object") || (properties[key].type === 'array' && properties[key].properties)) {
              // 包含子字段
              if (properties[key].type === 'array' && properties[key].properties) {
                obj[key] = {};
                obj[key] = (Object.values(this._iniObject(properties[key].properties)))
              } else {
                obj[key] = this._iniObject(properties[key].properties)
              }
            } else {
              /* 不包含子字段 */
              obj[key] = properties[key].example || basicTypeInit(properties[key].type)
            }
          }
        }
        return obj;
      },
      /**
       *传入#/definitions/User，进行格式化
       * @param itemsRef #/definitions/*
       * @param refType 记录当前迭代各层级中元素名称的数组
       * @returns {*} 用对象 替换 #/definitions/* 字段后 的对象
       * @private
       */
      _formatRequest: function (itemsRef, refType) {
        let _refType = refType ? refType : [];
        let result = {};
        if (itemsRef === undefined || itemsRef === null || (typeof  itemsRef) !== "string") {
          return result;
        }
        let objName = itemsRef.match("#/definitions/(.*)") && itemsRef.match("#/definitions/(.*)")[1];
        let definitions = deepCopy(this.dropDownBoxContent.definitions);
        if (objName === null || objName === undefined || definitions === undefined) {
          return result;
        }
        if (definitions.hasOwnProperty(objName)) {
          result = deepCopy(definitions[objName])
          let properties = definitions[objName].properties
          if (properties === undefined || properties === null || (typeof properties) === 'string') {
            return result
          }
          for (let k in properties) {
            if (properties.hasOwnProperty(k)) {
              let Ref = (properties[k].items && properties[k].items.$ref) || properties[k].$ref;
              if (Ref) {
                // let Ref2 = (Ref.match("#/definitions/(.*)") === null ? "" : Ref.match("#/definitions/(.*)")[1]);
                // let adds = {"properties": {[Ref2]: {type: "object", title: "TreeNode"}}};
                if (_refType.indexOf(Ref) < 0) {// 树形结构判断。包含的属性为自身类
                  _refType.push(Ref)
                  result.properties[k].properties = this._formatRequest(Ref, _refType).properties;
                  // 当type字段不存在时，使用value的类型
                  result.properties[k].type = (result.properties[k].type || typeof this._formatRequest(Ref, _refType).properties);
                  result.properties[k].required = this._formatRequest(Ref, _refType).required;
                }
              }
            }
          }
          return result
        }
        // for (let key in definitions) {
        //   if (definitions.hasOwnProperty(key) && key.toLowerCase() === objName.toLowerCase()) {
        //     result = deepCopy(definitions[key]);
        //     let properties = definitions[key].properties;
        //     if (properties === undefined || properties === null || (typeof properties) === "string") {
        //       return result;
        //     }
        //     for (let k in properties) {
        //       if (properties.hasOwnProperty(k)) {
        //         if ((properties[k].items && properties[k].items.$ref) || properties[k].$ref) {
        //           let Ref = (properties[k].items && properties[k].items.$ref) ? (properties[k].items && properties[k].items.$ref) : properties[k].$ref;
        //           if (properties[k].type === 'array') {
        //             result.properties[k].properties = [];
        //             let Ref2 = (Ref.match("#/definitions/(.*)") === null ? "" : Ref.match("#/definitions/(.*)")[1]);
        //             let adds = {"properties": {[Ref2]: {type: "object", title: "TreeNode"}}};
        //             if (_refType.indexOf(Ref) < 0) {// 树形结构判断。包含的属性为自身类
        //               _refType.push(Ref);
        //               adds = this._formatRequest(Ref, _refType);
        //             }
        //             if (adds.name !== undefined && adds.name !== null) {
        //               adds['name'] = Ref.match("#/definitions/(.*)")[1].toLowerCase();
        //             }
        //
        //             result.properties[k].properties = adds.properties;
        //             continue;
        //           }
        //
        //           if (_refType.indexOf(Ref) < 0) {/* 树形结构判断。包含的属性为自身类 */
        //             _refType.push(Ref);
        //             result.properties[k] = this._formatRequest(Ref, _refType);
        //           } else {
        //             result.properties[k] = {}
        //           }
        //           continue;
        //         } else {
        //           result.properties[k] = properties[k];
        //           continue;
        //         }
        //       }
        //     }
        //   }
        // }
        return result;
      },
      /**
       * 将对象提取成真实对象(包含对象顶层)
       * @param refType 已经替换了传入对象properties属性属性的对象
       * @param topRefType 记录当前迭代各层级中元素名称的数组
       * @returns {*} 真实对象
       * @private
       */
      _jsonInit: function (refType, topRefType) {
        let _topRefType = topRefType ? topRefType : [];
        let _this = this;
        let definitionsArray = deepCopy(_this.dropDownBoxContent && _this.dropDownBoxContent.definitions);
        let deftion = undefined;
        if (definitionsArray === undefined) {
          return deftion;
        }
        for (let i in definitionsArray) {
          if (definitionsArray.hasOwnProperty(i) && i === refType) {
            deftion = definitionsArray[i].properties;
            break;
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
              let ref = (schema["type"] && schema["type"] === "array" && schema["items"]) ? schema["items"]["$ref"] : schema["$ref"];
              let regex = new RegExp("#/definitions/(.*)$", "ig");
              if ((typeof ref === "string") && regex.test(ref)) {
                let refType2 = (ref.match("#/definitions/(.*)") === null ? "" : ref.match("#/definitions/(.*)")[1]);
                if (_topRefType.indexOf(refType2) > 0) {
                  deftion[key] = {};
                  continue;
                }
                _topRefType.push(refType2);
                deftion[key] = this._jsonInit(refType2, _topRefType);
                continue;
              }
            }
            if (deftion[key].type === "array" && deftion[key].items) {
              let schema = deftion[key];
              let ref = (schema["type"] && schema["type"] === "array" && schema["items"]) ? schema["items"].$ref : schema["$ref"];
              let regex = new RegExp("#/definitions/(.*)$", "ig");
              if ((typeof ref === "string") && regex.test(ref)) {
                let refType2 = ((ref.match("#/definitions/(.*)") && ref.match("#/definitions/(.*)").length > 0) ? ref.match("#/definitions/(.*)")[1] : "" );
                deftion[key] = [];
                if (_topRefType.indexOf(refType2) >= 0) {
                  deftion[key] = {};
                  continue;
                }
                _topRefType.push(refType2);
                deftion[key].push(this._jsonInit(refType2, _topRefType));
                continue;
              }
            }
            if (deftion[key].type === "array") {
              deftion[key] = [];
              continue;
            }
            if (deftion[key].type === "boolean") {
              deftion[key] = deftion[key].example || true;
              continue;
            }
            if (deftion[key].type === "integer" || deftion[key].type === "number") {
              deftion[key] = deftion[key].example || 0;
              continue;
            }
            if (deftion[key].type === "string") {
              deftion[key] = deftion[key].example || "";
              continue;
            }
          }
        }
        return deftion;
      },
      /**
       * 将子组件传递过来的表单数据进行提取
       * @param data 子组件表单数据
       * @param param 可能存在的上传文件对象
       */
      getForm: function (data, param) {
        let _this = this;
        let result = [];
        for (let key in data) {
          if (data.hasOwnProperty(key) && data[key].required) {
            let obj = [];
            obj.push(data[key].name);
            obj.push(data[key].default);
            obj.push(_this.swaggerCategory[_this.countTo].pathInfo.parameters[key]);
            result.push(obj);
          }
        }
        _this._stitchUrl(result, param);
      },
      /**
       * 根据表单数据 组装成 请求所需全部数据 及 可能的伪造请求head数据
       * @param result 提取后的表单数据
       * @param param 可能存在的上传文件对象
       * @private
       */
      _stitchUrl: function (result, param) {
        let _this = this;
        let url = (_this.swaggerCategory && _this.swaggerCategory[_this.countTo] && _this.swaggerCategory[_this.countTo].pathName) ? _this.swaggerCategory[_this.countTo].pathName : '',
          params = {},
          headerParams = {'Content-Type': 'application/json;charset=UTF-8'},
          reqData = "",
          bodyParams = "";

        /*if (typeof (_this.dropDownBoxContent.basePath) !== "undefined" && _this.dropDownBoxContent.basePath !== "") {
         if (_this.dropDownBoxContent.basePath !== "/") {
         url = _this.dropDownBoxContent.basePath + url;
         }
         }*/
        let isQuery = false;
        for (let i = 0, n = result.length; i < n; i++) {
          if (result[i][2]["in"] === "path") {
            url = url.replace("{" + result[i][0] + "}", result[i][1]);
          } else if (result[i][2]["in"] === "query") {
            url += ((isQuery ? '&' : isQuery = '?') + result[i][0] + '=' + result[i][1]);
          } else {
            if (result[i][2]["in"] === "body") {
              (typeof result[i][1] === "string") ? (bodyParams += result[i][1]) : (bodyParams += JSON.stringify(result[i][1]));
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
            reqData = bodyParams;
            break;
          } else {
            reqData = params;
          }
        }
        let jsonReqdata = reqData;
        // 判断调试请求中是否有Security字段
        if (this.isExistSecurity) {// headerParams
          for (let key in this.debugAuthorizeObj) {
            if (this.debugAuthorizeObj.hasOwnProperty(key)) {
              headerParams[key] = this.debugAuthorizeObj[key];
            }
          }
        }
        //  判断是否为文件类型上传
        if (typeof reqData === "object") {
          for (let key in reqData) {
            if (typeof  reqData[key] === 'string') {
              try {
                reqData[key] = JSON.parse(reqData[key])
              } catch (err) {
                reqData[key] = reqData[key];
              }
            }
            if (reqData.hasOwnProperty(key) && param !== undefined && reqData[key] && reqData[key]['in'] && reqData[key]['in'] === 'formData' && reqData[key]['type'] && reqData[key]['type'] === 'file') {
              headerParams['Content-Type'] = 'multipart/form-data; charset=utf-8';
              reqData = param;
            }
          }
        }

        let requestData = {
          url: url,
          headerParams: headerParams,
          type: _this.swaggerCategory[this.countTo].name,
          data: reqData,
        }
        let enterTime = new Date();
        if (_this.isImgResponse) {
          _this.codeImgUrl = `<span>请求中。。。。${SWAGGER_URL + url}</span>`;
          _this.codeImgUrl = `<img src=${SWAGGER_URL + url + '?' + new Date().getTime()} />`;
          let outTime = new Date();
          _this.SET_DEBUGREQUEST_REQUESTTIME(outTime - enterTime);
          // 当响应数据为图片显示时，伪造数据响应头
          let contentType = "";
          let pathInfo = deepCopy(this.swaggerCategory[this.countTo] && this.swaggerCategory[this.countTo].pathInfo);
          for (let key in pathInfo.produces) {
            if (pathInfo.produces[key].indexOf("image") === 0) {
              contentType = pathInfo.produces[key];
            }
          }
          let res = {
            data: null,
            status: 200,
            headers: {"content-type": contentType},
            config: {"url": SWAGGER_URL + url}
          };
          _this.SET_DEBUGREQUEST_RESPONSE(res);
          _this._stitchingCurl(headerParams, jsonReqdata);
          return true;
        }
        getDebugRequest(requestData).then((res) => {
          let outTime = new Date();
          if (res.data === "") {
            res.data = undefined;
          }
          _this.SET_DEBUGREQUEST_REQUESTTIME(outTime - enterTime);
          _this.SET_DEBUGREQUEST_RESPONSE(res);
          if (_this.debugResponse && _this.debugResponse.headers && _this.debugResponse.headers['content-type'] && _this.debugResponse.headers['content-type'].indexOf('image') === 0) {
            _this.codeImgUrl = "<span>[object Blob]</span>";
          }
        }).then(() => {
          _this._stitchingCurl(headerParams, jsonReqdata);
        }).catch(function (err) {
          console.error(MESSAGES.ERROR + err);
          let errInfo = JSON.parse(JSON.stringify(err));
          _this.SET_DEBUGREQUEST_RESPONSE(errInfo);
          _this._stitchingCurl(headerParams, jsonReqdata);
        })
      },
      /**
       * 通过请求的head及data数据组装curl
       * @param headerParams 请求的head数据
       * @param reqData 请求的data数据
       * @private
       */
      _stitchingCurl: function (headerParams, reqData) {
        let _this = this;
        let response = _this.debugResponse,
          responseHeader = response.headers,
          responseConfig = response.config,
          headers = "",
          contentType = `--header 'application/json;charset=UTF-8'`,
          contentUrl = "",
          curlAccept = "-H \"accept: */*\"";

        for (let key in headerParams) {
          if (headerParams[key] !== "") {
            headers += `${key}: ${headerParams[key]},`;
          }
        }
        /* 生成 CURL 头部数据 */
        if (headers !== '' && headers !== undefined && headers.length > 0) {
          headers = headers.substring(0, headers.length - 1);
          headers = `--header '${headers}' `
        }
        if (response !== null) {
          // response contentType
          if (responseHeader !== null && responseHeader !== undefined
            && responseHeader['content-type'] !== null && responseHeader['content-type'] !== undefined) {
            contentType = `--header 'Content-Type: ${responseHeader['content-type']}'`;
            curlAccept = `-H 'Accept: ${responseHeader['content-type']}'`;
          }
          // url
          if (responseConfig && responseConfig.url !== undefined) {
            contentUrl = (process.env.SWAGGER_URL !== null && process.env.SWAGGER_URL.length > 0) ? `'${responseConfig.url}'` : ((responseConfig.url.indexOf(SWAGGER_URL) < 0 ? `'${ SWAGGER_URL + responseConfig.url}'` : `${responseConfig.url}`));
          }
        }
        if (_this.swaggerCategory[this.countTo].name.toLowerCase() === 'get') {
          _this.curlMode = `curl -X ${_this.swaggerCategory[this.countTo].name.toUpperCase()} ${curlAccept} ${headers} ${contentUrl}`;
        } else {
          /* d data 非头部附带数据,只用于非get类型请求 */
          let curlData = ` -d  '${reqData ? formatterJson(reqData) : ""}' `;
          _this.curlMode = `curl -X  ${_this.swaggerCategory[this.countTo].name.toUpperCase()} ${contentType} ${curlAccept} ${headers} ${reqData === '{}' ? "" : curlData} ${contentUrl}`;
        }
        if (response !== null && response !== undefined) {
          // 正确响应
          if (response.status !== null && response.status >= HTTP_STATUS.min && response.status <= HTTP_STATUS.max) {
            this.isJsonObject = false;
            try {
              this.jsonObjectTo = (typeof response.data === 'object') ? response.data : JSON.parse(response.data);
            } catch (e) {
              this.isJsonObject = false;
            }
            this.jsonObjectTo = response.data;
            if (typeof this.jsonObjectTo === 'object') {
              this.isJsonObject = true;
            }
            this.jsonObjectToValue = JSON.stringify(this.jsonObjectTo);
            this.formatJsonObjectTo = syntaxHighlight(formatterJson(JSON.stringify(this.jsonObjectTo)));
          } else {
            try {
              this.isJsonObject = (typeof response.response.data === 'object' ? response.response.data : JSON.parse(response.response.data));
            } catch (e) {
              this.isJsonObject = false;
            }
            this.jsonObjectTo = response && response.response && response.response.data;
            this.jsonObjectToValue = JSON.stringify(this.jsonObjectTo);
            this.formatJsonObjectTo = syntaxHighlight(formatterJson(JSON.stringify(this.jsonObjectTo)));
          }
        }
        // 显示结果
        this.resultShow = true;
      },
    },
    props: ['swaggerCategory', 'selected', 'count', 'countTo'],
    components: {FormFold, Commit, JsonView},
  }
</script>
<style>
  .copy-json {
    float: right;
    text-decoration: none;
    font-size: 12px;
  }

  /* 响应参数说明部分 */
  .response-parameter .head {
    font-weight: 700;
    padding-bottom: 8px;
    background-color: #F8F8F8;
  }

  .response-parameter > ul {
    overflow: hidden;
    border: 1px solid #ddd;
    border-bottom: 0;
  }

  .response-parameter > ul li {
    overflow: hidden;
    border-bottom: 1px solid #ddd;
  }

  .response-parameter > ul li:last-child {
    border-bottom: 0;
  }

  .response-parameter > ul li > span {
    width: 30%;
    box-sizing: border-box;
    float: left;
    padding: 8px 4px 999px;
    border-right: 1px solid #ddd;
    margin-bottom: -999px;
  }

  .response-parameter .head span {
    text-align: center;
  }

  .response-parameter > ul li > span:last-child {
    border-right: 0;
    width: 35%;
  }

  /*  响应状态码部分 */
  .response-code li.head {
    font-weight: 700;
    background-color: #F8F8F8;
  }

  .response-code > ul {
    overflow: hidden;
    border: 1px solid #ddd;
  }

  .response-code > ul li {
    overflow: hidden;
    border-bottom: 1px solid #ddd;
    position: relative;
  }

  .response-code > ul li:last-child {
    border-bottom: 0;
  }

  .response-code > ul li > div,
  .response-code li.head span {
    width: 50%;
    float: left;
    position: relative;
    padding-bottom: 8px;
    box-sizing: border-box;
  }

  .response-code li.head span {
    padding: 8px 4px;
    border-right: 1px solid #ddd;
  }

  .response-code > ul li > div:first-child,
  .response-code li.head span:first-child {
    width: 15%;
  }

  .response-code > ul li > div:last-child,
  .response-code li.head span:last-child {
    border-right: 0;
    width: 35%;
  }

  .response-code > ul li > div:last-child a {
    text-decoration: none;
    font-size: 12px;
    position: absolute;
    right: 0;
    top: 5px;
  }

  .response-code > ul li > div span {
    padding-bottom: 1000px;
    margin-bottom: -1000px;
    display: block;
    border-right: 1px solid #ddd;
    padding-top: 8px;
    padding-left: 4px;
    padding-right: 4px;
  }

  .response-code > ul li div span.format {
    white-space: pre-wrap;
  }

  .response-code > ul li > div:last-child span {
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
    cursor: pointer;
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
    font-size: 16px;
  }

  .result-content > div {
    border: 1px solid #ddd;
    min-height: 210px;
    font-size: 16px;
    text-align: left;
    padding: 17px 15px 15px;
  }

  .result-content .content li {
    white-space: pre-wrap;
    color: #1A1A1A;
    font-size: 18px;
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
    cursor: pointer;
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

  @media screen and (max-width: 1200px) {
    .swagger-main {
      font-size: 12px;
    }

    .switch span {
      font-size: 12px;
      padding: 10px 7px;
    }

    .swagger-content, .debugging-content {
      padding: 10px 5px;
    }

    .content-list {
      padding: 5px;
    }

    .content-list > li > span {
      width: 55px;
    }

    .content-list > li > div {
      margin-left: 72px;
    }

    .debugging-result > span {
      font-size: 12px;
      padding: 10px 7px;
    }

    .result-content > div {
      font-size: 12px;
    }

  }

</style>
