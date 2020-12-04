import request from '@/utils/request'

export function getPage(query) {
  return request({
    url: '/log/adminaccesslog/page',
    method: 'get',
    params: query
  })
}

export function getObj(id) {
  return request({
    url: '/log/adminaccesslog/' + id,
    method: 'get'
  })
}
