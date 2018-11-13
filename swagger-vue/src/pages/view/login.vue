<template>
  <div class="login">
    <div class="content">
      <header>
        swagger 在线接口调试
      </header>
      <div class="input">
        <h3>用户登录 / User login</h3>
        <input v-model="username" placeholder="账号" type="text">
        <input v-model="password" placeholder="密码" type="text">
        <button @click="_login">登录</button>
      </div>
    </div>
  </div>
</template>
<script type="text/ecmascript-6">
  import {mapMutations, mapGetters} from 'vuex'
  import {MESSAGES} from '../../api/config'
  import {login, isVerify} from '../../api/accounts'

  export default {
    name: 'login',
    data() {
      return {username: "", password: ""}
    },
    methods: {
      ...mapMutations(['DECIDE_ACCOUNT_ISVERIFY']),
      _login() {
        let obj = {'username': this.username, 'password': this.password};
        this._loginOperat(obj);
      },
      /**
       * 登录操作
       * @private
       */
      _loginOperat(obj) {
        let _this = this;
        login(obj).then((res) => {
          _this.DECIDE_ACCOUNT_ISVERIFY(false);
          _this.$emit('getDropDown');
        }).catch(function (err) {
          console.log(MESSAGES.PERMISSION_ERROR + err);
        });
      },
      /**
       * 判断是否设置登录验证
       * @private
       */
      _isVerify: function () {
        let _this = this;
        isVerify().then((res) => {
          let security = res.data && res.data.security !== undefined;
          try {
            security = (security ? (typeof res.data.security === "string" ? JSON.parse(res.data.security) : res.data.security) : false);
          } catch (err) {
            console.log(MESSAGES.PERMISSION_ERROR + err);
            security = false;
          }
          _this.DECIDE_ACCOUNT_ISVERIFY(security);
        }).catch((err) => {
          console.log(MESSAGES.ERROR + err);
        })
      }
    },
    computed: {
      ...mapGetters(['accountIsSecurity'])
    }
  }
</script>
<style>
  .login {
    position: fixed;
    background: #ccc;
    z-index: 999;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
  }

  .login .content {
    position: absolute;
    border-radius: 5px;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    overflow: hidden;
  }

  .login .content header {
    background-color: #73CCFE;
    height: 45px;
    padding-left: 15px;
    text-align: left;
    line-height: 45px;
    color: #fff;
    font-weight: 600;
  }

  .login .content .input {
    box-sizing: border-box;
  }

  .login .content .input {
    background: #fff;
    float: right;
    padding: 10px 20px 15px;
    min-width: 390px;
    box-sizing: border-box;
    box-shadow: 0 0 10px #ccc;
  }

  .login .content .input h3 {
    color: #73CCFE;
  }

  .login .content .input input {
    display: block;
    color: #2196F3;
    font-size: 16px;
    border: 1px solid #E9E9E9;
    width: 244px;
    outline: none;
    background: #F1F2F2;
    padding: 12px 22px;
    margin: 24px auto;
  }

  .login .content .input input::-webkit-input-placeholder {
    color: #73CCFE;
  }

  .login .content .input button {
    outline: none;
    cursor: pointer;
    width: 251px;
    height: 38px;
    padding: 5px 24px;
    border: 0;
    border-radius: 5px;
    background-color: #73CCFE;
    color: #fff;
    letter-spacing: 5px;
  }

  .login .content .input button:hover {
    background-color: #2196F3;
  }

</style>
