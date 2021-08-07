import request from '@/utils/request'

export function getPage(query) {
  return request({
    url: '/i18n/i18n-data/page',
    method: 'get',
    params: query
  })
}

export function addObj(obj) {
  return request({
    url: '/i18n/i18n-data',
    method: 'post',
    data: obj
  })
}

export function delObj(code, languageTag) {
  return request({
    url: '/i18n/i18n-data',
    method: 'delete',
    params: {
      code: code,
      languageTag: languageTag
    }
  })
}

export function putObj(obj) {
  return request({
    url: '/i18n/i18n-data',
    method: 'put',
    data: obj
  })
}
