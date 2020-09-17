import { axios } from '@/utils/request'

export function getPage(query) {
  return axios({
    url: '/log/adminloginlog/page',
    method: 'get',
    params: query
  })
}
