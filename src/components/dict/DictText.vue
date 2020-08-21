<template>
  <span>{{ dictItem ? dictItem.name : value }}</span>
</template>
<script>
export default {
  name: 'DictText',
  props: {
    value: [Number, String],
    dictCode: String,
    color: String
  },
  data () {
    return {
      dictItem: null
    }
  },
  watch: {
    value (val) {
      this.changeShow(val)
    }
  },
  created () {
    this.changeShow(this.value)
  },
  methods: {
    changeShow(val){
      let dictData = this.DictPool.dictDataCache[this.dictCode]
      if (dictData) {
        this.dictItem = dictData.find(dictItem => this.getValByItem(dictItem) === val)
      }
    },
    getValByItem (dict) {
      let res = String(dict.value)
      if (dict.valueType) {
        if (dict.valueType === 1) {
          // 数字
          res = Number(dict.value)
        } else if (dict.valueType === 2) {
          // 字符串
          res = String(dict.value)
        } else if (dict.valueType === 3) {
          // 布尔
          res = Boolean(dict.value)
        }
      }
      // 如果没有type， 按 String 处理
      return res
    }
  }
}
</script>
