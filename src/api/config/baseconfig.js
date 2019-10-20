import { axios } from '@/utils/request'

export function getPage(query) {
  return axios({
    url: '/config/baseconfig/page',
    method: 'get',
    params: query
  })
}

export function addObj(obj) {
  return axios({
    url: '/config/baseconfig',
    method: 'post',
    data: obj
  })
}

export function getObj(id) {
  return axios({
    url: '/config/baseconfig/' + id,
    method: 'get'
  })
}

export function delObj(id) {
  return axios({
    url: '/config/baseconfig/' + id,
    method: 'delete'
  })
}

export function putObj(obj) {
  return axios({
    url: '/config/baseconfig',
    method: 'put',
    data: obj
  })
}
