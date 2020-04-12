import { axios } from '@/utils/request'

export function getPage(query) {
  return axios({
    url: '/sys/dict/item/page',
    method: 'get',
    params: query
  })
}

export function addObj(obj) {
  return axios({
    url: '/sys/dict/item',
    method: 'post',
    data: obj
  })
}


export function delObj(id) {
  return axios({
    url: '/sys/dict/item/' + id,
    method: 'delete'
  })
}

export function putObj(obj) {
  return axios({
    url: '/sys/dict/item',
    method: 'put',
    data: obj
  })
}
