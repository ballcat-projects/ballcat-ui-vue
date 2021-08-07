/**
 * Vue i18n loader
 * created by @musnow
 * https://github.com/musnow
 */
import Vue from 'vue'
import VueI18n from 'vue-i18n'
import store from '@/store'
import { APP_LANGUAGE } from '@/store/storage-types'

Vue.use(VueI18n)

// default language
export const defaultLang = 'zh-CN'
import zhCN from './lang/zh-CN'

const messages = {
  'zh-CN': {
    ...zhCN
  }
}

export const i18n = new VueI18n({
  locale: defaultLang, // 设置语言环境
  fallbackLocale: defaultLang,
  messages // 设置语言环境信息
})

const loadedLanguages = [defaultLang]  // 我们的预装默认语言

/**
 * 切换语言
 * @param lang
 * @returns {*}
 */
export function switchLanguage (lang) {
  // 同步切换 vuex，ls, html 标识的语言，防止异常
  store.commit('SET_LANG', lang)
  Vue.ls.set(APP_LANGUAGE, lang)
  document.querySelector('html').setAttribute('lang', lang)
  // 异步切换 i18n 的语言，方便做到懒加载
  setI18nLanguageAsync(lang)
  return lang
}

/**
 * 切换 vue-i18n.locale，如果语言文件未加载，则异步加载后切换
 * @param lang
 */
function setI18nLanguageAsync (lang) {
  // 如果语言相同
  if (i18n.locale === lang) {
    return
  }

  // 如果语言已经加载
  if (loadedLanguages.includes(lang)) {
    i18n.locale = lang
  }

  // 如果尚未加载语言
  import(/* webpackChunkName: "lang-[request]" */ `./lang/${lang}.js`).then(
    messages => {
      i18n.setLocaleMessage(lang, messages.default)
      loadedLanguages.push(lang)
      i18n.locale = lang
    }
  )
}
