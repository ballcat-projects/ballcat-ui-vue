<template>
  <a-modal
    :title="title"
    :visible="visible"
    :mask-closable="false"
    :body-style="{paddingBottom: '8px'}"
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
          <a-form-item v-if="formAction === FORM_ACTION.UPDATE" style="display: none">
            <a-input v-decorator="['userId']" />
          </a-form-item>

          <a-form-item label="用户名">
            <a-input
              v-decorator="['username', decoratorOptions.username]"
              placeholder="用户名"
            />
          </a-form-item>

          <a-form-item label="昵称">
            <a-input
              v-decorator="['nickname', decoratorOptions.nickname]"
              placeholder="昵称"
            />
          </a-form-item>

          <a-form-item label="组织">
            <a-tree-select
              v-decorator="['organizationId']"
              placeholder="父级组织"
              style="width: 100%"
              :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
              :tree-data="organizationTree"
              tree-default-expand-all
              allow-clear
              :replace-fields="{
                title: 'name',
                key: 'id',
                value: 'id'
              }"
            />
          </a-form-item>

          <a-form-item label="状态">
            <a-radio-group v-decorator="['status', decoratorOptions.status]">
              <a-radio :value="1">开启</a-radio>
              <a-radio :value="0">锁定</a-radio>
            </a-radio-group>
          </a-form-item>
        </a-col>

        <a-col :xs="24" :sm="24" :md="12">
          <a-form-item
            v-if="formAction === FORM_ACTION.CREATE"
            label="密码"
          >
            <a-input-password
              v-decorator="['pass', decoratorOptions.pass]"
              placeholder="密码"
            />
          </a-form-item>

          <a-form-item label="性别">
            <dict-select
              v-decorator="['sex', decoratorOptions.sex]"
              dict-code="gender"
            />
          </a-form-item>

          <a-form-item label="电话">
            <a-input
              v-decorator="['phone']"
              placeholder="电话"
            />
          </a-form-item>

          <a-form-item label="邮箱">
            <a-input
              v-decorator="['email']"
              placeholder="邮箱"
            />
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
  </a-modal>
</template>

<script>
import { addObj, putObj } from '@/api/sys/sysuser'
import { PopUpFormMixin } from '@/mixins'
import { passEncrypt } from '@/utils/password'

export default {
  name: 'SysUserModalForm',
  mixins: [PopUpFormMixin],
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
        }
      }
    }
  },
  methods: {
    // 密码加密提交
    submitDataProcess (data) {
      data.pass = passEncrypt(data.pass)
      return data
    }
  }
}
</script>
