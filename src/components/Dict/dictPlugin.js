// 字典相关组件
import DictTag from '@/components/Dict/display/DictTag'
import DictText from '@/components/Dict/display/DictText'
import DictBadge from '@/components/Dict/display/DictBadge'

import DictRadioGroup from '@/components/Dict/group/DictRadioGroup'
import DictSelect from '@/components/Dict/group/DictSelect'
import DictCheckBoxGroup from '@/components/Dict/group/DictCheckBoxGroup'

export default {
  install: function (Vue) {
    // 字典组件
    Vue.component('DictCheckBoxGroup', DictCheckBoxGroup)
    Vue.component('DictRadioGroup', DictRadioGroup)
    Vue.component('DictSelect', DictSelect)
    Vue.component('DictTag', DictTag)
    Vue.component('DictText', DictText)
    Vue.component('DictBadge', DictBadge)
  }
}
