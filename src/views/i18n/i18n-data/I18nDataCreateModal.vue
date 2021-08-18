<template>
  <a-modal
    :title="title"
    :visible="visible"
    :mask-closable="false"
    :body-style="{paddingBottom: '8px'}"
    :confirm-loading="submitLoading"
    :width="600"
    @ok="handleSubmit"
    @cancel="handleClose"
  >
    <a-form
      :form="form"
      :label-col="labelCol"
      :wrapper-col="wrapperCol"
    >
      <a-form-item :label="$t('i18n.i18nData.code')">
        <a-input
          v-decorator="['code', decoratorOptions.code]"
          :placeholder="$t('i18n.i18nData.code.tips')"
          :disabled="isUpdateForm"
        />
      </a-form-item>

      <a-form-item label="语言文本">
        <language-text ref="languageText" />
      </a-form-item>

      <a-form-item :label="$t('common.remark')">
        <a-textarea v-decorator="['remark']" :placeholder="$t('message.pleaseEnter')" />
      </a-form-item>

    </a-form>
  </a-modal>
</template>

<script>
import { PopUpFormMixin } from '@/mixins'
import { addObj, putObj } from '@/api/i18n/i18n-data'
import LanguageText from '@/views/i18n/LanguageText'

export default {
  name: 'I18nDataCreateModal',
  components: { LanguageText },
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
        languageTag: {
          rules: [{ required: true, message: this.$t('i18n.i18nData.languageTag.tips') }]
        },
        code: {
          rules: [{ required: true, message: this.$t('i18n.i18nData.code.tips') }]
        },
        message: {
          rules: [{ required: true, message: this.$t('i18n.i18nData.message.tips') }]
        }
      }
    }
  },
  methods: {
    createdFormCallback (attributes) {
      this.$nextTick(() => {
        this.$refs.languageText.resetData()
      })
    },
    /**
     * 表单提交数据处理函数
     * 子组件可复写此方法，在这里进行偷梁换柱
     * @param data 表单待提交数据
     * @returns {*} 真正的提交数据
     */
    submitDataProcess (data) {
      // 在此处理表单提交的数据
      data.languageTexts = this.$refs.languageText.data()
      return data
    },
  }
}
</script>

