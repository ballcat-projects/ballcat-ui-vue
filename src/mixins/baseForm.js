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

      addObj: function () {
      },
      putObj: function () {
      }
    }
  },
  methods: {
    add () {
      this.formAction = this.FORM_ACTION.ADD
      // 钩子函数 处理某些页面定制需求
      this.beforeStartAdd()
      this.form.resetFields()
    },
    beforeStartAdd () {
      // 组件复写此方法 完成添加之前的事件
    },
    update (record) {
      this.formAction = this.FORM_ACTION.UPDATE
      // 钩子函数 处理某些页面打开update页面时的定制需求
      this.beforeStartUpdate(record)
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
    beforeStartUpdate (record) {
      // 组件复写此方法 完成修改之前的事件
    },
    beforeStartSubmit (record) {
      // 组件复写此方法 提交之前处理的事件
    },
    submitDataProcess (data) {
      // 在此处理表单提交的数据
      return data
    },
    handleSubmit (e) {
      // 钩子函数 处理提交之前处理的事件
      this.beforeStartSubmit()
      const req = this.formAction === this.FORM_ACTION.ADD ? this.addObj : this.putObj
      e.preventDefault()
      this.form.validateFields((err, values) => {
        if (!err) {
          this.submitLoading = true
          req(this.submitDataProcess(values)).then(res => {
            this.$message.success(res.msg)
            this.backToPage(true)
          })
            .finally(() => {
              this.submitLoading = false
            })
        }
      })
    },
    backToPage (needRefresh) {
      this.$emit('backToPage', needRefresh)
    }
  }
}