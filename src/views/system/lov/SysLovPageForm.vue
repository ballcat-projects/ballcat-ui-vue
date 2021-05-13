<template>
  <div>
    <!-- 页头 -->
    <a-page-header
      :ghost="false"
      :title="title"
    >
      该组件主要用于多条件查询的数据录入
    </a-page-header>

    <!-- 表单 -->
    <a-spin :spinning="submitLoading" size="large" class="ant-pro-page-container-children-content">
      <a-form :form="form" class="form" @submit="handleSubmit">
        <form-basic :form="form" :is-update-form="isUpdateForm" />
        <form-body
          ref="formBody"
          v-model="bodyList"
          :form="form"
          :form-action="formAction"
        />
        <form-search v-model="searchList" :form="form" :form-action="formAction" />
        <a-divider>查看生成的lov</a-divider>
        <lov
          ref="lov_pre"
          v-model="lovVal"
          :source-lov="sourceLov"
          :lazy="true"
          style="margin-bottom: 56px;"
          keyword="local_preview"
          @preview="previewParent"
        />
      </a-form>
    </a-spin>

    <!-- fixed footer toolbar -->
    <footer-tool-bar>
      <div class="table-operator" style="text-align: center;">
        <!-- <a-button :loading="submitLoading" @click="preview">预览</a-button> -->
        <a-button
          style="margin-left: 8px"
          type="primary"
          :loading="submitLoading"
          @click="handleSubmit"
        >提交</a-button>
        <a-button style="margin-left: 8px" @click="lovCancel(false)">取消</a-button>
      </div>
    </footer-tool-bar>
  </div>
</template>

<script>
import { PageFormMixin } from '@/mixins'
import { create, getData, update } from '@/api/system/lov'
import FormBasic from '@/views/system/lov/FormBasic'
import FormBody from '@/views/system/lov/FormBody'
import FormSearch from '@/views/system/lov/FormSearch'
import FooterToolBar from '@/components/FooterToolbar'
import { mapActions } from 'vuex'

export default {
  name: 'SysLovFormPage',
  components: { FormBasic, FormBody, FormSearch, FooterToolBar },
  mixins: [PageFormMixin],
  data () {
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
      lovVal: undefined,
      sourceLov:1,
      previewLov:true
    }
  },
  methods: {
    ...mapActions(['setLovPreview', 'delLovPreview']),
    previewParent(){
       if(this.previewLov){
          this.previewLov=false
          const pre = this.$refs.lov_pre
          this.form.validateFields((err) => {
              if (err) {
                pre.cleanAll()
                this.$message.error(`您有${Object.keys(err).length}个内容未通过校验!请检查并修改后重新预览!`)
                this.submitLoading = false
                pre.visible=false
                this.previewLov=true
              }else{   
                this.preview();
                setTimeout(()=>{pre.reloadTable();pre.visible=true;this.previewLov=true},200)
              }
          })
       }
    },
    preview () {
      this.submitLoading = true
      // 表单校验，成功则进行预览
      this.form.validateFields((err, values) => {
        if (!err) {
          const pre = this.$refs.lov_pre
          this.delLovPreview()
          this.setLovPreview({
            ...values,
            bodyList: this.bodyList,
            searchList: this.searchList
          });
          (!pre.backVal || !pre.backVal.length) && (pre.cleanAll())
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
        this.$refs.formBody.reset(res.data.bodyList);
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
      this.delLovPreview()
      this.backToPage(true)
    },
    lovCancel(){
       this.$refs.lov_pre.cleanAll()
       this.backToPage(false)
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
