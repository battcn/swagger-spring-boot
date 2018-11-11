import axios from "axios"
import {SWAGGER_URL} from './config'

export function getDebugRequest(requestData) {
  let data = Object.assign({}, requestData, {});
  // responseType:data.responseType||'json'
  return axios.request({
    url: SWAGGER_URL + data.url,
    data: data.data,
    method: data.type.toUpperCase(),
    headers: data.headerParams,
    responseType: data.responseType || 'json'
  }).then((res) => {
    return Promise.resolve(res)
  })
}


