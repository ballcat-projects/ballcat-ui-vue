<template>
  <a-form @submit="handleSubmit" :form="form" :labelCol=labelCol :wrapperCol=wrapperCol>
    <a-form-item label="用户名">
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
    >
      <a-input
        type="password"
        v-decorator="['pass', decoratorOptions.pass]"
        placeholder="密码"/>
    </a-form-item>

    <a-form-item label="昵称">
      <a-input
        v-decorator="['nickname', decoratorOptions.nickname]"
        placeholder="昵称"/>
    </a-form-item>

    <a-form-item label="组织部门">
      <a-tree-select
        v-decorator="['organizationId']"
        placeholder="父级组织"
        style="width: 100%"
        :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
        :tree-data="organizationTree"
        tree-default-expand-all
        allow-clear
        :replaceFields="{
            title: 'name',
            key: 'id',
            value: 'id'
          }"
      >
      </a-tree-select>
    </a-form-item>

    <a-form-item label="邮箱">
      <a-input
        v-decorator="['email', decoratorOptions.nickname]"
        placeholder="邮箱"/>
    </a-form-item>

    <a-form-item label="电话">
      <a-input
        v-decorator="['phone', decoratorOptions.nickname]"
        placeholder="电话"/>
    </a-form-item>

    <a-form-item label="性别">
      <dict-select v-decorator="['sex', decoratorOptions.sex]"
                   dict-code="gender">
      </dict-select>
    </a-form-item>



    <a-form-item label="状态">
      <a-radio-group v-decorator="['status', decoratorOptions.status]">
        <a-radio :value="1">开启</a-radio>
        <a-radio :value="0">锁定</a-radio>
      </a-radio-group>
    </a-form-item>

    <a-form-item
      :wrapperCol="{offset: 7 }"
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
  sex: 1,
  status: 1
}

export default {
  name: 'FormPage',
  mixins: [FormPageMixin],
  components: { ScopeModal, AFormItem },
  props: {
    organizationTree: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data () {
    return {
      reqFunctions: {
        create: addObj,
        update: putObj
      },

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
      }
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
