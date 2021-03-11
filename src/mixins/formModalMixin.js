import FormMixin from './formMixin'

export default {
  mixins: [FormMixin],
  data () {
    return {
      title: null,
      visible: false,
      labelCol: {
        sm: { span: 24 },
        md: { span: 7 }
      },
      wrapperCol: {
        sm: { span: 24 },
        md: { span: 17 }
      },
    }
  },
  methods: {
    show(modalOption) {
      this.title = modalOption.title
      this.visible = true
      this.submitLoading = false
    },
    add(modalOption) {
      this.buildCreatedForm()
      this.show(modalOption)
    },
    update(record, modalOption) {
      this.buildUpdatedForm(record)
      this.show(modalOption)
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
