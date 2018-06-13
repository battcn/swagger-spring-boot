import Vue from 'vue'
import Vuex from 'vuex'
import VueResource from 'vue-resource'
Vue.use(Vuex);
Vue.use(VueResource);

/* 下拉框数据 */
const dropDown={
  state:{data:[],count:0},
  mutations:{
    switch(state,n){
      dropDown.state.count=n;
      init();
    }
  }
}
/* 下拉框下方的接口数据 */
const  leftDropDownBoxContent={
  state:{data:[]}
}
/* 初始化:获取单选框数据， */
function init() {
  Vue.http.get(process.env.SWAGGER_URL).then((response)=>{
    dropDown.state.data=response.body;
    return true;
  },(response)=>{
    dropDown.state.data="请求失败:"+response;
    return false;
  }).then((a)=> {
    if(a&&dropDown.state.data[dropDown.state.count]&&dropDown.state.data[dropDown.state.count]['swaggerResources']&&dropDown.state.data[dropDown.state.count].swaggerResources[0]&&dropDown.state.data[dropDown.state.count].swaggerResources[0].location){
      /* dropDown.state.data[0]控制当前是第几个接口 */
      Vue.http.get(dropDown.state.data[dropDown.state.count].swaggerResources[0].location).then((response)=>{
        leftDropDownBoxContent.state.data=response.body;
        return true;
      },(response)=>{
        leftDropDownBoxContent.state.data="请求失败:"+response;
        return false;
      })
    }
  })
}
init();
/* 调试模块 */
const debugRequest={
  state:{data:[],count:0,debugResponse:{}},
  mutations:{
    send(state,n){
      Vue.http({url:n.url,body:n.data,method:n.type.toUpperCase(),headers:n.headerParams})
        .then(function (response){
          debugRequest.state.debugResponse=response;
          n.method();
        },function (response){
          debugRequest.state.debugResponse=response;
          n.method();
        })
    }
  }
}
/* 公共模块，功能性方法 */

export default new Vuex.Store({
  modules:{
    swaggerLeftHead:dropDown,
    leftDropDownBoxContent:leftDropDownBoxContent,
    debugRequest:debugRequest
  }
})








