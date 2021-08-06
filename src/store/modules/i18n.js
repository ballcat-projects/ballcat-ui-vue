const i18n = {
  state: {
    lang: 'zh-CN'
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
