/**
 * Vue i18n loader
 * created by @musnow
 * https://github.com/musnow
 */
import Vue from 'vue'
import VueI18n from 'vue-i18n'
import store from '@/store'
import { APP_LANGUAGE } from '@/store/storage-types'
import { enableI18n } from '@/config/projectConfig'
// import { defaultLanguage } from '@/config/projectConfig'

// 已经加载的语言列表
const loadedLanguages = []

// 当找不到对应语言的配置时，是否需要回退
const fallbackLocale = false

let vueI18n = {}
if (enableI18n) {
  // 加载 vueI18n
  Vue.use(VueI18n)
  vueI18n = new VueI18n({
    locale: 'unKnow', // 设置语言环境，这里故意给定 unKnow，方便切换
    fallbackLocale: fallbackLocale,
    messages: {} // 设置语言环境信息
  })
}

// 这里没有加载语言，语言加载交由 bootstrap.js 中处理，这样避免默认语言和设置语言不一样时，依然要先加载默认语言的问题
export const i18n = vueI18n

// 当需要回退语言时，则需要预先加载默认语言的配置
if (fallbackLocale !== false) {
  loadLanguageProperties(fallbackLocale)
}

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
  loadLanguageProperties(lang)
}

/**
 * 加载语言配置文件
 * @param lang
 */
function loadLanguageProperties (lang) {
  import(/* webpackChunkName: "lang-[request]" */ `./lang/${lang}.js`).then(
    messages => {
      i18n.setLocaleMessage(lang, messages.default)
      loadedLanguages.push(lang)
      i18n.locale = lang
    }
  )
}
