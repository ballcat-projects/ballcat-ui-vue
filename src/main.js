import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store/'
// mock
// import './mock'
import { enableI18n, defaultLanguage } from '@/config/projectConfig'

import bootstrap from './core/bootstrap'
import './core/use'
import './permission' // permission control
import './utils/filter' // global filter

// 文件相对路径转绝对路径
Vue.prototype.fileAbsoluteUrl = function(relativeUrl) {
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

let vm = {
  beforeCreate() {
    // 全局事件总线
    Vue.prototype.$bus = this
  },
  router,
  store,
  created: bootstrap,
  render: h => h(App)
}

// 按需加载国际化
if (enableI18n) {
  import(/* webpackChunkName: "lang-[request]" */ '@/locales').then(res => {
    vm.i18n = res.i18n
    new Vue(vm).$mount('#app')
  })
} else {
  const antLocaleName = defaultLanguage.replace('-', '_')
  import(`ant-design-vue/es/locale-provider/${antLocaleName}`).then(res => {
    // 挂载到原型上，方便获取
    Vue.prototype.$defaultAntLocale = res.default
    new Vue(vm).$mount('#app')
  })
}
