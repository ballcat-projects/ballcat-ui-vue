<template>
    <a-form @submit="handleSubmit" :form="form">
      <a-form-item v-if="formAction === this.FORM_ACTION.UPDATE" style="display: none">
        <a-input v-decorator="['id']"/>
      </a-form-item>
      <a-form-item
        label="角色名"
        :labelCol=labelCol
        :wrapperCol=wrapperCol>
        <a-input
          v-decorator="['name', decoratorOptions.name]"
          placeholder="角色名"/>
      </a-form-item>
      <a-form-item
        :labelCol=labelCol
        :wrapperCol=wrapperCol
        >
        <span slot="label">
        角色标识
        <a-tooltip title="注意！角色标识必须以ROLE_开头">
          <a-icon type="question-circle-o" />
        </a-tooltip>
      </span>
        <a-input
          :disabled="formAction === this.FORM_ACTION.UPDATE"
          v-decorator="['code', decoratorOptions.code]"
          placeholder="权限标识"/>
      </a-form-item>
      <a-form-item
        label="备注"
        :labelCol=labelCol
        :wrapperCol=wrapperCol>
        <a-textarea
          :autosize="{ minRows: 4, maxRows: 8 }"
          v-decorator="['note']"
          placeholder="备注信息"/>
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
import { addObj, putObj } from '@/api/sys/role'

export default {
  name: 'FormPage',
  components: {AFormItem },
  mixins: [FormMixin],
  data () {
    return {
      addObj: addObj,
      putObj: putObj,

      decoratorOptions: {
        name: {
          rules: [{ required: true, message: '请输入角色名!' }]
        },
        code: {
          rules: [{ required: true, message: '请输入角色标识!' }
            ,{ validator: this.validateCode }
          ]
        }
      },
    }
  },
  methods: {
    validateCode (rule, value, callback) {
      if (value.indexOf("ROLE_") !== 0) {
        callback('角色标识必须以ROLE_开头！')
      }
      callback()
    }
  }
}
</script>


