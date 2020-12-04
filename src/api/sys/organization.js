import request from '@/utils/request'

export function getTree(query) {
  return request({
    url: '/sys/organization/tree',
    method: 'get',
    params: query
  })
}

export function addObj(obj) {
  return request({
    url: '/sys/organization',
    method: 'post',
    data: obj
  })
}

export function delObj(id) {
  return request({
    url: '/sys/organization/' + id,
    method: 'delete'
  })
}

export function putObj(obj) {
  return request({
    url: '/sys/organization',
    method: 'put',
    data: obj
  })
}
