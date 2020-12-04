import request from '@/utils/request'

export function getPage (query) {
  return request({
    url: '/sysrole/page',
    method: 'get',
    params: query
  })
}

export function getObj (id) {
  return request({
    url: '/sysrole/' + id,
    method: 'get'
  })
}

export function addObj (obj) {
  return request({
    url: '/sysrole',
    method: 'post',
    data: obj
  })
}

export function putObj (obj) {
  return request({
    url: '/sysrole',
    method: 'put',
    data: obj
  })
}

export function delObj (id) {
  return request({
    url: '/sysrole/' + id,
    method: 'delete'
  })
}

export function getSelectData () {
  return request({
    url: '/sysrole/select',
    method: 'get'
  })
}

export function getPermissionCode (roleCode) {
  return request({
    url: '/sysrole/permission/code/' + roleCode,
    method: 'get'
  })
}

export function putPermissionIds (roleCode, data) {
  return request({
    url: '/sysrole/permission/code/' + roleCode,
    method: 'put',
    data: data
  })
}

