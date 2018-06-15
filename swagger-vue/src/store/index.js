import Vue from "vue";
import Vuex from "vuex";
import VueResource from "vue-resource";

Vue.use(Vuex);
Vue.use(VueResource);

//js获取项目根路径，如： http://localhost:8080/battcn
function rootPath() {
  //获取当前网址，如： http://localhost:8083/battcn/swagger-ui.html
  const curWwwPath = window.document.location.href;
  //获取主机地址之后的目录，如： battcn/swagger-ui.html
  const pathName = window.document.location.pathname;
  const pos = curWwwPath.indexOf(pathName);
  //获取主机地址，如： http://localhost:8083
  const localhostPaht = curWwwPath.substring(0, pos);
  //获取带"/"的项目名，如：/battcn
  const projectName = pathName.substring(0, pathName.substr(1).indexOf('/') + 1);
  return (localhostPaht + projectName) + "/";
}

const SWAGGER_URL = process.env.SWAGGER_URL === "" ? rootPath() : process.env.SWAGGER_URL;
console.log(SWAGGER_URL, process.env.SWAGGER_URL)
/* 下拉框数据 */
const dropDown = {
  state: {data: [], count: 0},
  mutations: {
    switch(state, n){
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
function init() {
  Vue.http.get(SWAGGER_URL + "swagger-resources").then((response) => {
    dropDown.state.data = response.body;
    return true;
  }, (response) => {
    dropDown.state.data = "请求失败:" + response;
    return false;
  }).then((a) => {
    if (a && dropDown.state.data[dropDown.state.count] && dropDown.state.data[dropDown.state.count] && dropDown.state.data[dropDown.state.count] && dropDown.state.data[dropDown.state.count].location) {
      /* dropDown.state.data[0]控制当前是第几个接口 */
      Vue.http.get(SWAGGER_URL + dropDown.state.data[dropDown.state.count].location).then((response) => {
        leftDropDownBoxContent.state.data = response.body;
        return true;
      }, (response) => {
        leftDropDownBoxContent.state.data = "请求失败:" + response;
        return false;
      })
    }
  })
}

init();

/* 调试模块 */
const debugRequest = {
  state: {data: [], count: 0, debugResponse: {}},
  mutations: {
    send(state, n){
      Vue.http({url: n.url, body: n.data, method: n.type.toUpperCase(), headers: n.headerParams})
        .then(function (response) {
          debugRequest.state.debugResponse = response;
          n.method();
        }, function (response) {
          debugRequest.state.debugResponse = response;
          n.method();
        })
    }
  }
};
/* 公共模块，功能性方法 */

export default new Vuex.Store({
  modules: {
    swaggerLeftHead: dropDown,
    leftDropDownBoxContent: leftDropDownBoxContent,
    debugRequest: debugRequest
  }
})








