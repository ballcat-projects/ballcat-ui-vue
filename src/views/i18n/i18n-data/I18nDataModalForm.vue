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
    <a-form
      :form="form"
      :label-col="labelCol"
      :wrapper-col="wrapperCol"
    >
      <a-form-item v-if="isUpdateForm" style="display: none">
        <a-input v-decorator="['id']" />
      </a-form-item>
      <a-form-item :label="$t('i18n.i18nData.languageTag')">
        <a-input v-decorator="['languageTag', decoratorOptions.languageTag]" :placeholder="$t('i18n.i18nData.languageTag.tips')" />
      </a-form-item>
      <a-form-item :label="$t('i18n.i18nData.code')">
        <a-input v-decorator="['code', decoratorOptions.code]" :placeholder="$t('i18n.i18nData.code.tips')" />
      </a-form-item>
      <a-form-item :label="$t('i18n.i18nData.message')">
        <a-input v-decorator="['message', decoratorOptions.message]" :placeholder="$t('i18n.i18nData.message.tips')" />
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

export default {
  name: 'I18nDataModalForm',
  mixins: [PopUpFormMixin],
  data () {
    return {
      reqFunctions: {
        create: addObj,
        update: putObj
      },

      labelCol: {
        sm: { span: 24 },
        md: { span: 6 }
      },
      wrapperCol: {
        sm: { span: 24 },
        md: { span: 17 }
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
        },
      }
    }
  },
  methods: {}
}
</script>
