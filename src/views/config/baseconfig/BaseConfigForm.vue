<template>
  <a-form @submit="handleSubmit" :form="form">

    <a-form-item v-if="formAction === this.FORM_ACTION.UPDATE" style="display: none">
      <a-input v-decorator="['id']"/>
    </a-form-item>

    <a-form-item label="配置名称"
                 :labelCol=labelCol
                 :wrapperCol=wrapperCol>
      <a-input placeholder="配置名称"
               v-decorator="['name']"/>
    </a-form-item>

    <a-form-item label="配置在缓存中的key名"
                 :labelCol=labelCol
                 :wrapperCol=wrapperCol>
      <a-input placeholder="配置在缓存中的key名"
               v-decorator="['confKey']"/>
    </a-form-item>

    <a-form-item label="配置值"
                 :labelCol=labelCol
                 :wrapperCol=wrapperCol>
      <a-input placeholder="配置值"
               v-decorator="['confValue']"/>
    </a-form-item>

    <a-form-item label="组"
                 :labelCol=labelCol
                 :wrapperCol=wrapperCol>
      <a-input placeholder="组"
               v-decorator="['groups']"/>
    </a-form-item>

    <a-form-item label="备注"
                 :labelCol=labelCol
                 :wrapperCol=wrapperCol>
      <a-textarea placeholder="备注"
               v-decorator="['description']"/>
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
import { addObj, putObj } from '@/api/config/baseconfig'

export default {
  name: 'BaseConfigFormPage',
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
  methods: {}
}
</script>


