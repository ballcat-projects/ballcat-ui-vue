import request from '@/utils/request'
import qs from 'qs'

export function getPage (query) {
  return request({
    url: '/sysuser/page',
    method: 'get',
    params: query
  })
}

export function addObj (obj) {
  return request({
    url: '/sysuser',
    method: 'post',
    data: obj
  })
}

export function putObj (obj) {
  return request({
    url: '/sysuser',
    method: 'put',
    data: obj
  })
}

export function delObj (id) {
  return request({
    url: '/sysuser/' + id,
    method: 'delete'
  })
}

export function getUserScope (userId) {
  return request({
    url: '/sysuser/scope/' + userId,
    method: 'get'
  })
}

export function putUserScope (userId, userScope) {
  return request({
    url: '/sysuser/scope/' + userId,
    method: 'put',
    data: userScope
  })
}

export function changePassword (userId, params) {
  return request({
    url: '/sysuser/pass/' + userId,
    method: 'put',
    params: params
  })
}

export function updateStatus (userIds, status) {
  return request({
    url: '/sysuser/status/',
    method: 'put',
    params: { 'status': status },
    data: userIds
  })
}

export function updateAvatar (userId, fileObj) {
  const formData = new FormData()
  formData.append('file', fileObj.data, fileObj.name)
  formData.append('userId', userId)
  return request.post('/sysuser/avatar', formData, { contentType: false, processData: false })
}

export function getSelectData (userTypesArr) {
  return request({
    url: '/sysuser/select',
    params: { userTypes: userTypesArr },
    paramsSerializer: function (params) {
      return qs.stringify(params, { arrayFormat: 'repeat' })
    },
    method: 'get'
  })
}
