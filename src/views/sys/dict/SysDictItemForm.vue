<template>
  <a-form @submit="handleSubmit" :form="form">

    <a-form-item v-if="formAction === this.FORM_ACTION.UPDATE" style="display: none">
      <a-input v-decorator="['id']"/>
    </a-form-item>

    <a-form-item label="字典标识"
                 :labelCol=labelCol
                 :wrapperCol=wrapperCol>
      <a-input placeholder="字典标识"
               :disabled=true
               v-decorator="['dictCode']"/>
    </a-form-item>

    <a-form-item label="标签"
                 :labelCol=labelCol
                 :wrapperCol=wrapperCol>
      <a-input placeholder="标签"
               v-decorator="['label']"/>
    </a-form-item>

    <a-form-item label="数据值"
                 :labelCol=labelCol
                 :wrapperCol=wrapperCol>
      <a-input placeholder="数据值"
               v-decorator="['value']"/>
    </a-form-item>

    <a-form-item :labelCol=labelCol
                 :wrapperCol=wrapperCol>
       <span slot="label">
        排序
        <a-tooltip title="升序，数值越小优先级越高">
          <a-icon type="exclamation-circle"/>
        </a-tooltip>
      </span>
      <a-input-number placeholder="排序（升序）"
                      v-decorator="['sort', {initialValue: 1}]"
                      :min=0
                      style="width: 70%"/>
    </a-form-item>

    <a-form-item label="备注"
                 :labelCol=labelCol
                 :wrapperCol=wrapperCol>
      <a-textarea placeholder="备注"
                  v-decorator="['remarks']"
                  :autoSize="{ minRows: 3, maxRows: 5 }"/>
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
import { FormMixin } from '@/mixins'
import AFormItem from 'ant-design-vue/es/form/FormItem'
import { addObj, putObj } from '@/api/sys/sysdictitem'
import { getDictSelectData } from '../../../api/sys/sysdict'

export default {
  name: 'SysDictItemFormPage',
  components: { AFormItem },
  mixins: [FormMixin],
  data () {
    return {
      addObj: addObj,
      putObj: putObj,

      // 校验配置
      decoratorOptions: {}
    }
  },
  methods: {
    beforeStartAdd (argument) {
        this.form.setFieldsValue({dictCode: argument})
    }
  }
}
</script>


