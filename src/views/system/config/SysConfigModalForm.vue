<template>
  <a-modal
    :title="title"
    :visible="visible"
    :mask-closable="false"
    :body-style="{paddingBottom: '8px'}"
    :confirm-loading="submitLoading"
    :width="400"
    @ok="handleSubmit"
    @cancel="handleClose"
  >
    <a-form :form="form" :label-col="labelCol" :wrapper-col="wrapperCol">
      <a-form-item label="名称">
        <a-input v-decorator="['name', decoratorOptions.name]" placeholder="请输入" />
      </a-form-item>

      <a-form-item label="Key">
        <a-input v-decorator="['confKey', decoratorOptions.confKey]" :disabled="isUpdateForm" placeholder="请输入" />
      </a-form-item>

      <a-form-item label="Value">
        <a-input v-decorator="['confValue', decoratorOptions.confValue]" placeholder="请输入" />
      </a-form-item>

      <a-form-item label="分类">
        <a-input v-decorator="['category']" placeholder="请输入" />
      </a-form-item>

      <a-form-item label="备注">
        <a-textarea v-decorator="['description']" rows="3" placeholder="请输入" />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script>
import { PopUpFormMixin } from '@/mixins'
import { addObj, putObj } from '@/api/system/config'

export default {
  name: 'SysConfigModalForm',
  mixins: [PopUpFormMixin],
  data () {
    return {
      reqFunctions: {
        create: addObj,
        update: putObj
      },

      labelCol: {
        sm: { span: 24 },
        md: { span: 4 }
      },
      wrapperCol: {
        sm: { span: 24 },
        md: { span: 19 }
      },

      // 校验配置
      decoratorOptions: {
        name: {
          rules: [{ required: true, message: '请输入配置名称!' }]
        },
        confKey: {
          rules: [{ required: true, message: '请输入 Key!' }]
        },
        confValue: {
          rules: [{ required: true, message: '请输入 Value!' }]
        }
      }
    }
  },
  methods: {}
}
</script>


