export default {
  name: 'DictMixin',
  props: {
    value: [String, Number],
    dictCode: String,
    disabled: Boolean,
  },
  data() {
    return {
      dictItems: {},
      selectedValue: this.value
    }
  },
  watch: {
    value() {
      this.selectedValue = this.value
    }
  },
  created() {
    this.DictPool.getDictItems(this.dictCode).then(dictItems => {
      this.dictItems = dictItems
    })
  },
  methods: {
    handleChange(val) {
      if (val.target) {
        this.selectedValue = val.target.value
      } else {
        this.selectedValue = val
      }
      // v-decorator 方式的表单值联动
      this.$emit('change', this.selectedValue)
      // v-model 方式的表单值联动
      this.$emit('input', this.selectedValue)
    }
  }
}
