export const debugRequestCount = state => state.debugRequestCount
export const debugResponse = state => state.debugResponse
export const debugRequestTime = state => state.debugRequestTime
export const debugAuthorizeObj = state => state.debugAuthorizeObj
export const debugAuthorization = state => state.debugAuthorization

export const tabDataInfo = state => state.tabDataInfo


export const tabDataShow = state => state.tabDataShow

export const accountIsSecurity = state => state.accountIsSecurity

export const dropDownData = state => state.dropDownData

export const dropDownCount = state => state.dropDownCount

export const dropDownBoxContent = state => state.dropDownBoxContent

export const tagResult = state => {
  const result = []
  if (!state.dropDownBoxContent.paths) {
    return result
  }
  if (!state.searchKey) {
    return state.dropDownBoxContent.tags
  }
  return result
}
export const apiResult = state => {
  const result = []
  if (!state.dropDownBoxContent.paths) {
    return result
  }
  if (!state.searchKey) {
    return state.dropDownBoxContent.paths
  }
  return result
}
export const linkList = state => state.listContent
export const model = state => state.model

