import Vue from "vue";
import Vuex from "vuex";
import axios from "axios";
// import router from '@/router/index.js'


Vue.use(Vuex);


//js获取项目根路径，如： http://localhost:8080/battcn
function rootPath() {
  //获取当前网址，如： http://localhost:8083/battcn/index.html
  const curWwwPath = window.document.location.href;
  //获取主机地址之后的目录，如： battcn/index.html
  const pathName = window.document.location.pathname;
  const pos = curWwwPath.indexOf(pathName);
  //获取主机地址，如： http://localhost:8083
  const localhostPaht = curWwwPath.substring(0, pos);
  //获取带"/"的项目名，如：/battcn
  const projectName = pathName.substring(0, pathName.substr(1).indexOf('/') + 1);
  return (localhostPaht + projectName);
}

const SWAGGER_URL = process.env.SWAGGER_URL === "" ? rootPath() : process.env.SWAGGER_URL;
/* 下拉框数据 */
const dropDown = {
  state: {data: [], count: 0},
  mutations: {
    initialization(state, n){/* 初始化数据 */
      init(n);
    },
    switch(state, n) {
      dropDown.state.count = n;
      init();
    }
  }
};
/* 下拉框下方的接口数据 */
const leftDropDownBoxContent = {
  state: {data: []}
};
/* 初始化:获取单选框数据， */
function init(n) {
  axios.get(SWAGGER_URL + "/swagger-resources").then((response) => {
    dropDown.state.data = response.data;
    if (dropDown.state.data[dropDown.state.count] && dropDown.state.data[dropDown.state.count] && dropDown.state.data[dropDown.state.count] && dropDown.state.data[dropDown.state.count].location) {
      /* dropDown.state.data[0]控制当前是第几个接口 */
      axios.get(SWAGGER_URL + dropDown.state.data[dropDown.state.count].location).then((response) => {
        leftDropDownBoxContent.state.data = response.data;
      }).catch(function (err) {
        leftDropDownBoxContent.state.data = "请求失败:" + err;
      })
    }
  }).catch(function (err) {
    console.info("身份验证失败啦...." + err);
    dropDown.state.data = "请求失败:" + err;
    n();
    /* console.log(router)
     router.push({path: '/swagger-login.html'});*/
  });
}

/* 调试模块 */
const debugRequest = {
  state: {data: [], count: 0, debugResponse: {}, requestTime: 0, authorizeObj: {}, authorization: "",},
  mutations: {
    send(state, n) {
      let enterTime = new Date();
      axios.request({
        url: n.url,
        data: n.data,
        method: n.type.toUpperCase(),
        headers: n.headerParams
      }).then(function (response) {
        let outTime = new Date();
        debugRequest.state.requestTime = outTime - enterTime;
        debugRequest.state.debugResponse = response;
        console.log("请求发送成功");
        n.resolve()
      }).catch(function (err) {
        console.log("请求发送失败");
        debugRequest.state.debugResponse = err;
        n.resolve();
      })
    },
    setAuthorization(state, val) {
      debugRequest.state.authorization = val;
    },
    setAuthorizeObj(state, obj) {
      debugRequest.state.authorizeObj = obj;
    }
  },
  actions: {
    carriedSend(content, n) {
      return new Promise((resolve, reject) => {
        n.resolve = resolve;
        console.log("回调开始");
        content.commit('send', n);
      })
    }
  }
};
/* tab页数据操作:实际存储的是调试页数据 */
const tabData = {
  state: {infoData: {}, show: ""},
  mutations: {
    addTab(state, item) {
      Vue.set(tabData.state.infoData, item.key, item.value)
      // tabData.state.infoData[item.key]=item.value;
    },
    deleteTab(state, key) {
      if (key && tabData.state.infoData[key] !== undefined) {
        Vue.delete(tabData.state.infoData, key)
      }
    },
    emptyTab(state) {
      tabData.state.infoData = {};
    },
    changeShow(state, val) {
      tabData.state.show = val;
    }
  }
};
/* 账号管理部分 */
const account = {
  state: {isSecurity: false},
  mutations: {
    isVerify(state, resolve){/* 判断是否需要账号验证 */
      axios.get(SWAGGER_URL + '/v2/swagger-security').then(function (response) {
        account.state.isSecurity = response.data && response.data.security ? response.data.security : 'false';
        resolve();
      }).catch(function (err) {
        console.log('请求失败' + err);
      });
    },
    login(state, obj){/*  账号登录验证 */
      // 'Content-Type':'application/x-www-form-urlencoded',
      let params = {
        'username': obj && obj['swagger-username'],
        'password': obj && obj['swagger-password']
      };
      let url = `${SWAGGER_URL}/v2/swagger-login?`;
      for (let key in params) {
        url += `${key}=${params[key]}&`;
      }
      url = url.slice(0, url.length - 1);
      let config = {'params': params};
      axios.post(url).then(function (response) {
        obj.resolve();
      }).catch(function (err) {
        console.log("账号验证失败" + err);
      });
    }
  },
  actions: {
    carriedLogin(content, obj){
      return new Promise((resolve, reject) => {
        obj.resolve = resolve;
        console.log("回调开始");
        content.commit('login', obj);
      })
    },
    carriedIsVerify(content){
      return new Promise((resolve, reject) => {
        content.commit('isVerify', resolve)
      })
    }
  }
};

export default new Vuex.Store({
  modules: {
    swaggerLeftHead: dropDown,
    leftDropDownBoxContent: leftDropDownBoxContent,
    debugRequest: debugRequest,
    tabData: tabData,
    account: account
  }
})








