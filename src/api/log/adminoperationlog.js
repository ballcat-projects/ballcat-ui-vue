import { axios } from '@/utils/request'

export function getPage(query) {
  return axios({
    url: '/log/adminoperationlog/page',
    method: 'get',
    params: query
  })
}

export function getObj(id) {
  return axios({
    url: '/log/adminoperationlog/' + id,
    method: 'get'
  })
}


