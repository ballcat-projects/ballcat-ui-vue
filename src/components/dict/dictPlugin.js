// 缓存池
import DictPool from '@/components/dict/dictPool'

// 字典相关组件
import DictSlot from '@/components/dict/DictSlot'
import DictRadioGroup from '@/components/dict/DictRadioGroup'
import DictSelect from '@/components/dict/DictSelect'

export default {
  install: function(Vue) {
    // 字典池挂载到Vue原型，方便全局公用，当作二级缓存
    Vue.prototype.DictPool = DictPool
    // 字典组件
    Vue.component('DictRadioGroup', DictRadioGroup)
    Vue.component('DictSelect', DictSelect)
    Vue.component('DictSlot', DictSlot)
  }
}