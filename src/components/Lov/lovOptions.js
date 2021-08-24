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
  modalTitle: '用户',
  dataKey: 'userId',
  // 自定义选择项的展示标题
  customOptionTitle (record) {
    return record.nickname
  },
  getPageData: getUserPage,
  // 搜索配置
  searchOption: [
    {
      label: '用户名',
      field: 'username',
      tag: SEARCH_TYPE.input,
      placeholder: '请输入'
    },
    {
      label: '昵称',
      field: 'name',
      tag: SEARCH_TYPE.input,
      placeholder: '请输入'
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
