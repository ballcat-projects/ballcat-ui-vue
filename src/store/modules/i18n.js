import { defaultLanguage } from '@/config/projectConfig'

const i18n = {
  state: {
    lang: defaultLanguage
  },
  mutations: {
    SET_LANG: (state, lang) => {
      state.lang = lang
    }
  },
  getters: {
    lang: state => state.lang
  }
}

export default i18n
