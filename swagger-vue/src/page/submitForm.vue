<template xmlns:v-bind="http://www.w3.org/1999/xhtml" xmlns:v-model="http://www.w3.org/1999/xhtml"
          xmlns:v-on="http://www.w3.org/1999/xhtml">
  <div>
    <div class="content-url">
        <span
          :style="{backgroundColor:bg[swaggerCategory&&swaggerCategory[countTo]&&swaggerCategory[countTo].name.toUpperCase()]}">{{swaggerCategory[countTo] && swaggerCategory[countTo].name ? swaggerCategory[countTo].name.toUpperCase() : ""}}</span>
      <div>
        <input v-if="(typeof linkagePath)=='string'" v-bind:value="linkagePath"
               style="width:100%;height: 23px;line-height: 23px;" type="text"/>
        <input v-else v-bind:value="linkagePath"
               style="width:100%;height: 23px;line-height: 23px;" type="text"/>
      </div>
      <button type="button" @click="formCollection">发送</button>
    </div>
    <div v-if="swaggerCategory[countTo]&&swaggerCategory[countTo].pathInfo&&swaggerCategory[countTo].pathInfo.parameters" class="content-parameter">
      <ul>
        <li class="parameter-head">
          <input v-model="selectAll" style="margin-top:10px;" type="checkbox"
                 @click="selectAll=!selectAll"/>
          <span>参数名称</span>
          <span style="border-right: 7px solid transparent;">参数值</span>
          <span>操作</span>
        </li>
        <li v-for="(item,key) in copyChildForm">
          <input style="margin-top:10px;" class="parameter-checkbox" type="checkbox"
                 :disabled="childForm[key].required||linkageSection==item.name" ref="phoneNum"
                 :checked="item.required||selectAll||linkageSection==item.name"/>
          <input :value="item.name" class="parameter-name" type="text"/>
          <div class="parameter-value">
              <textarea rows="10" v-on:input="onInput($event.target.value,key)"
                        v-if="childForm[key].default!=''&&(typeof childForm[key].default)=='object'&&childForm[key].default.in!=='formData'"
                        style="height:auto;width:100%;color: #858585;padding: 5px 9px;"
                        type="text">{{copyChildForm[key].default}}</textarea>
            <div class="parameter-file" v-else-if="(typeof copyChildForm[key].default)=='object'&&copyChildForm[key].default.in==='formData'&&copyChildForm[key].default.type==='file'">
              <input type="file" ref="fileInput"/>选择文件
            </div>

            <input v-else-if="linkageSection==item.name"
                   v-model="keyValue" type="text" style="width:100%;margin-top: 8px;"/>
            <input v-else v-model="copyChildForm[key].default" type="text" style="width:100%;margin-top: 8px;"/>
          </div>
          <span v-if="childForm[key].default==''||(typeof childForm[key].default)!='object'"
                class="parameter-operating" @click="deleteInterfaceRequest(key,item)">删除</span>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
  import {deepCopy, basicTypeInit} from './../util/util'
  import {mapState, mapMutations} from 'vuex'
  export default {
    name: "submit-form",
    data() {
      return {keyValue: "", selectAll: false, s: false,file:""}
    },
    props: ['childForm', 'bg', 'swaggerCategory', 'leftDropDownBoxContent', 'selected', 'count', 'countTo', 'InterfaceRequest', 'parameterValue'],
    computed: {
      ...mapState(['infoData']),
      copyChildForm(){ /* 数据字段  */
        let key = this.swaggerCategory[this.countTo].name.toUpperCase() + "" + this.copyLinkPath;
        if (this.$store.state.tabData.infoData[key] !== undefined) {
          return this.$store.state.tabData.infoData && this.$store.state.tabData.infoData[key] && this.$store.state.tabData.infoData[key] && this.$store.state.tabData.infoData[key][0]
        }
        let copyChildForms = deepCopy(this.childForm);
        let copyChildFormDefault = copyChildForms[0] && copyChildForms[0].default;
        for (let key in copyChildFormDefault) {/*   替换undefined的字段对象(暂代) */
          if (copyChildFormDefault[key] === undefined) {
            copyChildFormDefault[key] = {};
          }
        }
        if(copyChildForms&&copyChildForms[0]&&copyChildForms[0].default){
          copyChildForms[0].default = copyChildFormDefault;
        }
        return copyChildForms;
      },
      copyLinkPath(){
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
          return this.copyLinkPath.match(/(\S*)\{/)[1] + this.keyValue + this.copyLinkPath.match(/\}(\S*)/)[1]
        }
        return path;
      },
      linkageSection(){/* 路径参数 */
        let path = this.copyLinkPath;
        if (path !== undefined && path.indexOf("{") > 0) { //判断是否有参数在PATH路径上
          let s = path.match(/\{.+\}/) && path.match(/\{.+\}/)[0];
          return s.slice(1, s.length - 1);
        }
        return "";
      }
    },
    methods: {
      ...mapMutations(['addTab', 'changeShow']),
      saveTab(){
        let key = this.swaggerCategory[this.countTo].name.toUpperCase() + "" + this.copyLinkPath;
        if (this.$store.state.tabData.infoData && this.$store.state.tabData.infoData[key] && this.$store.state.tabData.infoData[key] && this.$store.state.tabData.infoData[key][1] !== undefined) {
          this.keyValue = this.$store.state.tabData.infoData && this.$store.state.tabData.infoData[key] && this.$store.state.tabData.infoData[key][1];
        }
        let data = {};
        data.key = this.swaggerCategory[this.countTo].name.toUpperCase() + "" + this.copyLinkPath;
        data.value = [this.copyChildForm, this.keyValue, this.selected, this.count, this.countTo];
        this.addTab(data);
      },
      initInfo(){
        this.selectAll = false;
        this.s = false;
        this.keyValue="";
        this.saveTab();
      },
      onInput(val, key) {
        try {
          this.copyChildForm[key].default = JSON.parse(val);
        } catch (e) {
          this.copyChildForm[key].default = val;
        }
      },
      formCollection: function () { //收集表单信息
//        fileInput
        let data = deepCopy(this.copyChildForm);
      for(let i=0,n=data.length;i<n;i++) {
        console.log(data[i]['default'],data[i]['default']==="",data[i]['name'] === this.linkageSection,data[i]['required'] === true)
          if (data[i]&&data[i]['required']&&data[i]['default']===""&& data[i]['required'] === true) {
            this.PromptPopUpShow(data[i].name + "为必选字段");
            return false;
          }
          /* 路径参数判断 */
          if(data[i]['name']&&data[i]['name'] === this.linkageSection&&this.keyValue===""){
            this.PromptPopUpShow(data[i].name + "为必选字段");
            return false;
          }

      }
        for (let key in this.$refs.phoneNum) {
          data[key].required = this.$refs.phoneNum[key].checked;
        }
        /* 判断是否有对应的文件上传存在 */
        let param = undefined;
        if(this.$refs.fileInput&&this.$refs.fileInput[0]&&this.$refs.fileInput[0].files&&this.$refs.fileInput[0].files.length>0){
          let file =this.$refs.fileInput[0].files[0];
          param = new FormData();
          param.append('file',file);
        }
        for (let key in data) {
          let digits = this.linkagePath.indexOf("{");
          let digitsEnd = this.linkagePath.indexOf("}");
          if (digits > 0 && digitsEnd > 0) {//路径中有参数
            for (let i in data) {
              if (data[key].name === this.linkageSection) {
                data[key].default = this.keyValue;
              }
            }
            this.$emit('getCollection', data,param);
            return true;
          } else {
            this.$emit('getCollection', data,param);
            return true;
          }
        }
        this.$emit('getCollection', this.copyChildForm,param);
        return true;
      },
      PromptPopUpShow: function (hint) {
        this.$layer.msg(hint, {time: 2})
      },
      deleteInterfaceRequest: function (key, item) {
        if (item.required) {
          this.PromptPopUpShow(item.name + "为必选字段");
          return false;
        }
        this.copyChildForm.splice(key, 1);
        this.selectAll = !this.selectAll;
        this.selectAll = !this.selectAll;
      }
    },
    watch: {
      selected(){
        console.log(this.selected);
        let key = this.swaggerCategory[this.countTo].name.toUpperCase() + "" + this.copyLinkPath;
        this.changeShow(key);
        this.initInfo();
      },
      count(){
        let key = this.swaggerCategory[this.countTo].name.toUpperCase() + "" + this.copyLinkPath;
        this.changeShow(key);
        this.initInfo();
      },
      countTo(){
        let key = this.swaggerCategory[this.countTo].name.toUpperCase() + "" + this.copyLinkPath;
        this.changeShow(key);
        this.initInfo();
      },
      keyValue(){
        let key = this.swaggerCategory[this.countTo].name.toUpperCase() + "" + this.copyLinkPath;
        if (this.$store.state.tabData.infoData && this.$store.state.tabData.infoData[key] && this.$store.state.tabData.infoData[key] && this.$store.state.tabData.infoData[key][1] !== undefined) {
          this.$store.state.tabData.infoData[key][1] = this.keyValue;
        }
      }
    },
    created(){
      this.initInfo();
      let key = this.swaggerCategory[this.countTo].name.toUpperCase() + "" + this.copyLinkPath;
      if (this.$store.state.tabData.infoData && this.$store.state.tabData.infoData[key] && this.$store.state.tabData.infoData[key] && this.$store.state.tabData.infoData[key][1] !== undefined) {
        this.changeShow(key);
      }
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
    line-height: 1.2;
    font-size: 14px;
    font-family: inherit;
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
    margin-top: 10px;
  }

  .parameter-head span {
    width: 20%;
    float: left;
  }

  .parameter-head span:nth-child(3) {
    width: 48%;
    float: left;
    margin-left: 2%;
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
  /* 文件上传 */
  .content-parameter li .parameter-value .parameter-file{
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
  .content-parameter li .parameter-value .parameter-file input{
    position: absolute;
    font-size: 100px;
    opacity: 0;top: 0;
    bottom: 0;
    left: 0;
    right: 0;
  }
  .content-parameter li .parameter-value .parameter-file:hover{
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
