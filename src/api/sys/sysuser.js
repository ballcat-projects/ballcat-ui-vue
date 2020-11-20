import { axios } from '@/utils/request'
import qs from 'qs'

export function getPage (query) {
  return axios({
    url: '/sysuser/page',
    method: 'get',
    params: query
  })
}

export function getObj (id) {
  return axios({
    url: '/sysuser/' + id,
    method: 'get'
  })
}

export function addObj (obj) {
  return axios({
    url: '/sysuser',
    method: 'post',
    data: obj
  })
}

export function putObj (obj) {
  return axios({
    url: '/sysuser',
    method: 'put',
    data: obj
  })
}

export function delObj (id) {
  return axios({
    url: '/sysuser/' + id,
    method: 'delete'
  })
}

export function getUserScope (userId) {
  return axios({
    url: '/sysuser/scope/' + userId,
    method: 'get'
  })
}

export function putUserScope (userId, userScope) {
  return axios({
    url: '/sysuser/scope/' + userId,
    method: 'put',
    data: userScope
  })
}

export function changePassword (userId, params) {
  return axios({
    url: '/sysuser/pass/' + userId,
    method: 'put',
    params: params
  })
}

export function updateStatus (userIds, status) {
  return axios({
    url: '/sysuser/status/',
    method: 'put',
    params: { 'status': status },
    data: userIds
  })
}

export function getSelectData (userTypesArr) {
  return axios({
    url: '/sysuser/select',
    params: { userTypes: userTypesArr },
    paramsSerializer: function (params) {
      return qs.stringify(params, { arrayFormat: 'repeat' })
    },
    method: 'get'
  })
}
