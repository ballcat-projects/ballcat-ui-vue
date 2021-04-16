import Vue from 'vue'
import Vuex from 'vuex'

// https://webpack.js.org/guides/dependency-management/#requirecontext
const modulesFiles = require.context('./modules', true, /\.js$/)

// you do not need `import app from './modules/app'`
// it will auto require all vuex module from modules file
const modules = {}
modulesFiles.keys().forEach(key => {
  let moduleName = key.replace(/(\.\/|\.js)/g, '');
  modules[moduleName] = modulesFiles(key).default
})

Vue.use(Vuex)

export default new Vuex.Store({
  modules: modules
})
