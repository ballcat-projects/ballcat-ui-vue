import antLocale from 'ant-design-vue/es/locale-provider/zh_CN'
import momentLocale from 'moment/locale/zh-cn'

const components = {
  antLocale: antLocale,
  momentName: 'zh-cn',
  momentLocale: momentLocale
}

export default {
  ...components,

  pagination: {
    pageInfo: '{rangeBegin}-{rangeEnd} 共 {total} 条',
  },

  action: {
    query: '查询',
    reset: '重置',
    expand: '展开',
    collapse: '收起',
    more: '更多',
    create: '新建',
    delete: '删除',
    edit: '编辑',
    export: '导出',
    import: '导入',
    details: '详情',
    selectFile: '选择文件'
  },

  common: {
    operation: '操作',
    createTime: '创建时间',
    updateTime: '更新时间',
    remark: '备注'
  },

  message: {
    confirmDelete: '确认要删除吗？',
    pleaseEnter: '请输入',
    pleaseSelectFile: '请选择一个文件'
  },

  import: {
    batchImport: '批量导入',
    downloadTemplate: '下载模板文件',
    whenDataExisting: '当数据已存在时',
    skipExisting: '跳过已有',
    overwriteExisting: '覆盖已有',
    importSuccess: '导入成功'
  },

  i18n: {
    i18nData: {
      text: '国际化信息',
      languageTag: {
        text: '语言标签',
        tips: '语言标签，eg. zh-CN en-Us',
        required: '请输入语言标签！'
      },
      code: {
        text: '国际化标识',
        tips: '国际化信息的标识',
        required: '请输入国际化标识！'
      },
      message: {
        text: '文本值',
        tips: '国际化信息的文本',
        required: '请输入文本值！'
      }
    }
  }

}
