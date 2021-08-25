// Lov 搜索条件控件的类型
const SEARCH_TYPE = {
  'input': 'input',
  'number-input': 'number-input',
  'select': 'select',
  'dict-select': 'dict-select'
}

import { getPage as getUserPage } from '@/api/system/user'

export const sysUserLov = {
  multiple: true,
  isNumberValue: true,
  modalTitle: '用户',
  dataKey: 'userId',
  // 自定义选择项的展示标题
  customOptionTitle (record) {
    return record.nickname
  },
  getPageData: getUserPage,
  // 搜索配置
  searchOptions: [
    {
      label: '用户名',
      field: 'username',
      type: SEARCH_TYPE.input,
      placeholder: 'message.pleaseEnter'
    },
    {
      label: '昵称',
      field: 'name',
      type: SEARCH_TYPE.input,
      placeholder: 'message.pleaseEnter'
    }
  ],
  // 表格列
  tableColumns:
    [
      {
        title: '用户名',
        dataIndex: 'username'
      },
      {
        title: '昵称',
        dataIndex: 'nickname'
      },
      {
        title: '组织',
        dataIndex: 'organizationName'
      }
    ]
}
