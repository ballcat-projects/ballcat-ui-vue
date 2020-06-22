<template>
    <a-form @submit="handleSubmit" :form="form">
      <a-form-item
        label="用户名"
        :labelCol=labelCol
        :wrapperCol=wrapperCol>
        <a-input
          v-decorator="['username', decoratorOptions.username]"
          placeholder="用户名"/>
      </a-form-item>
      <a-form-item v-if="formAction === this.FORM_ACTION.UPDATE" style="display: none">
        <a-input v-decorator="['userId']"/>
      </a-form-item>
      <a-form-item
        v-if="formAction === this.FORM_ACTION.CREATE"
        label="密码"
        :labelCol=labelCol
        :wrapperCol=wrapperCol
        >
        <a-input
          type="password"
          v-decorator="['pass', decoratorOptions.pass]"
          placeholder="密码"/>
      </a-form-item>
      <a-form-item label="昵称" :labelCol=labelCol :wrapperCol=wrapperCol>
        <a-input
          v-decorator="['nickname', decoratorOptions.nickname]"
          placeholder="昵称"/>
      </a-form-item>
      <a-form-item
        label="邮箱"
        :labelCol=labelCol
        :wrapperCol=wrapperCol>
        <a-input
          v-decorator="['email', decoratorOptions.nickname]"
          placeholder="邮箱"/>
      </a-form-item>
      <a-form-item
        label="电话"
        :labelCol=labelCol
        :wrapperCol=wrapperCol>
        <a-input
          v-decorator="['phone', decoratorOptions.nickname]"
          placeholder="电话"/>
      </a-form-item>
      <a-form-item
        label="性别"
        :labelCol=labelCol
        :wrapperCol=wrapperCol>
        <a-select
          v-decorator="['sex', decoratorOptions.sex]">
          <a-select-option :value="0">请选择</a-select-option>
          <a-select-option :value="1">男</a-select-option>
          <a-select-option :value="2">女</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item
        label="状态"
        :labelCol=labelCol
        :wrapperCol=wrapperCol>
        <a-radio-group  v-decorator="['status', decoratorOptions.status]">
          <a-radio :value="1">开启</a-radio>
          <a-radio :value="0">锁定</a-radio>
        </a-radio-group>
      </a-form-item>
      <div v-show="formAction === this.FORM_ACTION.UPDATE">
        <a-form-item
          label="创建时间"
          :labelCol=labelCol
          :wrapperCol=wrapperCol>
          <span>{{ displayData.createTime }}</span>
        </a-form-item>
        <a-form-item
          label="修改时间"
          :labelCol=labelCol
          :wrapperCol=wrapperCol>
          <span>{{ displayData.updateTime }}</span>
        </a-form-item>
      </div>
      <a-form-item
        :wrapperCol="{offset: 3 }"
      >
        <a-button htmlType="submit" type="primary" :loading="submitLoading">提交</a-button>
        <a-button style="margin-left: 8px" @click="backToPage(false)">取消</a-button>
      </a-form-item>

    </a-form>


</template>

<script>
import AFormItem from 'ant-design-vue/es/form/FormItem'
import { addObj, putObj } from '@/api/sys/sysuser'
import ScopeModal from './ScopeModal'
import { FormPageMixin } from '@/mixins'
import { encryption } from '@/utils/password'

const defaultValue = {
  sex: 0,
  status: 1
}

export default {
  name: 'FormPage',
  mixins: [FormPageMixin],
  components: { ScopeModal, AFormItem },
  data () {
    return {
      addObj: addObj,
      putObj: putObj,

      decoratorOptions: {
        username: {
          rules: [{ required: true, message: '请输入用户名!' }]
        },
        pass: {
          rules: [{ required: true, message: '请输入密码!' }]
        },
        nickname: {
          rules: [{ required: true, message: '请输入昵称!' }]
        },
        sex: {
          initialValue: defaultValue.sex
        },
        status: {
          initialValue: defaultValue.status
        }
      },
    }
  },
  methods: {
    // 密码加密提交
    submitDataProcess (data) {
      data.pass = encryption(data.pass)
      return data
    }
  }
}
</script>