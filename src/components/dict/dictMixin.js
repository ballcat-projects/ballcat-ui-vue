export default {
  name: 'DictMixin',
  props: {
    value: [String, Number, Boolean],
    dictCode: String,
    disabled: Boolean
  },
  data () {
    return {
      dictItems: {},
      selectedValue: this.value
    }
  },
  watch: {
    value () {
      this.selectedValue = this.value
    }
  },
  created () {
    this.DictPool.getDictItems(this.dictCode).then(dictItems => {
      this.dictItems = dictItems
    })
  },
  methods: {
    handleChange (val) {
      if (val.target) {
        this.selectedValue = val.target.value
      } else {
        this.selectedValue = val
      }
      // v-decorator 方式的表单值联动
      this.$emit('change', this.selectedValue)
      // v-model 方式的表单值联动
      this.$emit('input', this.selectedValue)
    },
    getValByItem (dict) {
      let res = Number(dict.value)
      if (dict.type) {
        if (dict.type === 1) {
          // 数字
          res = Number(dict.value)
        } else if (dict.type === 2) {
          // 字符串
          res = String(dict.value)
        } else if (dict.type === 3) {
          // 布尔
          res = Boolean(dict.value)
        }
      }
      // 如果没有type， 按number 处理
      return res
    }
  }
}
