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


function setI18nLanguage (lang) {
  store.commit('SET_LANG', lang)
  Vue.ls.set(APP_LANGUAGE, lang)
  i18n.locale = lang
  document.querySelector('html').setAttribute('lang', lang)
  return lang
}

export function loadLanguageAsync (lang) {
  // 如果语言相同
  if (i18n.locale === lang) {
    return Promise.resolve(setI18nLanguage(lang))
  }

  // 如果语言已经加载
  if (loadedLanguages.includes(lang)) {
    return Promise.resolve(setI18nLanguage(lang))
  }

  // 如果尚未加载语言
  return import(/* webpackChunkName: "lang-[request]" */ `./lang/${lang}.js`).then(
    messages => {
      i18n.setLocaleMessage(lang, messages.default)
      loadedLanguages.push(lang)
      return setI18nLanguage(lang)
    }
  )
}
