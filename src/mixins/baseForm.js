import pick from 'lodash.pick'

export default {
  data () {
    return {
      form: this.$form.createForm(this),

      formAction: this.FORM_ACTION.NONE,
      labelCol: { lg: { span: 3 }, sm: { span: 3 } },
      wrapperCol: { lg: { span: 8 }, sm: { span: 19 } },
      decoratorOptions: {},
      displayData: {
        createTime: '',
        updateTime: ''
      },
      // 提交按钮防止重复提交
      submitLoading: false,

      addObj: function () {},
      putObj: function () {}
    }
  },
  methods: {
    add () {
      this.formAction = this.FORM_ACTION.ADD
      // 钩子函数 处理某些页面定制需求
      if(this.beforeStartAdd instanceof Function){
        this.beforeStartAdd()
      }
      this.form.resetFields()
    },
    update (record) {
      this.formAction = this.FORM_ACTION.UPDATE
      // 钩子函数 处理某些页面打开update页面时的定制需求
      if(this.beforeStartUpdate instanceof Function){
        this.beforeStartUpdate(record)
      }
      // 延迟加载 必面隐藏展示元素时出现的bug
      setTimeout(() => {
        // 获取仅展示元素
        this.displayData = pick(record, Object.keys(this.displayData))
        // 移除所有不用的元素，否则会抛出异常
        const fromData = pick(record, Object.keys(this.form.getFieldsValue()))
        this.$nextTick(function () {
          this.form.resetFields()
          this.form.setFieldsValue(fromData)
        })
      }, 0)
    },
    handleSubmit (e) {
      // 钩子函数 处理某些页面打开update页面时的定制需求
      if(this.beforeSubmit instanceof Function){
        this.beforeSubmit()
      }
      const req = this.formAction === this.FORM_ACTION.ADD ? this.addObj : this.putObj
      e.preventDefault()
      this.form.validateFields((err, values) => {
        if (!err) {
          this.submitLoading = true

          req(values).then(res => {
            this.$message.success(res.msg)
            this.backToPage(true)
          })
          .finally(() => {
            this.submitLoading = false
          });
        }
      })
    },
    backToPage (needRefresh) {
      this.$emit('backToPage', needRefresh)
    }
  }
}