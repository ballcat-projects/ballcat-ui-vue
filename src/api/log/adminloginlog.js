import request from '@/utils/request'

export function getPage(query) {
  return request({
    url: '/log/adminloginlog/page',
    method: 'get',
    params: query
  })
}
