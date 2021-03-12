import FormMixin from './formMixin'

export default {
  mixins: [FormMixin],
  data () {
    return {
      // 标题
      title: '',
    }
  },
  methods: {
    add (options) {
      this.title = options.title
      this.buildCreatedForm(options)
    },
    update (record, options) {
      this.title = options.title
      this.buildUpdatedForm(record, options)
    },
    submitSuccess (res){
      this.backToPage(true);
    },
    backToPage (needRefresh) {
      this.$emit('back-to-page', needRefresh)
    }
  }
}
