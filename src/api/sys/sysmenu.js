import request from '@/utils/request'

export function getLoginUserMenu () {
  return request({
    url: '/sys/sysmenu/router',
    method: 'get'
  })
}


export function list(query) {
  return request({
    url: '/sys/sysmenu/list',
    method: 'get',
    params: query
  })
}

export function addObj(obj) {
  return request({
    url: '/sys/sysmenu',
    method: 'post',
    data: obj
  })
}

export function delObj(id) {
  return request({
    url: '/sys/sysmenu/' + id,
    method: 'delete'
  })
}

export function putObj(obj) {
  return request({
    url: '/sys/sysmenu',
    method: 'put',
    data: obj
  })
}
