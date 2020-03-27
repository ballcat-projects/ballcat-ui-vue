import { axios } from '@/utils/request'

export function getDictSelectData (dictCode) {
  return axios({
    url: '/sys/dict/select/' + dictCode,
    method: 'get'
  })
}

export function getPage(query) {
  return axios({
    url: '/sys/dict/page',
    method: 'get',
    params: query
  })
}

export function addObj(obj) {
  return axios({
    url: '/sys/dict',
    method: 'post',
    data: obj
  })
}

export function getObj(id) {
  return axios({
    url: '/sys/dict/' + id,
    method: 'get'
  })
}

export function delObj(id) {
  return axios({
    url: '/sys/dict/' + id,
    method: 'delete'
  })
}

export function putObj(obj) {
  return axios({
    url: '/sys/dict',
    method: 'put',
    data: obj
  })
}
