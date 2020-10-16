<template>
  <a-form @submit="handleSubmit" :form="form" :labelCol="labelCol" :wrapperCol="wrapperCol">
    <a-form-item v-if="formAction === this.FORM_ACTION.UPDATE" style="display: none">
      <a-input v-decorator="['id']"/>
    </a-form-item>

    <a-form-item label="标识">
      <a-input
        placeholder="字典标识"
        :disabled="formAction === this.FORM_ACTION.UPDATE"
        v-decorator="['code']"
      />
    </a-form-item>

    <a-form-item label="名称">
      <a-input placeholder="字典名称" v-decorator="['title']"/>
    </a-form-item>

    <a-form-item label="字典类型">
      <dict-radio-group
        placeholder="字典类型"
        v-decorator="['editable',decoratorOptions.editable]"
        dict-code="dict_property"
      />
    </a-form-item>

    <a-form-item label="数据类型">
      <dict-radio-group
        placeholder="数据类型"
        v-decorator="['valueType',decoratorOptions.valueType]"
        dict-code="dict_value_type"
      />
    </a-form-item>

    <a-form-item label="备注">
      <a-textarea
        placeholder="备注"
        v-decorator="['remarks']"
        :autoSize="{ minRows: 3, maxRows: 5 }"
      />
    </a-form-item>

    <div v-show="formAction === this.FORM_ACTION.UPDATE">
      <a-form-item label="创建时间">
        <span>{{ displayData.createTime }}</span>
      </a-form-item>
      <a-form-item label="修改时间">
        <span>{{ displayData.updateTime }}</span>
      </a-form-item>
    </div>
    <a-form-item :wrapperCol="{offset: 7}">
      <a-button htmlType="submit" type="primary" :loading="submitLoading">提交</a-button>
      <a-button style="margin-left: 8px" @click="backToPage(false)">取消</a-button>
    </a-form-item>
  </a-form>
</template>

<script>
import { FormPageMixin } from '@/mixins'
import AFormItem from 'ant-design-vue/es/form/FormItem'
import { addObj, putObj } from '@/api/sys/sysdict'

export default {
  name: 'SysDictFormPage',
  components: { AFormItem },
  mixins: [FormPageMixin],
  data () {
    return {
      reqFunctions: {
        create: addObj,
        update: putObj
      },

      // 校验配置
      decoratorOptions: {
        editable: {
          initialValue: 1
        },
        valueType: {
          initialValue: 1
        }
      }
    }
  },
  methods: {}
}
</script>

