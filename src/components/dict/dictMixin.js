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
      this.selectedValue = val
      // v-decorator 方式的表单值联动
      this.$emit('change', val)
      // v-model 方式的表单值联动
      this.$emit('input', val)
    }
  }
}
