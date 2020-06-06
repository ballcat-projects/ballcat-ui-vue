import { axios } from '@/utils/request'

export function getPage(query) {
  return axios({
    url: '/sys/config/page',
    method: 'get',
    params: query
  })
}

export function addObj(obj) {
  return axios({
    url: '/sys/config',
    method: 'post',
    data: obj
  })
}

export function getObj(id) {
  return axios({
    url: '/sys/config/' + id,
    method: 'get'
  })
}

export function delObj(id) {
  return axios({
    url: '/sys/config/' + id,
    method: 'delete'
  })
}

export function putObj(obj) {
  return axios({
    url: '/sys/config',
    method: 'put',
    data: obj
  })
}
