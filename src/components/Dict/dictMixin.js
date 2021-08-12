import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'DictMixin',
  props: {
    dictCode: {
      type: String,
      required: true
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
        dictItems = this.dictData.dictItems.map(dictItem => this.processItemData(dictItem))
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
    processItemData(dictItem){
      // 配置了国际化信息时，进行国际化处理
      const languages = dictItem.attributes.languages
      if (languages && languages[this.lang]) {
        dictItem.name = languages[this.lang]
      }
      return dictItem
    },
  }
}
