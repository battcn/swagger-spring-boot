import axios from 'axios'
import {SWAGGER_RESOURCES, SWAGGER_URL} from './config'

export function getDropDown() {
  return axios.get(SWAGGER_RESOURCES).then((res) => {
    return Promise.resolve(res)
  })
}
export function getBoxContent(urlSuffix) {
  return axios.get(SWAGGER_URL + urlSuffix).then((res) => {
    return Promise.resolve(res)
  })
}








