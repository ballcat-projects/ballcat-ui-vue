import * as CryptoJS from 'crypto-js'

const securityKey = '==BallCat-Auth=='

export const passEncrypt = (pass) => {
  // 密码加密
  const key = CryptoJS.enc.Utf8.parse(securityKey)
  return CryptoJS.AES.encrypt(
    pass,
    key, {
      iv: key,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    }).toString()
}

/**
 * @word 要加密的内容
 * @keyWord String  服务器随机返回的关键字
 *  */
export function captchaEncrypt (word, keyWord = 'XwKsGlMcdPMEhR1B') {
  const key = CryptoJS.enc.Utf8.parse(keyWord)
  const srcs = CryptoJS.enc.Utf8.parse(word)
  const encrypted = CryptoJS.AES.encrypt(srcs, key, { mode: CryptoJS.mode.ECB, padding: CryptoJS.pad.Pkcs7 })
  return encrypted.toString()
}
