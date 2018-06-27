<template>
  <div class="authorizations">
    <a @click="setAuthorizeShow" class="sign" href="javascript:">A</a>
    <div v-show="authorizeShow">
      <div>
        <div class="header">
          <h3>Available authorizations</h3>
          <a href="javascript:" @click="closeAuthorize" class="close">X</a>
        </div>
        <div class="content">
          <p class="title">X-Authorization ({{authorizeInfo && authorizeInfo.type ? authorizeInfo.type : ''}})</p>
          <p>Name: {{authorizeInfo && authorizeInfo.name ? authorizeInfo.name : ''}}</p>
          <p>In: {{authorizeInfo && authorizeInfo.in ? authorizeInfo.in : ''}}</p>
          <p>Value</p>
          <input v-model="authorizeVal" class="enter" type="text">
          <div class="control">
            <button @click="setAuthorizeVal">Authorize</button>
            <button @click="closeAuthorize">Close</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import {mapState, mapMutations} from 'vuex'

  export default {
    name: 'authorizations',
    data() {
      return {authorizeShow: false, authorizeVal: ""}
    },
    computed: {
      authorizeValStore() {
        return this.$store.state.debugRequest.authorization;
      },
      leftDropContent(){
        return this.$store.state.leftDropDownBoxContent && this.$store.state.leftDropDownBoxContent.data;
      },
      authorizeInfo() {
        return this.leftDropContent && this.leftDropContent.securityDefinitions && this.leftDropContent.securityDefinitions['X-Authorization'];
      }
    },
    methods: {
      ...mapMutations(['setAuthorization', 'setAuthorizeObj']),
      setAuthorizeShow: function () {
        this.authorizeShow = !this.authorizeShow;
      },
      setAuthorizeVal: function () {
        this.setAuthorization(this.authorizeVal);
        if (window.sessionStorage) {
          let arr = [this.authorizeInfo && this.authorizeInfo.name, this.authorizeVal];
          sessionStorage.setItem("authorize", JSON.stringify(arr));
        }
        this.setAuObj(this.authorizeInfo.name);
        this.PromptPopUpShow("修改 X-Authorization 成功");
        this.closeAuthorize();
      },
      setAuObj: function (name) {/* 保存对象 */
        let key = name || (this.authorizeInfo && this.authorizeInfo.name);
        let value = this.authorizeVal;
        let obj = {};
        obj[key] = value;
        this.setAuthorizeObj(obj)
      },
      PromptPopUpShow: function (hint) {/* 修改成功提示 */
        this.$layer.msg(hint, {time: 2})
      },
      closeAuthorize: function () {
        this.authorizeShow = false;
      }
    },
    watch: {
      authorizeShow() {
        this.authorizeVal = this.authorizeValStore;
      }
    },
    created(){
      let _this = this;
      if (window.sessionStorage) {
        let val = sessionStorage.getItem("authorize");
        if (val) {
          _this.authorizeVal = JSON.parse(val)[1];
          _this.setAuthorization(_this.authorizeVal);
          _this.setAuObj(JSON.parse(val)[0]);
        }
      }
    }
  }
</script>
<style>
  .authorizations {

  }

  .authorizations > div { /* 蒙层 */

    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: rgba(0, 0, 0, .5);
  }

  .authorizations a.sign {
    text-decoration: none;
    z-index: 99;
    position: fixed;
    bottom: 20px;
    right: 40px;
    width: 20px;
    height: 20px;
    border-radius: 20px;
    border: 2px solid #30ABF9;
    font-weight: 400;
    color: #30ABF9;
    line-height: 20px;
    background-color: #fff;
  }

  .authorizations > div > div {
    width: 43%;
    background-color: #fff;
    margin: 100px auto auto;
  }

  .authorizations .header { /* 标题 */
    border-bottom: 1px solid #ccc;
    background-color: rgb(209, 234, 255);
    position: relative;
    overflow: hidden;
  }

  .authorizations .header h3 {
    text-align: left;
    margin-left: 20px;
  }

  .authorizations .header .close {
    position: absolute;
    right: 10px;
    top: 20px;
    text-decoration: none;
    font-weight: 700;
    color: black;
  }

  .authorizations .header .close:hover {
    color: rgb(235, 91, 91);
  }

  .authorizations .content {
    text-align: left;
    width: 86%;
    margin: auto;
    padding: 20px 0;
  }

  .authorizations .content p {
    font-size: 14px;
  }

  .authorizations .content p:last-of-type {
    font-weight: 600;
  }

  .authorizations .content .title {
    font-weight: 600;
    font-size: 16px;
  }

  .authorizations .content .enter {
    border: 1px solid #E9E9E9;
    width: 60%;
    outline: none;
    height: 30px;
    padding-left: 5px;
    min-width: 200px;
  }

  .authorizations .content .control {
    margin: 16px auto 0;
    text-align: center;
  }

  .authorizations .content .control button {
    outline: none;
    padding: 5px 24px;
    border: 2px solid;
    font-weight: 600;
    border-radius: 5px;
    background-color: #fff;
  }

  .authorizations .content .control button:first-child {
    border-color: #5FD09C;
    color: #5FD09C;
    margin-right: 10px;

  }

  .authorizations .content .control button:last-child {
    border-color: #7A7078;
    color: #7A7078;
  }

</style>

