import request from '@/utils/request'

export function getPage(query) {
  return request({
    url: '/notify/announcement/page',
    method: 'get',
    params: query
  })
}

export function addObj(obj) {
  return request({
    url: '/notify/announcement',
    method: 'post',
    data: obj
  })
}

export function delObj(id) {
  return request({
    url: '/notify/announcement/' + id,
    method: 'delete'
  })
}

export function putObj(obj) {
  return request({
    url: '/notify/announcement',
    method: 'put',
    data: obj
  })
}


export function publish(id) {
  return request({
    url: '/notify/announcement/publish/' + id,
    method: 'patch'
  })
}


export function close(id) {
  return request({
    url: '/notify/announcement/close/' + id,
    method: 'patch'
  })
}

export function uploadImage (resultFiles) {
  const formData = new FormData()
  resultFiles.forEach(file  => {
    formData.append('files', file);
  });
  return request.post('/notify/announcement/image', formData, { contentType: false, processData: false })
}
