import request from '@/utils/request'

export function getPage(query) {
  return request({
    url: '/system/dict/item/page',
    method: 'get',
    params: query
  })
}

export function addObj(obj) {
  return request({
    url: '/system/dict/item',
    method: 'post',
    data: obj
  })
}


export function delObj(id) {
  return request({
    url: '/system/dict/item/' + id,
    method: 'delete'
  })
}

export function putObj(obj) {
  return request({
    url: '/system/dict/item',
    method: 'put',
    data: obj
  })
}

export function updateStatus(id, status) {
  return request({
    url: `/system/dict/item/${id}?status=${status}`,
    method: 'patch'
  })
}
