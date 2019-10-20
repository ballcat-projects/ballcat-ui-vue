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


new Vue({
  router,
  store,
  i18n,
  created: bootstrap,
  render: h => h(App)
}).$mount('#app')
