<template xmlns:v-bind="http://www.w3.org/1999/xhtml"
>
  <div>
    <div class="content-url">
        <span
          :style="{backgroundColor:BG[swaggerCategory&&swaggerCategory[countTo]&&swaggerCategory[countTo].name.toUpperCase()]}">{{swaggerCategory[countTo] && swaggerCategory[countTo].name ? swaggerCategory[countTo].name.toUpperCase() : ""}}</span>
      <div>
        <input v-if="(typeof linkagePath)=='string'" v-bind:value="linkagePath"
               type="text"/>
        <input v-else v-bind:value="linkagePath"
               type="text"/>
      </div>
      <button type="button" @click="_formCollection">发送</button>
    </div>
    <div
      v-if="swaggerCategory[countTo]&&swaggerCategory[countTo].pathInfo&&swaggerCategory[countTo].pathInfo.parameters"
      class="content-parameter">
      <ul>
        <li class="parameter-head">
          <input v-model="selectAll" type="checkbox"
                 @click="selectAll=!selectAll"/>
          <span>参数名称</span>
          <span>参数值</span>
          <span>操作</span>
        </li>
        <li v-for="(item,key) in copyChildForm">
          <input style="margin-top:10px;" class="parameter-checkbox" type="checkbox"
                 :disabled="childForm[key].required||linkageSection==item.name" ref="checkboxs"
                 :checked="item.required||selectAll||linkageSection==item.name"/>
          <input :value="item.name" class="parameter-name" type="text"/>
          <div class="parameter-value">
              <textarea rows="10" v-model="copyChildForm[key].default"
                        v-if="(childForm[key].default!=''&&(typeof childForm[key].default)=='object'&&childForm[key].default.in!=='formData')||copyChildForm[key].addition"
                        type="text"></textarea>
            <div class="parameter-file"
                 v-else-if="(typeof childForm[key].default)=='object'&&childForm[key].default.in==='formData'&&childForm[key].default.type==='file'">
              <input type="file" @change="_fileChange($event)" ref="fileInput"/>选择文件 {{fileName}}
            </div>
            <input v-else-if="linkageSection==item.name"
                   v-model="keyValue" type="text"/>
            <input v-else v-model="copyChildForm[key].default" type="text"/>
          </div>
          <span v-if="childForm[key].default==''||(typeof childForm[key].default)!='object'"
                class="parameter-operating" @click="_deleteInterfaceRequest(key,item)">删除</span>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
  import {deepCopy, basicTypeInit, formatterJson, promptPopUpShow} from '../../common/util'
  import {mapGetters, mapMutations} from 'vuex'
  import {BG, POPUPS_MESSAGES} from '../../api/config'

  export default {
    name: "commit",
    data() {
      return {BG: BG, keyValue: "", selectAll: false, s: false, fileName: ""}
    },
    props: ['childForm', 'swaggerCategory', 'selected', 'count', 'countTo', 'interfaceRequest', 'parameterValue'],
    computed: {
      ...mapGetters({
        infoData: 'tabDataInfo'
      }),
      copyChildForm() { // 数据字段
        let _this = this;
        let key = this.swaggerCategory[this.countTo].name.toUpperCase() + "" + this.copyLinkPath;
        if (this.infoData[key] !== undefined) {
          return this.infoData && this.infoData[key] && this.infoData[key] && this.infoData[key][0];
        }
        let copyChildForms = deepCopy(this.childForm);
        for (let key in copyChildForms) {/*   替换undefined的字段对象(暂代) */
          if (copyChildForms[key]['default'] === undefined) {
            if (_this.interfaceRequest[key].schema && _this.interfaceRequest[key].schema.type) {
              if (_this.interfaceRequest[key].schema.type === "string") {
                copyChildForms[key]['type'] = "string";
              }
              copyChildForms[key]['default'] = "";
              copyChildForms[key]['addition'] = true;
              continue;
            }
            copyChildForms[key]['default'] = {};
          }
          if (typeof copyChildForms[key]['default'] === "object") {
            copyChildForms[key]['default'] = formatterJson(JSON.stringify(copyChildForms[key]['default']));
          }
        }
        return copyChildForms;
      },
      copyLinkPath() {
        return (this.swaggerCategory && this.swaggerCategory[this.countTo] && this.swaggerCategory[this.countTo].pathName) ? this.swaggerCategory[this.countTo].pathName : "";
      },
      linkagePath() {/*   */
        let path = this.copyLinkPath;
        let digits = path.indexOf("{");
        let digitsEnd = path.indexOf("}");
        if (path !== undefined && digits > 0 && digitsEnd > 0) { //判断是否有参数在PATH路径上
          if (this.keyValue === "") {
            return path;
          }
          for (let key in this.copyChildForm) {
            if (this.copyChildForm[key].name === this.linkageSection) {
              this.copyChildForm[key].default = this.keyValue;
            }
          }
          return this.copyLinkPath.match(/(\S*)\{/)[1] + this.keyValue + this.copyLinkPath.match(/\}(\S*)/)[1];
        }
        return path;
      },
      linkageSection() {/* 路径参数 */
        let path = this.copyLinkPath;
        if (path !== undefined && path.indexOf("{") > 0) { //判断是否有参数在PATH路径上
          let s = path.match(/\{.+\}/) && path.match(/\{.+\}/)[0];
          return s.slice(1, s.length - 1);
        }
        return "";
      }
    },
    methods: {
      ...mapMutations(['UPDATE_TABDATA_INFODATAITEM', 'SELETE_TABDATA_INFODATAITEM', 'INSERT_TABDATA_ADDTAB', 'UPDATE_TABDATA_INFODATA']),
      /**
       * 表单数据改变时进行保存操作
       * @private
       */
      _saveTab() {
        let key = this.swaggerCategory[this.countTo].name.toUpperCase() + "" + this.copyLinkPath;
        if (this.infoData && this.infoData[key] && this.infoData[key] && this.infoData[key][1] !== undefined) {
          this.keyValue = this.infoData && this.infoData[key] && this.infoData[key][1];
        }
        let data = {};
        data.key = key;
        data.value = [this.copyChildForm, this.keyValue, this.selected, this.count, this.countTo];
        this.INSERT_TABDATA_ADDTAB(data);
      },
      _initInfo() {
        this.selectAll = false;
        this.s = false;
        this.keyValue = "";
        this.file = "";
        this._saveTab();
      },
      /**
       * 提交触发，表单验证 及 收集表单信息 上传到 父组件
       * @private
       */
      _formCollection: function () {
        let _this = this,
          data = deepCopy(_this.copyChildForm);
        for (let i = 0, n = data.length; i < n; i++) {
          if (_this.childForm[i].default !== '' && (typeof _this.childForm[i].default) === 'object' && _this.childForm[i].default.in !== 'formData') {
            data[i]['default'] = JSON.parse(data[i]['default']);
          }

          if (data[i] && data[i]['required'] && data[i]['default'] === "" && data[i]['required'] === true) {
            promptPopUpShow.call(_this, data[i].name + POPUPS_MESSAGES.REQUIRED);
            return false;
          }
          //addition 字段判断
          if (_this.copyChildForm[i].addition) {
            if (_this.copyChildForm[i].type === "string") {
              data[i]['default'] = JSON.stringify(data[i]['default']);
              data[i]['default'] = data[i]['default'].replace(/[\r|\\n|\"]/g, "");
              data[i]['default'] = data[i]['default'].replace(/[ ]/g, "");
              continue;
            }
            try {
              data[i]['default'] = JSON.parse(data[i]['default']);
              continue;
            } catch (e) {
              promptPopUpShow.call(_this, data[i]['default'] + POPUPS_MESSAGES.FORMAT_JSON);
              return false;
            }
          }
          // 路径参数判断
          if (data[i]['name'] && data[i]['name'] === _this.linkageSection && _this.keyValue === "") {
            promptPopUpShow.call(_this, data[i].name + POPUPS_MESSAGES.REQUIRED);
            return false;
          }
        }
        for (let key in _this.$refs.checkboxs) {
          data[key].required = _this.$refs.checkboxs[key].checked;
        }
        /* 判断是否有对应的文件上传存在 */
        let param = undefined;
        if (_this.$refs.fileInput && _this.$refs.fileInput[0] && _this.$refs.fileInput[0].files && _this.$refs.fileInput[0].files.length > 0) {
          let file = _this.$refs.fileInput[0].files[0];
          param = new FormData();
          param.append('file', file);
        }
        _this.$emit('getCollection', data, param);
        return true;
      },
      /**
       *  删除表单中的某个字段数据
       * @param key 删除的数据key值
       * @param item 删除的数据value值
       * @private
       */
      _deleteInterfaceRequest: function (key, item) {
        if (item.required) {
          promptPopUpShow.call(this, item.name + POPUPS_MESSAGES.REQUIRED);
          return false;
        }
        this.copyChildForm.splice(key, 1);
        this.selectAll = !this.selectAll;
        this.selectAll = !this.selectAll;
      },
      /**
       * 上传文件框数据的更新
       * @param $event
       * @private
       */
      _fileChange($event) {
        let fileName = this.$refs.fileInput && this.$refs.fileInput[0] && this.$refs.fileInput[0].files && this.$refs.fileInput[0].files[0] && this.$refs.fileInput[0].files[0].name;
        if (fileName !== undefined && fileName !== "") {
          this.fileName = fileName;
          return true;
        }
        this.fileName = "";
      }
    },
    watch: {
      selected() {
        this._initInfo();
      },
      count() {
        this._initInfo();
      },
      countTo() {
        this._initInfo();
      },
      keyValue() {
        let key = this.swaggerCategory[this.countTo].name.toUpperCase() + this.copyLinkPath;
        if (this.infoData && this.infoData[key] && this.infoData[key] && this.infoData[key][1] !== undefined) {
          let inf = deepCopy(this.infoData[key]);
          inf[1] = this.keyValue;
          this.UPDATE_TABDATA_INFODATA([key, inf]);
        }
      }
    },
    created() {
      this._initInfo();
    }
  }
</script>
<style>
  /* 调试页面 */
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
    font-size: 14px;
    font-family: inherit;
    width: 100%;
    height: 23px;
    line-height: 23px;
  }

  .content-url > button {
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

  /* 调试：附带参数列表 */
  .content-parameter {
    margin-bottom: 45px;
    border-top: 1px solid #ddd;
  }

  .content-parameter li {
    font-weight: 700;
    border-bottom: 1px solid #ddd;
    overflow: hidden;
  }

  .content-parameter .parameter-head {
    overflow: hidden;
  }

  /* 首行单独样式 */
  .parameter-head input {
    width: 5%;
    float: left;
    height: 20px;
    margin-top: 10px !important;
  }

  .parameter-head span {
    width: 20%;
    float: left;
  }

  .parameter-head span:nth-child(3) {
    width: 48%;
    float: left;
    margin-left: 2%;
    border-right: 7px solid transparent;
    margin-right: 2%;
  }

  /* 非首行样式 */
  .parameter-checkbox {
    width: 5%;
    float: left;
    height: 20px;
    margin-top: 10px;
  }

  /* 表格中的文字样式 */
  .content-parameter li > span {
    text-align: left;
    line-height: 40px;
    float: left;
  }

  .content-parameter li > input {
    margin-top: 8px;
  }

  .content-parameter .parameter-name {
    width: 20%;
    float: left;
  }

  .content-parameter li .parameter-value {
    width: 48%;
    float: left;
    margin-left: 2%;
    margin-right: 2%;
  }

  .content-parameter li .parameter-value textarea {
    width: 100%;
    color: #858585;
    padding: 5px 9px;
  }

  .content-parameter li .parameter-value > input {
    width: 100%;
    margin-top: 8px;
  }

  /* 文件上传 */
  .content-parameter li .parameter-value .parameter-file {
    position: relative;
    background: #D0EEFF;
    border: 1px solid #99D3F5;
    border-radius: 4px;
    overflow: hidden;
    color: #1E88C7;
    text-decoration: none;
    text-indent: 0;
    margin-top: 8px;
    margin-bottom: 8px;
    height: 24px;
    line-height: 24px;
    cursor: pointer;
    font-size: 12px;
  }

  .content-parameter li .parameter-value .parameter-file input {
    position: absolute;
    font-size: 100px;
    opacity: 0;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
  }

  .content-parameter li .parameter-value .parameter-file:hover {
    background: #AADFFD;
    border-color: #78C3F3;
    color: #004974;
    text-decoration: none;
  }

  .content-parameter li .parameter-operating {
    font-size: 14px;
    cursor: pointer;
    color: #40A8FF;
  }

</style>
