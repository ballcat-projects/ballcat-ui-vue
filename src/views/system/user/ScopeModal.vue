<template>
  <a-modal
    title="授权"
    :visible="visible"
    :confirm-loading="confirmLoading"
    @ok="handleOk"
    @cancel="handleClose"
  >
    <a-spin :spinning="confirmLoading">
      <a-form :form="form" :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-form-item label="用户名">
          <a-input v-model="username" disabled placeholder="用户名" />
        </a-form-item>
        <a-form-item label="角色">
          <sys-role-select v-model="roleCodes" placeholder="无角色" />
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>
<script>
import { getUserScope, putUserScope } from '@/api/system/user'
import SysRoleSelect from '@/views/system/role/SysRoleSelect'
import { doRequest } from '@/utils/request'
import { delObj } from '@/api/system/role'

export default {
  name: 'ScopeModal',
  components: { SysRoleSelect },
  data () {
    return {
      visible: false,
      confirmLoading: true,
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
      username: '',
      roleCodes: []
    }
  },
  methods: {
    show (record) {
      this.visible = true
      this.confirmLoading = true

      this.userId = record.userId
      this.username = record.username
      this.roleCodes = []

      getUserScope(record.userId)
        .then(res => {
          if (res.data.roleCodes) {
            this.roleCodes = res.data.roleCodes.map(String)
            this.confirmLoading = false
          }
        })
    },
    handleOk (e) {
      this.confirmLoading = true
      const userScope = {
        roleCodes: this.roleCodes
      }
      doRequest(putUserScope(this.userId, userScope), {
        onSuccess: () => {
          this.handleClose()
        },
        onFinally: () => {
          this.confirmLoading = false
        }
      })
    },
    handleClose (e) {
      this.visible = false
      this.confirmLoading = false
    }
  }
}
</script>
