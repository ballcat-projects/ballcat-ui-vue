import request from '@/utils/request'

export function getPage(query) {
  return request({
    url: '/system/config/page',
    method: 'get',
    params: query
  })
}

export function addObj(obj) {
  return request({
    url: '/system/config',
    method: 'post',
    data: obj
  })
}

export function getObj(id) {
  return request({
    url: '/system/config/' + id,
    method: 'get'
  })
}

export function delObj(id) {
  return request({
    url: '/system/config/' + id,
    method: 'delete'
  })
}

export function putObj(obj) {
  return request({
    url: '/system/config',
    method: 'put',
    data: obj
  })
}
