import request from '@/utils/request'

export function getLoginUserRouter () {
  return request({
    url: '/syspermission/router',
    method: 'get'
  })
}

export function getList () {
  return request({
    url: '/syspermission/list',
    method: 'get'
  })
}


export function addObj(obj) {
  return request({
    url: '/syspermission',
    method: 'post',
    data: obj
  })
}

export function putObj(obj) {
  return request({
    url: '/syspermission',
    method: 'put',
    data: obj
  })
}

export function delObj(id) {
  return request({
    url: '/syspermission/' + id,
    method: 'delete'
  })
}
