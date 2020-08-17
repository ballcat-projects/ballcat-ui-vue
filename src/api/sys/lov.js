import { axios } from '@/utils/request'

export function getData(keyword){
 return  axios.get(`/lov/data/${keyword}`)
}

export function getPage(query) {
  return axios({
    url: '/lov/page',
    method: 'get',
    params: query
  })
}

export function update(obj) {
  return axios({
    url: '/lov',
    method: 'post',
    data: obj
  })
}

export function delObj(id) {
  return axios({
    url: '/lov/' + id,
    method: 'delete'
  })
}

export function create(obj) {
  return axios({
    url: '/lov',
    method: 'put',
    data: obj
  })
}