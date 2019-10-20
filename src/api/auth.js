import { axios } from '@/utils/request'


export function login (parameter) {
  return axios({
    headers: {
      'Authorization': 'Basic dGVzdDp0ZXN0'
    },
    url: '/oauth/token',
    method: 'post',
    params: Object.assign({'grant_type': 'password'}, parameter)
  })
}


export function logout () {
  return axios({
    url: '/oauth/logout',
    method: 'delete'
  })
}

/**
 * get user 2step code open?
 * @param parameter {*}
 */
export function get2step (parameter) {
  return axios({
    url: api.twoStepCode,
    method: 'post',
    data: parameter
  })
}
