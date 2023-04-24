import request  from '@/utils/request'
import Vue from 'vue'
import { ACCESS_TOKEN } from '@/store/storage-types'

// Base64(clientId:clientSecret)
const BASIC_AUTHORIZATION = 'Basic dWk6dWk='

export function login (parameter) {
  return request({
    headers: {
      'Authorization': BASIC_AUTHORIZATION
    },
    url: '/oauth2/token',
    method: 'post',
    params: Object.assign({'grant_type': 'password'}, parameter)
  })
}

export function checkToken (token) {
  return request({
    headers: {
      'Authorization': BASIC_AUTHORIZATION
    },
    url: '/oauth2/check_token',
    method: 'post',
    params: { token: token }
  })
}

export function logout () {
  const accessToken = Vue.ls.get(ACCESS_TOKEN)
  return request({
    url: '/oauth2/revoke',
    method: 'POST',
    headers: {
      Authorization: BASIC_AUTHORIZATION
    },
    params: { token: accessToken }
  })
}
