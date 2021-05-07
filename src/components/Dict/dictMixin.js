export default {
  name: 'DictMixin',
  props: {
    // eslint-disable-next-line vue/require-default-prop
    value: {
      type: [String, Number, Boolean, Array]
    },
    dictCode: {
      type: String,
      required: true
    },
    disabled: {
      type: Boolean,
      default: false
    },
  },
  data () {
    return {
      selectedValue: this.getValByType(this.value)
    }
  },
  watch: {
    value () {
      this.selectedValue = this.getValByType(this.value)
    }
  },
  created () {
  },
  methods: {
    handleChange (val) {
      if (val && val.target) {
        this.selectedValue = val.target.value
      } else {
        this.selectedValue = val
      }
      // v-decorator 方式的表单值联动
      this.$emit('change', this.selectedValue)
      // v-model 方式的表单值联动
      this.$emit('input', this.selectedValue)
    },
    getValByType (val) {
      if(val instanceof Array){
        return val
      }
      // 获取字典项
      if (this.dictItems && this.dictItems.length > 0) {
        // 默认数值类型
        const valueType = this.dictItems[0].valueType
        if (val == null) {
          return
        }
        if (valueType === 1) {
          // 数字
          return Number(val)
        } else if (valueType === 2) {
          // 字符串
          return String(val)
        } else if (valueType === 3) {
          // 布尔
          return Boolean(val)
        }
      }
      return val
    }
  }
}
