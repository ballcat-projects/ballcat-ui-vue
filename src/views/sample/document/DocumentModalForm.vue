<template>
  <a-modal
    :title="title"
    :visible="visible"
    :mask-closable="false"
    :body-style="{paddingBottom: '8px'}"
    :confirm-loading="submitLoading"
    @ok="handleSubmit"
    @cancel="handleClose"
  >
    <a-form
      :form="form"
      :label-col="labelCol"
      :wrapper-col="wrapperCol"
    >
      <a-form-item v-if="isUpdateForm" style="display: none">
        <a-input v-decorator="['id']" />
      </a-form-item>
      <a-form-item label="文档名称">
        <a-input v-decorator="['name', { rules: [{ required: true, message: '请输入文档名称!' }] }]" placeholder="文档名称" />
      </a-form-item>
      <a-form-item label="所属用户">
        <lov-local
          v-decorator="['userId', { rules: [{ required: true, message: '请选择所属用户!' }] }]"
          placeholder="所属用户"
          v-bind="sysUserLov"
          :multiple="false"
        />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script>
import { PopUpFormMixin } from '@/mixins'
import { addObj, putObj } from '@/api/sample/document'
import { sysUserLov } from '@/components/Lov/lovOptions'

export default {
  name: 'DocumentModalForm',
  mixins: [PopUpFormMixin],
  data () {
    return {
      reqFunctions: {
        create: addObj,
        update: putObj
      },

      labelCol: {
        sm: { span: 24 },
        md: { span: 5 }
      },
      wrapperCol: {
        sm: { span: 24 },
        md: { span: 19 }
      },

      // 校验配置
      decoratorOptions: {},

      // 系统用户Lov
      sysUserLov
    }
  },
  methods: {}
}
</script>
