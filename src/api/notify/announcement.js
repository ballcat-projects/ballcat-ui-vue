import request from '@/utils/request'

export function getPage(query) {
  return request({
    url: '/notify/announcement/page',
    method: 'get',
    params: query
  })
}

export function addObj(obj) {
  return request({
    url: '/notify/announcement',
    method: 'post',
    data: obj
  })
}

export function delObj(id) {
  return request({
    url: '/notify/announcement/' + id,
    method: 'delete'
  })
}

export function putObj(obj) {
  return request({
    url: '/notify/announcement',
    method: 'put',
    data: obj
  })
}
