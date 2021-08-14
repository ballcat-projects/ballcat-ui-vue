import request from '@/utils/request'

export function getPage (query) {
  return request({
    url: '/i18n/i18n-data/page',
    method: 'get',
    params: query
  })
}

export function addObj (obj) {
  return request({
    url: '/i18n/i18n-data',
    method: 'post',
    data: obj
  })
}

export function delObj (code, languageTag) {
  return request({
    url: '/i18n/i18n-data',
    method: 'delete',
    params: {
      code: code,
      languageTag: languageTag
    }
  })
}

export function putObj (obj) {
  return request({
    url: '/i18n/i18n-data',
    method: 'put',
    data: obj
  })
}

export function exportExcel (query) {
  return request({
    url: '/i18n/i18n-data/export',
    method: 'get',
    params: query,
    responseType: 'blob'
  })
}

export function importExcel (formData) {
  return request.post('/i18n/i18n-data/import', formData, { contentType: false, processData: false })
}

export function downloadTemplate () {
  return request({
    url: '/i18n/i18n-data/excel-template',
    method: 'get',
    responseType: 'blob'
  })
}
