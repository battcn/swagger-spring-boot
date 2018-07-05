<template>
  <div class="login">
    <div class="content">
      <p> swagger 在线接口调试</p>
      <div class="right">
        <h3>用户登录 / User login</h3>
        <input v-model="username" placeholder="swagger-username" type="text">
        <input v-model="password" placeholder="swagger-password" type="text">
        <button @click="loginOperat">登录</button>
      </div>
    </div>
  </div>
</template>
<script type="text/ecmascript-6">
  import {mapState,mapMutations} from 'vuex'
  export default {
    name: 'login',
    data() {
      return {username: "battcn", password: "battcn"}
    },
    methods:{
      ...mapMutations(['login']),
      loginOperat(){/* 登录操作 */
        let obj = {'swagger-username':this.username,'swagger-password':this.password};
        let _this=this;
        this.$store.dispatch('carriedLogin',obj).then(function () {
          _this.$router.push('/home');
        });
      }
    }
  }
</script>
<style>
  .login {
    background: url("./../assets/bg.png") no-repeat;
    background-size: cover;
    padding: 60px 50px;
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
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
    padding: 10px 96px;
    box-sizing: border-box;
  }

  .login .content .right {
    background: #fff;
    float: right;
    border-radius: 5px;
    padding: 10px 20px 47px;
    min-width: 390px;
  }

  .login .content .right h3 {
    color: #368AE3;
  }

  .login .content .right input {
    display: block;
    font-size: 12px;
    border: 1px solid #E9E9E9;
    width: 244px;
    outline: none;
    border-radius: 5px;
    height: 34px;
    padding-left: 5px;
    margin: 24px auto;
  }

  .login .content .right button {
    outline: none;
    width: 251px;
    height: 38px;
    padding: 5px 24px;
    border: 0;
    border-radius: 5px;
    background-color: #3F82E7;
    color: #fff;
  }

</style>
