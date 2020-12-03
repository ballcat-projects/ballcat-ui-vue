<template>
  <a-spin :spinning="submitLoading" size="large">
    <a-form @submit="handleSubmit" :form="form" class="form">
      <formBasic :form="form" :formAction="formAction" />
      <formBody v-model="bodyList" :form="form" :formAction="formAction" />
      <formSearch v-model="searchList" :form="form" :formAction="formAction" />

      <div class="table-operator" style="text-align: center;">
        <a-button :loading="submitLoading" @click="preview">预览</a-button>
        <a-divider type="vertical"/>
        <a-button style="margin-left: 8px" htmlType="submit" type="primary" :loading="submitLoading">提交</a-button>
        <a-button @click="backToPage(false)">取消</a-button>
      </div>

      <a-divider>单击预览按钮后，下方会生成预览的lov组件,修改配置后需要重新单击预览更新数据</a-divider>
      <lov :lazy="true" style="margin-bottom: 56px;" ref="lov_pre" keyword="lov_pre" v-model="lovVal"/>
    </a-form>
  </a-spin>
</template>

<script>
import { FormPageMixin } from '@/mixins'
import { create, getData, update } from '@/api/sys/lov'
import { mixin, mixinDevice } from '@/utils/mixin'
import formBasic from '@/views/sys/lov/formBasic'
import formBody from '@/views/sys/lov/formBody'
import formSearch from '@/views/sys/lov/formSearch'
import Vue from 'vue'

export default {
  name: 'SysLovFormPage',
  mixins: [mixin, mixinDevice, FormPageMixin],
  components: { formBasic, formBody, formSearch },
  data() {
    return {
      dictCodes: ['lov_http_method', 'tf', 'lov_http_params_position', 'lov_ret_data_type', 'lov_search_tag'],
      reqFunctions: {
        create: create,
        update: update
      },
      // 校验配置
      decoratorOptions: {},
      bodyList: [],
      searchList: [],
      lovVal: undefined
    }
  },
  methods: {
    preview () {
      this.submitLoading = true
      // 表单校验，成功则进行预览
      this.form.validateFields((err, values) => {
        if (!err) {
          const pre = this.$refs.lov_pre
          Vue.ls.set(pre.getCacheKey(), JSON.stringify({ ...values, bodyList: this.bodyList, searchList: this.searchList }))
          pre.cleanAll()
          pre.load()
        } else {
          this.$message.error(`您有${Object.keys(err).length}个内容未通过校验!请检查并修改后重新预览!`)
        }
        this.submitLoading = false
      })
    },
    echoDataProcess (data) {
      this.submitLoading = true
      getData(data.keyword).then(res => {
        this.bodyList = res.data.bodyList
        this.searchList = res.data.searchList
        this.submitLoading = false
      })
    },
    submitDataProcess (data) {
      if (!data.keyword) {
        data.keyword = new Date().getTime()
      }
      data.bodyList = this.bodyList
      data.searchList = this.searchList
      return data
    },
    // 提交成功
    submitSuccess (res) {
      // 更新成功、删除缓存
      Vue.ls.remove(this.$refs.lov_pre.getCacheKeyByKeyword(this.form.getFieldValue('keyword')))
      this.backToPage(true)
    }
  }
}
</script>
<style lang="less" scoped>
.ant-form-item {
  margin-bottom: 0;
}

.validator-error {
  .ant-input-wrapper, .ant-input-group {
    input, input:hover, input:focus {
      border-color: red;
      z-index: 1;
    }
  }
}
</style>
