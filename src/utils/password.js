import * as CryptoJS from 'crypto-js'

const securityKey = '==BallCat-Auth=='

export const encryption = (pass) => {
  // 密码加密
  const key = CryptoJS.enc.Latin1.parse(securityKey)
  return CryptoJS.AES.encrypt(
    pass,
    key, {
      iv: key,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    }).toString()
}

