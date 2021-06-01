import request from '@/utils/request'

export function getPage(query) {
  return request({
    url: '/log/access-log/page',
    method: 'get',
    params: query
  })
}
