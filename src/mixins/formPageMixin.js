import FormMixin from './formMixin'

export default {
  mixins: [FormMixin],
  data () {
    return {
      // 标签和数值框布局
      labelCol: {
        xs: { span: 24 },
        sm: { span: 7 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 10 }
      },
    }
  },
  methods: {
    add (argument) {
      this.buildCreatedForm(argument)
    },
    update (record, argument) {
      this.buildUpdatedForm(record, argument)
    },
    submitSuccess (res){
      this.backToPage(true);
    },
    backToPage (needRefresh) {
      this.$emit('backToPage', needRefresh)
    }
  }
}
