<template>
  <a-form @submit="handleSubmit" :form="form" :labelCol=labelCol :wrapperCol=wrapperCol>
    <a-form-item v-if="formAction === this.FORM_ACTION.UPDATE" style="display: none">
      <a-input v-decorator="['id']"/>
    </a-form-item>

    <a-form-item label="配置名称">
      <a-input placeholder="配置名称" v-decorator="['name']"/>
    </a-form-item>

    <a-form-item label="配置键">
      <a-input placeholder="配置键" v-decorator="['confKey']"/>
    </a-form-item>

    <a-form-item label="配置值">
      <a-input placeholder="配置值" v-decorator="['confValue']"/>
    </a-form-item>

    <a-form-item label="分类">
      <a-input placeholder="分类" v-decorator="['category']"/>
    </a-form-item>

    <a-form-item label="备注">
      <a-textarea placeholder="备注" v-decorator="['description']"/>
    </a-form-item>

    <div v-show="formAction === this.FORM_ACTION.UPDATE">
      <a-form-item label="创建时间">
        <span>{{ displayData.createTime }}</span>
      </a-form-item>
      <a-form-item label="修改时间">
        <span>{{ displayData.updateTime }}</span>
      </a-form-item>
    </div>
    <a-form-item :wrapperCol="{offset: 7 }">
      <a-button htmlType="submit" type="primary" :loading="submitLoading">提交</a-button>
      <a-button style="margin-left: 8px" @click="backToPage(false)">取消</a-button>
    </a-form-item>
  </a-form>
</template>

<script>
import { FormPageMixin } from '@/mixins'
import AFormItem from 'ant-design-vue/es/form/FormItem'
import { addObj, putObj } from '@/api/sys/sysconfig'

export default {
  name: 'SysConfigFormPage',
  components: { AFormItem },
  mixins: [FormPageMixin],
  data () {
    return {
      reqFunctions: {
        create: addObj,
        update: putObj
      },

      // 校验配置
      decoratorOptions: {}
    }
  },
  methods: {}
}
</script>


