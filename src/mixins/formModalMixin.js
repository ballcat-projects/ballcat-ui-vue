import FormMixin from './formMixin'

export default {
  mixins: [FormMixin],
  data () {
    return {
      visible: false,
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 }
      },
    }
  },
  methods: {
    show() {
      this.visible = true
      this.submitLoading = false
    },
    add() {
      this.buildCreatedForm()
      this.show()
    },
    update(record) {
      this.buildUpdatedForm(record)
      this.show()
    },
    submitSuccess (res){
      this.$emit('reloadPageTable', false)
      this.handleClose()
    },
    handleClose(e) {
      this.visible = false
      this.submitLoading = false
    }
  }
}
