import request from '@/utils/request'

export function getPage(query) {
  return request({
    url: '/log/adminoperationlog/page',
    method: 'get',
    params: query
  })
}

export function getObj(id) {
  return request({
    url: '/log/adminoperationlog/' + id,
    method: 'get'
  })
}


