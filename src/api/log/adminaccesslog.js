import { axios } from '@/utils/request'

export function getPage(query) {
  return axios({
    url: '/log/adminaccesslog/page',
    method: 'get',
    params: query
  })
}

export function getObj(id) {
  return axios({
    url: '/log/adminaccesslog/' + id,
    method: 'get'
  })
}
