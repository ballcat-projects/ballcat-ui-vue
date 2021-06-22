import request from '@/utils/request'

export function getTree(query) {
  return request({
    url: '/system/organization/tree',
    method: 'get',
    params: query
  })
}

export function addObj(obj) {
  return request({
    url: '/system/organization',
    method: 'post',
    data: obj
  })
}

export function delObj(id) {
  return request({
    url: '/system/organization/' + id,
    method: 'delete'
  })
}

export function putObj(obj) {
  return request({
    url: '/system/organization',
    method: 'put',
    data: obj
  })
}

export function revised() {
  return request({
    url: '/system/organization/revised',
    method: 'patch'
  })
}
