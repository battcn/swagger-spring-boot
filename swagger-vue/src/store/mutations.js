import * as types from './mutations-types'
import Vue from 'vue'

const mutations={
  [types.SET_DEBUGREQUEST_COUNT](state,count){
    state.debugRequest_count=count
  },
  [types.SET_DEBUGREQUEST_RESPONSE](state,response){
    state.debugRequest_debugResponse=response
  },
  [types.SET_DEBUGREQUEST_REQUESTTIME](state,time){
    state.debugRequest_requestTime=time
  },
  [types.SET_DEBUGREQUEST_SECRETKEYS](state,secretkeys){
    state.debugRequest_authorizeObj=secretkeys
  },
  [types.SET_DEBUGREQUEST_SECRETKEY](state,secretkey){
    state.debugRequest_authorization=secretkey
  },
  /*  tab页数据*/
  [types.INSERT_TABDATA_ADDTAB](state,infoDataItem){
    Vue.set(state.tabData_infoData, infoDataItem.key, infoDataItem.value)
  },
  [types.SELETE_TABDATA_INFODATAITEM](state,key){
    return state.tabData_infoData[key]||undefined;
  },
  [types.UPDATE_TABDATA_INFODATA](state,key,val){
    Vue.set(state.tabData_infoData, key, val)
  },
  [types.DELETE_TABDATA_DELETETAB](state,key){
    if (key && state.tabData_infoData[key] !== undefined) {
      Vue.delete(state.tabData_infoData, key)
    }
  },
  [types.CLEAR_TABDATA_CLEARTAB](state){
    state.tabData_infoData={}
  },
  [types.UPDATE_TABDATA_UPDATETABSHOW](state,val){
    state.tabData_show=val
  },
  /* 账号验证 */
  /* 判断是否设置账户验证 */
  [types.DECIDE_ACCOUNT_ISVERIFY](state,security){
    state.account_isSecurity=security
  },
  /* 账户login验证 */
  [types.DECIDE_ACCOUNT_DECIDEACCOUNT](state){

  },
  /* 接口数据 */
  [types.UPDATE_DROPDOWN_DROPDOWNDATA](state,data){
    state.dropDown_Data=data
  },
  [types.UPDATE_DROPDOWN_DROPDOWNCOUNT](state,count){
    state.dropDown_count=count
  },
  [types.UPDATE_BOXCONTENT_BOXCONTENT](state,dropDownBoxContent){
    state.dropDownBoxContent=dropDownBoxContent
  }
}



export default mutations
