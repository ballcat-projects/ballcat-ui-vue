import { axios } from '@/utils/request'

export function getPage(query) {
  return axios({
    url: '/log/apiaccesslog/page',
    method: 'get',
    params: query
  })
}

export function getObj(id) {
  return axios({
    url: '/log/apiaccesslog/' + id,
    method: 'get'
  })
}
