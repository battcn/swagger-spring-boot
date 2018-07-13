<template>
  <div class="login">
    <header>
      swagger 在线接口调试
    </header>
    <div class="content">

      <div class="right">
        <h3>用户登录 / User login</h3>
        <input v-model="username" placeholder="账号" type="text">
        <input v-model="password" placeholder="密码" type="text">
        <button @click="loginOperat">登录</button>
      </div>
    </div>
  </div>
</template>
<script type="text/ecmascript-6">
  import {mapState, mapMutations} from 'vuex'
  export default {
    name: 'login',
    data() {
      return {username: "请填写用户名", password: "请填写密码"}
    },
    computed: {
      ...mapState({isSecurity: state => state.account.isSecurity})
    },
    methods: {
      ...mapMutations(['login']),
      loginOperat(){/* 登录操作 */
        let obj = {'swagger-username': this.username, 'swagger-password': this.password};
        let _this = this;
        this.$store.dispatch('carriedLogin', obj).then(function () {
          _this.$router.push('swagger-ui.html');

        });
      }
    },
    created(){
      let _this = this;
      _this.$store.dispatch('carriedIsVerify').then(function () {
        let is = _this.isSecurity && (typeof _this.isSecurity === "string") ? JSON.parse(_this.isSecurity) : _this.isSecurity;
        if (!is) {
          console.log("未设置身份验证,跳转至数据页面....");
          _this.$router.push('swagger-ui.html');
        }
      });
    }
  }
</script>
<style>
  .login {
    background: url("../assets/bg.jpg") no-repeat;
    background-size: cover;
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
  }

  .login header {
    background-color: #12722E;
    height: 45px;
    padding-left: 15%;
    text-align: left;
    line-height: 45px;
    color: #fff;
    font-weight: 600;
  }

  .login .content {
    width: 80%;
    margin: 0 auto;
  }

  .login .content p {
    text-align: left;
    font-size: 27px;
    font-weight: bold;
    color: #fff;
  }

  .login .content .right {
    box-sizing: border-box;
  }

  .login .content .right {
    background: #fff;
    float: right;
    border-radius: 5px;
    padding: 10px 20px 15px;
    min-width: 390px;
    box-sizing: border-box;
    box-shadow: 0 0 10px #ccc;
    margin-top: 16%;
  }

  .login .content .right h3 {
    color: #12722E;
  }

  .login .content .right input {
    display: block;
    color: rgba(18, 114, 46, .8);
    font-size: 16px;
    border: 1px solid #E9E9E9;
    width: 244px;
    outline: none;
    background: #F1F2F2;
    padding: 12px 22px;
    margin: 24px auto;
  }

  .login .content .right input::-webkit-input-placeholder {
    color: rgba(18, 114, 46, .6);
  }

  .login .content .right button {
    outline: none;
    width: 251px;
    height: 38px;
    padding: 5px 24px;
    border: 0;
    border-radius: 5px;
    background-color: #12722E;
    color: #fff;
    letter-spacing: 5px;
  }

</style>
