import axios from 'axios'
import {SWAGGER_URL,DROPDOWN} from './config'

export function getDropDown() {
  console.log("正在请求。。。")
  return axios.get(SWAGGER_URL+DROPDOWN).then((res)=>{
    console.log("请求成功")
    return  Promise.resolve(res)
  })
}
export function getBoxContent(urlSuffix) {
return axios.get(SWAGGER_URL+urlSuffix).then((res)=>{
  return  Promise.resolve(res)
})
}








