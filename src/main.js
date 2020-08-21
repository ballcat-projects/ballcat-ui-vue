import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store/'
import { VueAxios } from './utils/request'

// mock
// import './mock'

import bootstrap from './core/bootstrap'
import './core/use'
import './permission' // permission control
import './utils/filter' // global filter
import i18n from './locales'

Vue.config.productionTip = false

// mount axios Vue.$http and this.$http
Vue.use(VueAxios)


// ballcat 引入常量
import sysConst  from './ballcat/sys_const'
Vue.prototype.FORM_ACTION = sysConst.FORM_ACTION;
// 文件相对路径转绝对路径
Vue.prototype.fileAbsoluteUrl = function (relativeUrl) {
  if (relativeUrl) {
    return 'https://hccake-img.oss-cn-shanghai.aliyuncs.com/' + relativeUrl
  }
};


// 字典注册
import DictPlugin  from '@/components/dict/dictPlugin'
Vue.use(DictPlugin)
// lov注册
import LovPlugin from '@/components/lov/lovPlugin'
Vue.use(LovPlugin)

new Vue({
  router,
  store,
  i18n,
  created: bootstrap,
  render: h => h(App)
}).$mount('#app')
