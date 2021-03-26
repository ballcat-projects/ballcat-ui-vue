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
    <a-form :form="form" :label-col="labelCol" :wrapper-col="wrapperCol">
      <a-form-item v-if="formAction === FORM_ACTION.UPDATE" style="display: none">
        <a-input v-decorator="['id']" />
      </a-form-item>

      <a-form-item label="配置名称">
        <a-input v-decorator="['name']" placeholder="配置名称" />
      </a-form-item>

      <a-form-item label="配置键">
        <a-input v-decorator="['confKey']" placeholder="配置键" />
      </a-form-item>

      <a-form-item label="配置值">
        <a-input v-decorator="['confValue']" placeholder="配置值" />
      </a-form-item>

      <a-form-item label="分类">
        <a-input v-decorator="['category']" placeholder="分类" />
      </a-form-item>

      <a-form-item label="备注">
        <a-textarea v-decorator="['description']" placeholder="备注" />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script>
import { PopUpFormMixin } from '@/mixins'
import { addObj, putObj } from '@/api/sys/sysconfig'

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
        md: { span: 5 }
      },
      wrapperCol: {
        sm: { span: 24 },
        md: { span: 19 }
      },

      // 校验配置
      decoratorOptions: {}
    }
  },
  methods: {}
}
</script>


