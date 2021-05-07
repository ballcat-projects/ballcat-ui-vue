// 字典相关组件
import DictSlot from '@/components/Dict/DictSlot'
import DictRadioGroup from '@/components/Dict/DictRadioGroup'
import DictSelect from '@/components/Dict/DictSelect'
import DictText from '@/components/Dict/DictText'
import DictCheckBoxGroup from '@/components/Dict/DictCheckBoxGroup'

export default {
  install: function (Vue) {
    // 字典组件
    Vue.component('DictCheckBoxGroup', DictCheckBoxGroup)
    Vue.component('DictRadioGroup', DictRadioGroup)
    Vue.component('DictSelect', DictSelect)
    Vue.component('DictSlot', DictSlot)
    Vue.component('DictText', DictText)
  }
}
