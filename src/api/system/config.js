import request from '@/utils/request'

export function getPage(query) {
  return request({
    url: '/system/config/page',
    method: 'get',
    params: query
  })
}

export function addObj(obj) {
  return request({
    url: '/system/config',
    method: 'post',
    data: obj
  })
}

export function delObj(confKey) {
  return request({
    url: `/system/config?confKey=${confKey}`,
    method: 'delete'
  })
}

export function putObj(obj) {
  return request({
    url: '/system/config',
    method: 'put',
    data: obj
  })
}
