import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store/'
// mock
// import './mock'

import bootstrap from './core/bootstrap'
import './core/use'
import './permission' // permission control
import './utils/filter' // global filter
import i18n from './locales'

// 文件相对路径转绝对路径
Vue.prototype.fileAbsoluteUrl = function (relativeUrl) {
  if (relativeUrl) {
    return 'https://hccake-img.oss-cn-shanghai.aliyuncs.com/' + relativeUrl
  }
}

// 字典注册
import DictPlugin from '@/components/Dict/dictPlugin'

Vue.use(DictPlugin)
// lov注册
import LovPlugin from '@/components/Lov/lovPlugin'

Vue.use(LovPlugin)

Vue.config.productionTip = false

new Vue({
  beforeCreate () {
    // 全局事件总线
    Vue.prototype.$bus = this
  },
  router,
  store,
  i18n,
  created: bootstrap,
  render: h => h(App)
}).$mount('#app')
