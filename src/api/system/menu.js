import request from '@/utils/request'

export function getLoginUserMenu () {
  return request({
    url: '/system/menu/router',
    method: 'get'
  })
}

export function listMenu(query) {
  return request({
    url: '/system/menu/list',
    method: 'get',
    params: query
  })
}

export function grantList() {
  return request({
    url: '/system/menu/grant-list',
    method: 'get'
  })
}


export function addObj(obj) {
  return request({
    url: '/system/menu',
    method: 'post',
    data: obj
  })
}

export function delObj(id) {
  return request({
    url: '/system/menu/' + id,
    method: 'delete'
  })
}

export function putObj(obj) {
  return request({
    url: '/system/menu',
    method: 'put',
    data: obj
  })
}
