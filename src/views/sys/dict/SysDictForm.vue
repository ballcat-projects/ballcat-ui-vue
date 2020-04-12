<template>
  <a-form @submit="handleSubmit" :form="form">

    <a-form-item v-if="formAction === this.FORM_ACTION.UPDATE" style="display: none">
      <a-input v-decorator="['id']"/>
    </a-form-item>

    <a-form-item label="标识"
                 :labelCol=labelCol
                 :wrapperCol=wrapperCol>
      <a-input placeholder="字典标识"
               :disabled="formAction === this.FORM_ACTION.UPDATE"
               v-decorator="['code']"/>
    </a-form-item>

    <a-form-item label="名称"
                 :labelCol=labelCol
                 :wrapperCol=wrapperCol>
      <a-input placeholder="字典名称"
               v-decorator="['name']"/>
    </a-form-item>

    <a-form-item label="字典类型"
                 :labelCol=labelCol
                 :wrapperCol=wrapperCol>
      <a-select placeholder="字典类型"
                v-decorator="['type']">
        <a-select-option v-for="item in dictTypeSelectData"
                         :key="Number(item.value)">
          {{item.name}}
        </a-select-option>
      </a-select>
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
import { FormPageMixin } from '@/mixins'
import AFormItem from 'ant-design-vue/es/form/FormItem'
import { addObj, putObj } from '@/api/sys/sysdict'

export default {
  name: 'SysDictFormPage',
  components: { AFormItem },
  mixins: [FormPageMixin],
  props: ['dictTypeSelectData'],
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


