/**
 * 从响应头中解析对应的文件名
 * @param headers
 * @returns {string}
 */
function resolveFileName (headers) {
  let match = headers['content-disposition'].match(/filename=(.*)/)
  if(match && match.length > 0){
    return decodeURI(match[1])
  }
}

/**
 * 远程文件下载
 * @param response
 * @param fileName
 */
export function remoteFileDownload (response, fileName) {
  if (response.data) {
    // 构造一个blob对象来处理数据，并设置文件类型
    let headers = response.headers
    let contentType = headers['content-type']
    const blob = new Blob([response.data], { type: contentType })

    // 不存在则从响应头中解析
    if (!fileName) {
      fileName = resolveFileName(headers)
    }

    if (window.navigator.msSaveOrOpenBlob) { //兼容IE10
      navigator.msSaveBlob(blob, fileName)
    } else {
      const href = URL.createObjectURL(blob) //创建新的URL表示指定的blob对象
      const a = document.createElement('a') //创建a标签
      a.style.display = 'none'
      a.href = href // 指定下载链接
      a.download = fileName //指定下载文件名
      a.click() //触发下载
      URL.revokeObjectURL(a.href) //释放URL对象
    }
  }
}
