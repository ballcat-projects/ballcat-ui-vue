import request from '@/utils/request'

export function getPage(query) {
  return request({
    url: '/sys/dict/item/page',
    method: 'get',
    params: query
  })
}

export function addObj(obj) {
  return request({
    url: '/sys/dict/item',
    method: 'post',
    data: obj
  })
}


export function delObj(id) {
  return request({
    url: '/sys/dict/item/' + id,
    method: 'delete'
  })
}

export function putObj(obj) {
  return request({
    url: '/sys/dict/item',
    method: 'put',
    data: obj
  })
}
