import request from '@/utils/request'

export function getPage(query) {
  return request({
    url: '/log/login-log/page',
    method: 'get',
    params: query
  })
}
