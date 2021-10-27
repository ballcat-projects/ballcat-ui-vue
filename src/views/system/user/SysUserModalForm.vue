<template>
  <a-modal
    :title="title"
    :visible="visible"
    :mask-closable="false"
    :body-style="{ paddingBottom: '8px' }"
    :confirm-loading="submitLoading"
    :width="650"
    @ok="handleSubmit"
    @cancel="handleClose"
  >
    <a-form
      :form="form"
      :label-col="labelCol"
      :wrapper-col="wrapperCol"
      @submit="handleSubmit"
    >
      <a-row>
        <a-col :xs="24" :sm="24" :md="12">
          <a-form-item v-if="isUpdateForm" style="display: none">
            <a-input v-decorator="['userId']" />
          </a-form-item>

          <a-form-item label="用户名">
            <a-input v-decorator="['username', decoratorOptions.username]" placeholder="请输入" />
          </a-form-item>

          <a-form-item v-if="isCreateForm" label="密码">
            <a-input-password v-decorator="['pass', decoratorOptions.pass]" placeholder="请输入" />
          </a-form-item>

          <a-form-item label="昵称">
            <a-input v-decorator="['nickname', decoratorOptions.nickname]" placeholder="请输入" />
          </a-form-item>

          <a-form-item label="组织">
            <sys-organization-tree-select v-decorator="['organizationId']" :organization-tree="organizationTree" />
          </a-form-item>

          <a-form-item label="状态">
            <dict-radio-group v-decorator="['status', decoratorOptions.status]" type="button" dict-code="user_status" />
          </a-form-item>
        </a-col>

        <a-col :xs="24" :sm="24" :md="12">
          <a-form-item label="性别">
            <dict-select v-decorator="['sex', decoratorOptions.sex]" dict-code="gender" />
          </a-form-item>

          <a-form-item label="电话">
            <a-input v-decorator="['phone']" placeholder="请输入" />
          </a-form-item>

          <a-form-item label="邮箱">
            <a-input v-decorator="['email']" placeholder="请输入" />
          </a-form-item>

          <a-form-item v-if="isCreateForm" label="角色">
            <sys-role-select v-decorator="['roleCodes', decoratorOptions.roleCodes]" placeholder="请选择" />
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
  </a-modal>
</template>

<script>
import { addObj, putObj } from '@/api/system/user'
import { PopUpFormMixin } from '@/mixins'
import { passEncrypt } from '@/utils/password'
import SysRoleSelect from '@/views/system/role/SysRoleSelect'
import SysOrganizationTreeSelect from '@/views/system/organization/SysOrganizationTreeSelect'

export default {
  name: 'SysUserModalForm',
  components: { SysOrganizationTreeSelect, SysRoleSelect },
  mixins: [PopUpFormMixin],
  props: {
    organizationTree: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data() {
    return {
      reqFunctions: {
        create: addObj,
        update: putObj
      },

      labelCol: {
        sm: { span: 24 },
        md: { span: 6 }
      },
      wrapperCol: {
        sm: { span: 24 },
        md: { span: 18 }
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
          initialValue: 1
        },
        status: {
          initialValue: 1
        },
        roleCodes: {
          initialValue: []
        }
      }
    }
  },
  methods: {
    // 密码加密提交
    submitDataProcess(data) {
      data.pass = passEncrypt(data.pass)
      return data
    }
  }
}
</script>
