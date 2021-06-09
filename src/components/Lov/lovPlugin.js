import Lov from '@/components/Lov/Lov'
import LovLocal from '@/components/Lov/LovLocal'
export default {
  install: function (Vue) {
    Vue.component('Lov', Lov)
    Vue.component('LovLocal', LovLocal)
  }
}
