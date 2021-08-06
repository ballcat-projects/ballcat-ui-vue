import { mapState, mapActions } from 'vuex'

export default {
  name: 'DictItemMixin',
  props: {
    dictCode: {
      type: String,
      required: true
    }
  },
  computed: {
    ...mapState({
      dictDataCache: state => state.dict.dictDataCache,
      lang: state => state.i18n.lang
    }),
    dictItems () {
      let dictData = this.dictDataCache[this.dictCode]
      if (!dictData) {
        this.fillDictCache([this.dictCode]).finally()
      }

      let dictItems = [];
      if(dictData){
        // 配置了国际化信息时，进行国际化处理
        dictItems =  dictData.map(dictItem => {
          const languages = dictItem.attributes.languages
          if (languages && languages[this.lang]) {
            dictItem.name = languages[this.lang]
          }
          return dictItem
        })
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
    getValByItem (dictItem) {
      let res = dictItem.value
      // 如果没有type， 按number 处理
      let valueType = dictItem.valueType || 1
      if (valueType === 1) {
        res = Number(dictItem.value)         // 数字
      } else if (valueType === 2) {
        res = String(dictItem.value)         // 字符串
      } else if (valueType === 3) {
        res = Boolean(dictItem.value)        // 布尔
      }
      return res
    }
  }
}
