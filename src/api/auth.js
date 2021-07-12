import request  from '@/utils/request'

// Base64(clientId:clientSecret)
const BASIC_AUTHORIZATION = 'Basic dWk6dWk='

export function login (parameter) {
  return request({
    headers: {
      'Authorization': BASIC_AUTHORIZATION
    },
    url: '/oauth/token',
    method: 'post',
    params: Object.assign({'grant_type': 'password'}, parameter)
  })
}

export function checkToken (token) {
  return request({
    headers: {
      'Authorization': BASIC_AUTHORIZATION
    },
    url: '/oauth/check_token',
    method: 'post',
    params: { token: token }
  })
}

export function logout () {
  return request({
    url: '/oauth/logout',
    method: 'delete'
  })
}
