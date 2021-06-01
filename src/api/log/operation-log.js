import request from '@/utils/request'

export function getPage(query) {
  return request({
    url: '/log/operation-log/page',
    method: 'get',
    params: query
  })
}


