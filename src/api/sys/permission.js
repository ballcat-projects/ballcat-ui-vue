import { axios } from '@/utils/request'

export function getLoginUserRouter () {
  return axios({
    url: '/syspermission/router',
    method: 'get'
  })
}

export function getList () {
  return axios({
    url: '/syspermission/list',
    method: 'get'
  })
}


export function addObj(obj) {
  return axios({
    url: '/syspermission',
    method: 'post',
    data: obj
  })
}

export function putObj(obj) {
  return axios({
    url: '/syspermission',
    method: 'put',
    data: obj
  })
}

export function delObj(id) {
  return axios({
    url: '/syspermission/' + id,
    method: 'delete'
  })
}