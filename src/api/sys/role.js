import { axios } from '@/utils/request'

export function getPage(query) {
  return axios({
    url: '/sysrole/page',
    method: 'get',
    params: query
  })
}

export function getObj(id) {
  return axios({
    url: '/sysrole/' + id,
    method: 'get'
  })
}

export function addObj(obj) {
  return axios({
    url: '/sysrole',
    method: 'post',
    data: obj
  })
}

export function putObj(obj) {
  return axios({
    url: '/sysrole',
    method: 'put',
    data: obj
  })
}

export function delObj(id) {
  return axios({
    url: '/sysrole/' + id,
    method: 'delete'
  })
}


export function getSelectData() {
  return axios({
    url: '/sysrole/select',
    method: 'get'
  })
}

export function getPermissionIds (roleId) {
  return axios({
    url: '/sysrole/permission/ids/' + roleId,
    method: 'get'
  })
}

export function putPermissionIds (roleId, data) {
  return axios({
    url: '/sysrole/permission/ids/' + roleId,
    method: 'put',
    data: data
  })
}

