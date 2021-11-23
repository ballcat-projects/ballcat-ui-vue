<template>
  <div class="ant-pro-page-container-children-content">
    <pro-table
      ref="table"
      toolbar-title="菜单权限"
      :row-key="rowKey"
      :request="tableRequest"
      :response-data-process="responseDataProcess"
      table-class-name="menu-tree-table"
      :columns="columns"
      :expand-icon-column-index="1"
      :pagination="false"
      :scroll="{ x: 1100 }"
    >
      <!-- 查询条件 -->
      <template #search-form="searchFormState">
        <a-row :gutter="16">
          <a-col :xl="6" :md="12" :sm="24">
            <a-form-item label="菜单ID">
              <a-input v-model="searchFormState.queryParam.id" placeholder="请输入" />
            </a-form-item>
          </a-col>
          <a-col :xl="6" :md="12" :sm="24">
            <a-form-item label="菜单名称">
              <a-input v-model="searchFormState.queryParam.title" placeholder="请输入" />
            </a-form-item>
          </a-col>
          <a-col :xl="6" :md="12" :sm="24">
            <a-form-item label="路由地址">
              <a-input v-model="searchFormState.queryParam.path" placeholder="请输入" />
            </a-form-item>
          </a-col>
          <a-col :xl="6" :md="12" :sm="24">
            <a-form-item :wrapper-col="{flex: '1 1 0'}" class="search-actions-wrapper">
              <a-space size="middle">
                <a-space>
                  <a-button type="primary" :loading="searchFormState.loading" @click="searchFormState.reloadTable">查询</a-button>
                  <a-button style="margin-left: 8px" @click="searchFormState.resetSearchForm">重置</a-button>
                </a-space>
              </a-space>
            </a-form-item>
          </a-col>
        </a-row>
      </template>

      <!-- 操作按钮区域 -->
      <template #toolbar-action>
        <a-button
          v-has="'system:menu:add'"
          type="primary"
          icon="plus"
          @click="handleAdd()"
        >新建
        </a-button>
      </template>

      <!--数据表格区域-->
      <template #menu-title-slot="text, record">
        <a-icon v-if="record.icon" :type="record.icon" style="margin-right: 6px" />
        <a-tooltip placement="top">
          <template slot="title">
            <span>{{ enableI18n ? record.i18nTitle : record.title }}</span>
          </template>
          {{ enableI18n ? record.i18nTitle : record.title }}
        </a-tooltip>
        <a-icon
          v-if="enableI18n && record.type !== 2"
          type="edit"
          theme="twoTone"
          @click="openI18nMessage(record.title)"
        />
      </template>

      <template #hidden-slot="text">
        <dict-text dict-code="yes_or_no" :value="text ? 0 : 1" />
      </template>

      <template #action-slot="text, record">
        <a v-has="'system:menu:add'" @click="handleAdd(record)">添加</a>
        <a-divider type="vertical" />
        <a v-has="'system:menu:edit'" @click="handleEdit(record)">编辑</a>
        <a-divider type="vertical" />
        <a-popconfirm v-has="'system:menu:del'" title="确认要删除吗？" @confirm="() => handleDel(record)">
          <a href="javascript:" class="ballcat-text-danger">删除</a>
        </a-popconfirm>
      </template>
    </pro-table>

    <!-- 菜单的标题国际化信息弹窗 -->
    <i18n-message-modal v-if="enableI18n" ref="i18nMessageModal" @has-update="handleI18nMessageUpdate" />

    <!--表单弹窗-->
    <sys-menu-modal-form ref="formModal" :menu-list="menuList" @reload-page-table="reloadPageTable" />

  </div>
</template>

<script>
import { listMenu, delObj } from '@/api/system/menu'
import SysMenuModalForm from '@/views/system/menu/SysMenuModalForm'
import { listToTree } from '@/utils/treeUtil'
import I18nMessageModal from '@/views/i18n/I18nMessageModal'
import projectConfig from '@/config/projectConfig'
import ProTable from '@/components/Table/ProTable'
import { doRequest } from '@/utils/request'

export default {
  name: 'SysMenuPage',
  components: { ProTable, SysMenuModalForm, I18nMessageModal },
  data () {
    return {
      rowKey: 'id',
      tableRequest: listMenu,

      columns: [
        {
          title: 'ID',
          dataIndex: 'id',
          width: 80
        },
        {
          title: '菜单名称',
          dataIndex: 'title',
          width: 200,
          ellipsis: true,
          scopedSlots: { customRender: 'menu-title-slot' }
        },
        {
          title: '权限标识',
          dataIndex: 'permission',
          width: 150,
          ellipsis: true
        },
        {
          title: '路由地址',
          dataIndex: 'path',
          width: 120,
          ellipsis: true
        },
        {
          title: '资源路径',
          dataIndex: 'uri',
          width: 180,
          ellipsis: true
        },
        {
          title: '排序',
          dataIndex: 'sort',
          width: 50
        },
        {
          title: '可见',
          dataIndex: 'hidden',
          width: 50,
          scopedSlots: { customRender: 'hidden-slot' }
        },
        {
          title: '创建时间',
          dataIndex: 'createTime',
          width: 150
        },
        {
          key: 'operate',
          title: '操作',
          align: 'center',
          width: 150,
          fixed: 'right',
          scopedSlots: { customRender: 'action-slot' }
        }
      ],

      // 是否开启了国际化
      enableI18n: projectConfig.enableI18n,
      // 懒加载，取消mixin中的自动加载，第一次加载交由组件自己处理
      lazyLoad: true,
      // 菜单列表
      menuList: []
    }
  },
  created () {
    // 开启国际化时，注册监听事件
    this.enableI18n && this.$bus.$on('switch-language', this.reloadPageTable)
  },
  destroyed () {
    // 销毁监听事件
    this.enableI18n && this.$bus.$off('switch-language', this.reloadPageTable)
  },
  methods: {
    // 刷新表格
    reloadPageTable(withFirstPage = true) {
      this.$refs.table.reloadTable(withFirstPage)
    },
    // 处理响应数据
    responseDataProcess (data) {
      this.menuList = data
      return listToTree(data, 0)
    },
    // 新建菜单权限
    handleAdd (record) {
      const attributes = { title: '新建菜单权限' }
      // 按钮类型不允许有子级，所以默认变成创建平级
      if (record) {
        attributes.formData = {
          parentId: record.type === 2 ? record.parentId : record.id,
          type: record.type === 2 ? 2 : record.type + 1
        }
      } else {
        attributes.formData = {
          type: 0
        }
      }
      this.$refs.formModal.add(attributes)
    },
    // 编辑菜单权限
    handleEdit (record) {
      const attributes = { title: '编辑菜单权限' }
      this.$refs.formModal.update(record, attributes)
    },
    // 删除
    handleDel (record) {
      doRequest(delObj(record[this.rowKey]), {
        onSuccess: () => {
          this.reloadPageTable(false)
        }
      })
    },
    // 打开 i18nMessage 弹窗
    openI18nMessage (code) {
      this.$refs.i18nMessageModal.show(code)
    },
    // 当 i18nData 有修改时，刷新表格数据
    handleI18nMessageUpdate () {
      this.reloadPageTable()
    }
  }
}
</script>
<style scoped>
.menu-tree-table >>> td {
  white-space: nowrap !important;
}

.ant-tag.single-tag {
  margin-right: 0;
}
</style>
