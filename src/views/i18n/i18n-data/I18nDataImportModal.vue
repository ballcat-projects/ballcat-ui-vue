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

    <a-form-model ref="form" :model="formData" :rules="rules">
      <a-form-model-item prop="fileList">
        <a-upload
          accept=".xls,.xlsx"
          :file-list="formData.fileList"
          :remove="handleRemove"
          :before-upload="beforeUpload"
        >
          <a-button>
            <a-icon type="upload" />
            选择文件
          </a-button>
          <a href="javascript:" style="margin-left: 12px;" @click.stop="downloadTemplate">点击下载模板文件</a>
        </a-upload>
      </a-form-model-item>

      <a-form-model-item label="已存在数据的处理方式" prop="existingAction">
        <a-radio-group v-model="formData.importAction">
          <a-radio value="SKIP_EXISTING">
            跳过已有配置
          </a-radio>
          <a-radio value="OVERWRITE_EXISTING">
            覆盖已有配置
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
  data () {
    return {
      // 标题
      title: '批量导入国际化信息',
      visible: false,
      submitLoading: false,

      value: 1,
      formData: {
        fileList: [],
        importAction: "SKIP_EXISTING"
      },
      rules: {
        fileList: [
          { type : 'array', required: true, len: 1, message: '请选择一个文件'},
        ],
      }
    }
  },
  methods: {
    show () {
      this.visible = true
      this.submitLoading = false
    },
    handleClose () {
      this.visible = false
      this.submitLoading = false
    },
    beforeUpload (file) {
      this.formData.fileList = [file]
      return false
    },
    handleRemove () {
      this.formData.fileList = []
    },
    downloadTemplate () {
      downloadTemplate().then(response => {
        remoteFileDownload(response)
      })
    },
    handleSubmit () {
      this.$refs['form'].validate(valid => {
        if (valid) {
          this.submitLoading = true

          // 构造 multipartFormData
          const formData = new FormData()
          formData.append('file', this.formData.fileList[0])
          formData.append('importAction', this.formData.importAction)

          importExcel(formData).then(res => {
            this.$message.success("导入成功！")
            this.$emit('reload-page-table', false)
            this.handleClose()
          }).finally(() => {
            this.submitLoading = false
          })
        }
      })
    }
  }
}
</script>

<style scoped>

</style>
