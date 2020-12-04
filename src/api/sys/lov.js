import request from '@/utils/request'

export function getData(keyword){
 return  request.get(`/lov/data/${keyword}`)
}

export function getPage(query) {
  return request({
    url: '/lov/page',
    method: 'get',
    params: query
  })
}

export function update(obj) {
  return request({
    url: '/lov',
    method: 'post',
    data: obj
  })
}

export function delObj(id) {
  return request({
    url: '/lov/' + id,
    method: 'delete'
  })
}

export function create(obj) {
  return request({
    url: '/lov',
    method: 'put',
    data: obj
  })
}
