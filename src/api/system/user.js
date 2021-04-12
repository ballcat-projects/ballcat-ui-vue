import request from '@/utils/request'
import qs from 'qs'

export function getPage (query) {
  return request({
    url: '/system/user/page',
    method: 'get',
    params: query
  })
}

export function addObj (obj) {
  return request({
    url: '/system/user',
    method: 'post',
    data: obj
  })
}

export function putObj (obj) {
  return request({
    url: '/system/user',
    method: 'put',
    data: obj
  })
}

export function delObj (id) {
  return request({
    url: '/system/user/' + id,
    method: 'delete'
  })
}

export function getUserScope (userId) {
  return request({
    url: '/system/user/scope/' + userId,
    method: 'get'
  })
}

export function putUserScope (userId, userScope) {
  return request({
    url: '/system/user/scope/' + userId,
    method: 'put',
    data: userScope
  })
}

export function changePassword (userId, data) {
  return request({
    url: '/system/user/pass/' + userId,
    method: 'put',
    data: data
  })
}

export function updateStatus (userIds, status) {
  return request({
    url: '/system/user/status/',
    method: 'put',
    params: { 'status': status },
    data: userIds
  })
}

export function updateAvatar (userId, fileObj) {
  const formData = new FormData()
  formData.append('file', fileObj.data, fileObj.name)
  formData.append('userId', userId)
  return request.post('/system/user/avatar', formData, { contentType: false, processData: false })
}

export function getSelectData (userTypesArr) {
  return request({
    url: '/system/user/select',
    params: { userTypes: userTypesArr },
    paramsSerializer: function (params) {
      return qs.stringify(params, { arrayFormat: 'repeat' })
    },
    method: 'get'
  })
}
