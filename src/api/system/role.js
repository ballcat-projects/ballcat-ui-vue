import request from '@/utils/request'

export function getPage (query) {
  return request({
    url: '/system/role/page',
    method: 'get',
    params: query
  })
}

export function getObj (id) {
  return request({
    url: '/system/role/' + id,
    method: 'get'
  })
}

export function addObj (obj) {
  return request({
    url: '/system/role',
    method: 'post',
    data: obj
  })
}

export function putObj (obj) {
  return request({
    url: '/system/role',
    method: 'put',
    data: obj
  })
}

export function delObj (id) {
  return request({
    url: '/system/role/' + id,
    method: 'delete'
  })
}

export function getSelectData () {
  return request({
    url: '/system/role/select',
    method: 'get'
  })
}

export function getPermissionCode (roleCode) {
  return request({
    url: '/system/role/permission/code/' + roleCode,
    method: 'get'
  })
}

export function putPermissionIds (roleCode, data) {
  return request({
    url: '/system/role/permission/code/' + roleCode,
    method: 'put',
    data: data
  })
}

export function getRoleUserPage (query) {
  return request({
    url: '/system/role/user/page',
    method: 'get',
    params: query
  })
}

export function unbindRoleUser (userId, roleCode) {
  return request({
    url: '/system/role/user',
    method: 'delete',
    params: {
      userId: userId,
      roleCode: roleCode
    }
  })
}
