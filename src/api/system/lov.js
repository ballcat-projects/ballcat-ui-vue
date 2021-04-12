import request from '@/utils/request'

export function getData(keyword){
 return  request.get(`/system/lov/data/${keyword}`)
}

export function getPage(query) {
  return request({
    url: '/system/lov/page',
    method: 'get',
    params: query
  })
}

export function update(obj) {
  return request({
    url: '/system/lov',
    method: 'post',
    data: obj
  })
}

export function delObj(id) {
  return request({
    url: '/system/lov/' + id,
    method: 'delete'
  })
}

export function create(obj) {
  return request({
    url: '/system/lov',
    method: 'put',
    data: obj
  })
}

export function check(map) {
  return request({
    url: '/system/lov/check',
    method: 'post',
    data: map
  })
}
