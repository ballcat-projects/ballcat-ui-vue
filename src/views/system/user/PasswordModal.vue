<template>
  <a-modal
    title="修改密码"
    :visible="visible"
    :confirm-loading="confirmLoading"
    :mask-closable="false"
    @ok="handleOk"
    @cancel="handleClose"
  >
    <a-spin :spinning="confirmLoading">
      <a-form :form="form" :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-form-item label="用户名">
          <a-input
            v-decorator="['username']"
            disabled
            placeholder="用户名"
          />
        </a-form-item>

        <a-form-item label="新密码" has-feedback>
          <a-input
            v-decorator="[ 'pass', decoratorOptions.pass]"
            type="password"
            placeholder="新密码"
            @blur="validateConfirmOnBlur"
          />
        </a-form-item>

        <a-form-item label="确认密码" has-feedback>
          <a-input
            v-decorator="['confirmPass', decoratorOptions.confirmPass]"
            type="password"
            placeholder="确认密码"
          />
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
import { passEncrypt } from '@/utils/password'
import { changePassword } from '@/api/system/user'
import { doRequest } from '@/utils/request'
import { delObj } from '@/api/system/role'

export default {
  name: 'PasswordModal',
  data () {
    return {
      visible: false,
      confirmLoading: false,
      form: this.$form.createForm(this),
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 }
      },

      userId: '',
      confirmDirty: false,
      decoratorOptions: {
        pass: {
          rules: [{
            required: true,
            pattern: /^(?=.*\d)(?=.*[a-zA-Z]).{6,12}$/,
            message: '密码必须包含数字和字母组合(可使用特殊符号)，长度为6-12位！'
          }]
        },
        confirmPass: {
          rules: [{
            required: true, message: '请确认登陆密码!'
          }, {
            validator: this.validateConfirm
          }]
        }
      }
    }
  },
  methods: {
    show (record) {
      this.visible = true

      this.userId = record.userId
      this.form.resetFields()

      this.$nextTick(() => {
        this.form.setFieldsValue({ username: record.username })
      })
    },
    handleOk () {
      // 触发表单验证
      this.form.validateFields({force: true}, (err, values) => {
        if (!err) {
          this.confirmLoading = true
          delete values.username

          values.pass = passEncrypt(values.pass)
          values.confirmPass = passEncrypt(values.confirmPass)

          doRequest(changePassword(this.userId, values), {
            onFinally: () => {
              this.handleClose()
            }
          })
        }
      })
    },
    handleClose (e) {
      this.visible = false
      this.confirmLoading = false
    },
    validateConfirmOnBlur (){
      this.form.validateFields(['confirmPass'], {force: true})
    },
    validateConfirm (rule, confirm, callback) {
      const pass = this.form.getFieldValue('pass')
      if (pass && confirm && pass !== confirm) {
        callback('两次输入的密码不一致！')
      }
      callback()
    }
  }
}
</script>
