import request from '@/utils/request'

export function getDictData (dictCodes) {
  return request({
    url: '/system/dict/data?dictCodes=' + dictCodes.join(','),
    method: 'get'
  })
}

export function invalidDictHash(map) {
  return request({
    url: '/system/dict/invalid-hash',
    method: 'post',
    data: map
  })
}


export function getPage(query) {
  return request({
    url: '/system/dict/page',
    method: 'get',
    params: query
  })
}

export function addObj(obj) {
  return request({
    url: '/system/dict',
    method: 'post',
    data: obj
  })
}

export function getObj(id) {
  return request({
    url: '/system/dict/' + id,
    method: 'get'
  })
}

export function statusObj(id, status) {
  return request({
    url: '/system/dict/' + id + '/' + status,
    method: 'patch'
  })
}

export function putObj(obj) {
  return request({
    url: '/system/dict',
    method: 'put',
    data: obj
  })
}
