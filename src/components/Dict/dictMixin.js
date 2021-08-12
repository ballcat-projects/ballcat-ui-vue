import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'DictMixin',
  props: {
    dictCode: {
      type: String,
      required: true
    },
    itemFilter: {  // 用于过滤出指定的字典项
      type: Function,
      default: null
    },
    itemIsDisabled: { // 给字典项添加是否禁用的属性
      type: Function,
      default: null
    }

  },
  computed: {
    ...mapGetters(['lang', 'dictDataCache']),
    dictData () {
      let dictData = this.dictDataCache[this.dictCode]
      if (!dictData) {
        this.fillDictCache([this.dictCode]).finally()
      }
      // 如果没有数据，返回空对象
      return dictData || {}
    },
    dictItems () {
      // 如果没有数据，返回空数组
      let dictItems = []
      // 处理数据
      if (this.dictData && this.dictData.dictItems) {
        let originDictItems = this.dictData.dictItems

        for (let item of originDictItems){
          // 过滤字典项
          if (this.itemFilter && !this.itemFilter(item)) {
            continue
          }
          // 字典项是否 disable
          item.disabled = this.itemIsDisabled && this.itemIsDisabled(item)
          // 选择名称，国际化处理
          item.name = this.i18nName(item)

          // 添加字典项
          dictItems.push(item)
        }
      }
      return dictItems
    }
  },
  created () {
    if (!this.dictDataCache[this.dictCode]) {
      this.fillDictCache([this.dictCode]).finally()
    }
  },
  methods: {
    ...mapActions(['fillDictCache']),
    /**
     * 处理字典项数据
     * @param dictItem
     * @returns {*}
     */
    i18nName (dictItem) {
      let name = dictItem.name
      // 配置了国际化信息时，进行国际化处理
      const languages = dictItem.attributes.languages
      if (languages && languages[this.lang]) {
        name = languages[this.lang]
      }
      return name
    }
  }
}
