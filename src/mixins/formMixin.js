import pick from 'lodash.pick'
import { doRequest } from '@/utils/request'
import { delObj } from '@/api/system/role'

// 表单行为类型，标识当前表单是用来新建的还是更新的
const FORM_ACTION = {
  NONE: 'none',
  CREATE: 'create',
  UPDATE: 'update'
}

export default {
  data () {
    return {
      // 当前表单对象
      form: this.$form.createForm(this),

      // v-decorator 属性
      decoratorOptions: {},

      // 只显示的表单数据
      displayData: {
        createTime: '',
        updateTime: ''
      },

      // 提交按钮防止重复提交
      submitLoading: false,

      // 表单行为
      formAction: FORM_ACTION.NONE,
      // 请求方法，属性key为表单行为，value为对应请求方法（返回值为一个promise对象）
      reqFunctions: {
        create: function () {
        },
        update: function () {
        }
      }
    }
  },
  computed: {
    isCreateForm(){
      return this.formAction === FORM_ACTION.CREATE
    },
    isUpdateForm(){
      return this.formAction === FORM_ACTION.UPDATE
    }
  },
  methods: {
    /**
     * 构建新建型表单
     * @param attributes 额外参数，用于透传到表单构建完成的回调函数中
     */
    buildCreatedForm (attributes) {
      this.form.resetFields()
      this.formAction = FORM_ACTION.CREATE
      // 钩子函数 处理某些页面定制需求
      this.createdFormCallback(attributes)
    },

    /**
     * 构建新建型表单成功后的回调方法
     * 默认无行为，组件可复写此方法 完成添加之前的事件
     */
    /*eslint-disable*/
    createdFormCallback (attributes) {
    },

    /**
     * 表单数据回填
     * @param data 回填数据
     * @param needReset 回填前是否清空现有数据，默认不请空，增量回填
     */
    fillFormData: function (data, needReset = false) {
      // 延迟加载 避免隐藏展示元素时出现的bug
      setTimeout(() => {
        // 获取仅展示元素
        this.displayData = pick(data, Object.keys(this.displayData))
        // 移除所有不用的元素，否则会抛出异常
        const fromData = pick(data, Object.keys(this.form.getFieldsValue()))
        this.$nextTick(function () {
          needReset && this.form.resetFields()
          this.form.setFieldsValue(fromData)
        })
      }, 0)
    },

    /**
     * 构建 => 修改型表单
     * @param record 回显数据
     * @param options 额外参数，用于透传到表单构建完成的回调函数中
     */
    buildUpdatedForm (record, options) {
      let that = this
      that.formAction = FORM_ACTION.UPDATE
      that.echoDataProcess(record)
      this.fillFormData(record, true)
      this.updatedFormCallback(options)
    },

    /**
     * 钩子函数，回显数据处理
     * 默认无操作，子组件可重写此方法，拿到回显数据，对回显数据做处理，或者从回显数据中取值
     * @param data 回显数据
     */
    /*eslint-disable*/
    echoDataProcess (data) {
    },

    /*eslint-disable*/
    updatedFormCallback (options) {
      // 组件复写此方法 完成修改之后的事件
    },

    /**
     * 表单提交处理函数
     * @param e event
     */
    handleSubmit (e) {
      // 阻止 submit 事件的默认行为
      e && e.preventDefault()
      // 根据表单行为，获取对应的请求方法
      const reqFunction = this.reqFunctions[this.formAction]
      // 表单提交前事件，返回 false 时停止提交
      if (this.beforeStartSubmit() === false) {
        return
      }
      // 表单校验，成功则进行提交
      this.form.validateFields((err, values) => {
        if (!err) {
          this.submitLoading = true
          doRequest(reqFunction(this.submitDataProcess(values)), {
            onSuccess: (res) => {
              this.submitSuccess(res)
            },
            onFail: (res) => {
              this.submitError(res)
            },
            onFinally: () => {
              this.submitLoading = false
            }
          })
        }
      })
    },

    /**
     * 表单准备提交前的回调函数
     */
    beforeStartSubmit () {
    },

    /**
     * 表单提交数据处理函数
     * 子组件可复写此方法，在这里进行偷梁换柱
     * @param data 表单待提交数据
     * @returns {*} 真正的提交数据
     */
    submitDataProcess (data) {
      // 在此处理表单提交的数据
      return data
    },

    /**
     * 表单提交成功回调函数
     * 子组件可复写进行扩展
     * @param res 服务端返回值
     */
    /*eslint-disable*/
    submitSuccess (res) {
      // 提交表单成功的回调函数
    },

    /**
     * 表单提交失败的回调函数
     * 子组件可复写进行扩展
     * @param res 服务端返回值
     */
    submitError (res) {
    }
  }
}
