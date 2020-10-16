import { axios } from '@/utils/request'

export function getTree(query) {
  return axios({
    url: '/sys/organization/tree',
    method: 'get',
    params: query
  })
}

export function addObj(obj) {
  return axios({
    url: '/sys/organization',
    method: 'post',
    data: obj
  })
}

export function delObj(id) {
  return axios({
    url: '/sys/organization/' + id,
    method: 'delete'
  })
}

export function putObj(obj) {
  return axios({
    url: '/sys/organization',
    method: 'put',
    data: obj
  })
}
