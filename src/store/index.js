import Vue from 'vue'
import Vuex from 'vuex'

import app from './modules/app'
import user from './modules/user'
import i18n from './modules/i18n'
import userRouter from './modules/user-router'
import getters from './getters'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    app,
    user,
    i18n,
    userRouter
  },
  state: {

  },
  mutations: {

  },
  actions: {

  },
  getters
})
