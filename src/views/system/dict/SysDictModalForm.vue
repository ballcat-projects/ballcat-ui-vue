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
      <a-form-item v-if="isUpdateForm" style="display: none">
        <a-input v-decorator="['id']" />
      </a-form-item>

      <a-form-item label="标识">
        <a-input
          v-decorator="['code', decoratorOptions.code]"
          placeholder="字典标识"
          :disabled="isUpdateForm"
        />
      </a-form-item>

      <a-form-item label="名称">
        <a-input v-decorator="['title', decoratorOptions.title]" placeholder="字典名称" />
      </a-form-item>

      <a-form-item label="数据类型">
        <dict-radio-group
          v-decorator="['valueType',decoratorOptions.valueType]"
          placeholder="数据类型"
          dict-code="dict_value_type"
        />
      </a-form-item>

      <a-form-item label="状态">
        <a-radio-group v-decorator="['status', decoratorOptions.status]">
          <a-radio :value="1"> 启用 </a-radio>
          <a-radio :value="0"> 禁用 </a-radio>
        </a-radio-group>
      </a-form-item>

      <a-form-item label="备注">
        <a-textarea
          v-decorator="['remarks']"
          placeholder="备注"
          :auto-size="{ minRows: 3, maxRows: 5 }"
        />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script>
import { PopUpFormMixin } from '@/mixins'
import { addObj, putObj } from '@/api/system/dict'

export default {
  name: 'SysDictModalForm',
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
      decoratorOptions: {
        code: {
          rules: [{ required: true, message: '请输入字典标识!' }]
        },
        title: {
          rules: [{ required: true, message: '请输入字典名称!' }]
        },
        valueType: {
          rules: [{ required: true, message: '请选择数据类型!' }],
          initialValue: 1
        },
        status: {
          rules: [{ required: true, message: '请选择状态!' }],
          initialValue: 1
        }
      }
    }
  },
  methods: {}
}
</script>

