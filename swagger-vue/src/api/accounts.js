import axios from 'axios'
import {SWAGGER_URL,ISVERIFY,LOGIN} from './config'

export function isVerify() {
  return axios.get(SWAGGER_URL+ISVERIFY).then((res)=>{
    return Promise.resolve(res)
  })
}
export function login(params) {
  let url =SWAGGER_URL+LOGIN;
  if(params!==undefined&&params!==null&&JSON.stringify(params)!=="{}"){
    url+='?';
    for (let key in params) {
      url += `${key}=${params[key]}&`;
    }
    url = url.slice(0, url.length - 1);
  }
  return axios.post(url).then((res)=>{
    return  Promise.resolve(res)
  })
}


