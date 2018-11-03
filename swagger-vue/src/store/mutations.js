import * as types from './mutations_types'
import Vue from 'vue'

const mutations={
  [types.SET_DEBUGREQUEST_COUNT](state,count){
    state.debugRequest_count=count
  },
  [types.SET_DEBUGREQUEST_RESPONSE](state,response){
    state.debugResponse=response
  },
  [types.SET_DEBUGREQUEST_REQUESTTIME](state,time){
    state.debugRequestTime=time
  },
  [types.SET_DEBUGREQUEST_SECRETKEYS](state,secretkeys){
    state.debugAuthorizeObj=secretkeys
  },
  [types.SET_DEBUGREQUEST_SECRETKEY](state,secretkey){
    state.debugAuthorization=secretkey
  },
  /*  tab页数据*/
  [types.INSERT_TABDATA_ADDTAB](state,infoDataItem){
    Vue.set(state.tabDataInfo, infoDataItem.key, infoDataItem.value)
  },
  [types.SELETE_TABDATA_INFODATAITEM](state,key){
    return state.tabDataInfo[key]||undefined;
  },
  [types.UPDATE_TABDATA_INFODATA](state,key,val){
    Vue.set(state.tabDataInfo, key, val)
  },
  [types.DELETE_TABDATA_DELETETAB](state,key){
    if (key && state.tabDataInfo[key] !== undefined) {
      Vue.delete(state.tabDataInfo, key)
    }
  },
  [types.CLEAR_TABDATA_CLEARTAB](state){
    state.tabDataInfo={}
  },
  [types.UPDATE_TABDATA_UPDATETABSHOW](state,val){
    state.tabDataShow=val
  },
  /* 账号验证 */
  /* 判断是否设置账户验证 */
  [types.DECIDE_ACCOUNT_ISVERIFY](state,security){
    state.accountIsSecurity=security
  },
  /* 账户login验证 */
  [types.DECIDE_ACCOUNT_DECIDEACCOUNT](state){

  },
  /* 接口数据 */
  [types.UPDATE_DROPDOWN_DROPDOWNDATA](state,data){
    state.dropDownData=data
  },
  [types.UPDATE_DROPDOWN_DROPDOWNCOUNT](state,count){
    state.dropDownCount=count
  },
  [types.UPDATE_BOXCONTENT_BOXCONTENT](state,dropDownBoxContent){
    state.dropDownBoxContent=dropDownBoxContent
  }
}



export default mutations
