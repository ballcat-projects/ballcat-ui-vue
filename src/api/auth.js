import request  from '@/utils/request'

export function login (parameter) {
  return request({
    headers: {
      'Authorization': 'Basic dWk6dWk='
    },
    url: '/oauth/token',
    method: 'post',
    params: Object.assign({'grant_type': 'password'}, parameter)
  })
}

export function logout () {
  return request({
    url: '/oauth/logout',
    method: 'delete'
  })
}

/**
 * get user 2step code open?
 * @param parameter {*}
 */
export function get2step (parameter) {
  return request({
    url: api.twoStepCode,
    method: 'post',
    data: parameter
  })
}
