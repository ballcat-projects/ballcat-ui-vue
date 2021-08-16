import antLocale from 'ant-design-vue/es/locale-provider/en_US'
import momentLocale from 'moment/locale/eu'

const components = {
  antLocale: antLocale,
  momentName: 'eu',
  momentLocale: momentLocale
}

export default {
  ...components,

  action: {
    query: 'Query',
    reset: 'Reset',
    expand: 'Expand',
    collapse: 'Collapse',
    more: 'More',
    create: 'New',
    delete: 'Delete',
    edit: 'Edit',
    export: 'Export',
    import: 'Import',
    details: 'Details',
    selectFile: 'Select File'
  },

  common: {
    operation: 'Operation',
    createTime: 'Create Time',
    updateTime: 'Update Time',
    remark: 'Remark'
  },

  message: {
    confirmDelete: 'Are you sure delete?',
    pleaseEnter: 'Please enter',
    pleaseSelectFile: 'Please Select File'
  },

  import: {
    batchImport: 'Batch Import',
    downloadTemplate: 'Download Template',
    whenDataExisting: 'When the data already exists',
    skipExisting: 'Skip Existing',
    overwriteExisting: 'Overwrite Existing',
    importSuccess: 'Import Success'
  },

  i18n: {
    i18nData: {
      text: 'I18N Data',
      languageTag: {
        text: 'Language Tag',
        tips: 'LanguageTag，eg. zh-CN en-Us',
        required: 'Please enter i18n data language-tag！'
      },
      code: {
        text: 'Code',
        tips: 'A unique code for i18n data',
        required: 'Please enter i18n data code！'
      },
      message: {
        text: 'Message',
        tips: 'The text of the i18n data',
        required: 'Please enter i18n data message！！'
      }
    }
  }
}

