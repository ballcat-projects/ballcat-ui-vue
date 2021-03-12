import FormMixin from './formMixin'

export default {
  mixins: [FormMixin],
  data () {
    return {
      // 标题
      title: '',
      visible: false
    }
  },
  methods: {
    show(options) {
      this.title = options.title
      this.visible = true
      this.submitLoading = false
    },
    add(options) {
      this.buildCreatedForm()
      this.show(options)
    },
    update(record, options) {
      this.buildUpdatedForm(record)
      this.show(options)
    },
    submitSuccess (res){
      this.$emit('reload-page-table', false)
      this.handleClose()
    },
    handleClose(e) {
      this.visible = false
      this.submitLoading = false
    }
  }
}
