import axios from 'axios'
import {SWAGGER_URL,DROPDOWN} from './config'

export function getDropDown() {
  return axios.get(SWAGGER_URL+DROPDOWN).then((res)=>{
    return  Promise.resolve(res)
  })
}
export function getBoxContent(urlSuffix) {
return axios.get(SWAGGER_URL+urlSuffix).then((res)=>{
  return  Promise.resolve(res)
})
}








