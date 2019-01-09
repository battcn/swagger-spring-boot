import axios from 'axios'
import {SWAGGER_LOGIN, SWAGGER_SECURITY, SWAGGER_URL} from './config'

export function isVerify() {
  return axios.get(SWAGGER_URL + SWAGGER_SECURITY).then((res) => {
    return Promise.resolve(res)
  })
}

export function login(params) {
  let url = SWAGGER_LOGIN;
  if (params !== undefined && params !== null && JSON.stringify(params) !== "{}") {
    url += '?';
    for (let key in params) {
      url += `${key}=${params[key]}&`;
    }
    url = url.slice(0, url.length - 1);
  }
  return axios.post(url).then((res) => {
    return Promise.resolve(res)
  })
}


