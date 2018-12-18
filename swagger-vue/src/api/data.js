import axios from 'axios'
import {PROJECT_NAME, SWAGGER_RESOURCES, SWAGGER_URL} from './config'

export function getDropDown() {
  axios.post('/news/index').then((res)=>{
    console.log(res)
  })
  return axios.get(SWAGGER_URL + SWAGGER_RESOURCES).then((res) => {
    return Promise.resolve(res)
  })
}

export function getBoxContent(urlSuffix) {
  return axios.get(SWAGGER_URL + PROJECT_NAME + urlSuffix).then((res) => {
    return Promise.resolve(res)
  })
}








