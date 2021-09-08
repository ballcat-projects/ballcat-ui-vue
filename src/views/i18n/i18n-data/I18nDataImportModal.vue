<template>
  <a-modal
    :title="title"
    :visible="visible"
    :mask-closable="false"
    :body-style="{ paddingBottom: '8px' }"
    :confirm-loading="submitLoading"
    @ok="handleSubmit"
    @cancel="handleClose"
  >
    <a-form-model ref="form" :model="formData" :rules="rules">
      <a-form-model-item prop="fileList">
        <a-upload
          accept=".xls,.xlsx"
          :file-list="formData.fileList"
          :remove="handleRemove"
          :before-upload="beforeUpload"
        >
          <a-button>
            <icon-font type="upload" />
            {{ $t('action.selectFile') }}
          </a-button>
          <a href="javascript:" style="margin-left: 12px;" @click.stop="downloadTemplate">
            {{ $t('import.downloadTemplate') }}
          </a>
        </a-upload>
      </a-form-model-item>

      <a-form-model-item :label="$t('import.whenDataExisting')" prop="existingAction">
        <a-radio-group v-model="formData.importMode">
          <a-radio value="SKIP_EXISTING">
            {{ $t('import.skipExisting') }}
          </a-radio>
          <a-radio value="OVERWRITE_EXISTING">
            {{ $t('import.overwriteExisting') }}
          </a-radio>
        </a-radio-group>
      </a-form-model-item>
    </a-form-model>
  </a-modal>
</template>

<script>
import { importExcel, downloadTemplate } from '@/api/i18n/i18n-data'
import { remoteFileDownload } from '@/utils/fileUtil'

export default {
  name: 'I18nDataImportModal',
  data() {
    return {
      visible: false,
      submitLoading: false,

      value: 1,
      formData: this.defaultFormData()
    }
  },
  computed: {
    // 标题
    title() {
      return this.$t('import.batchImport') + '：' + this.$t('i18n.i18nData.text')
    },
    rules() {
      return {
        fileList: [{ type: 'array', required: true, len: 1, message: this.$t('message.pleaseSelectFile') }]
      }
    }
  },
  methods: {
    defaultFormData() {
      return {
        fileList: [],
        importMode: 'SKIP_EXISTING'
      }
    },
    show() {
      this.visible = true
      this.submitLoading = false
    },
    handleClose() {
      this.visible = false
      this.submitLoading = false
    },
    beforeUpload(file) {
      this.formData.fileList = [file]
      return false
    },
    handleRemove() {
      this.formData.fileList = []
    },
    downloadTemplate() {
      downloadTemplate().then(response => {
        remoteFileDownload(response)
      })
    },
    handleSubmit() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          this.submitLoading = true

          // 构造 multipartFormData
          const formData = new FormData()
          formData.append('file', this.formData.fileList[0])
          formData.append('importMode', this.formData.importMode)

          importExcel(formData)
            .then(res => {
              this.$message.success(this.$t('import.importSuccess'))
              this.$emit('reload-page-table', false)
              this.formData = this.defaultFormData()
              this.handleClose()
            })
            .finally(() => {
              this.submitLoading = false
            })
        }
      })
    }
  }
}
</script>

<style scoped></style>
