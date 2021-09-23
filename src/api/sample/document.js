import request from '@/utils/request'

export function getPage(query) {
  return request({
    url: '/sample/document/page',
    method: 'get',
    params: query
  })
}

export function addObj(obj) {
  return request({
    url: '/sample/document',
    method: 'post',
    data: obj
  })
}

export function delObj(id) {
  return request({
    url: '/sample/document/' + id,
    method: 'delete'
  })
}

export function putObj(obj) {
  return request({
    url: '/sample/document',
    method: 'put',
    data: obj
  })
}