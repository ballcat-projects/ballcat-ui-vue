export default {
  name: 'DictMixin',
  props: {
    value: [String, Number],
    dictCode: String,
    disabled: Boolean,
  },
  data() {
    return {
      dictList: {},
      selectedValue: this.value
    }
  },
  watch: {
    value() {
      this.selectedValue = this.value
    }
  },
  created() {
    this.DictPool.getDictList(this.dictCode).then(dictList => {
      this.dictList = dictList
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
