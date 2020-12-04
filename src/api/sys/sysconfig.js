import request from '@/utils/request'

export function getPage(query) {
  return request({
    url: '/sys/config/page',
    method: 'get',
    params: query
  })
}

export function addObj(obj) {
  return request({
    url: '/sys/config',
    method: 'post',
    data: obj
  })
}

export function getObj(id) {
  return request({
    url: '/sys/config/' + id,
    method: 'get'
  })
}

export function delObj(id) {
  return request({
    url: '/sys/config/' + id,
    method: 'delete'
  })
}

export function putObj(obj) {
  return request({
    url: '/sys/config',
    method: 'put',
    data: obj
  })
}
