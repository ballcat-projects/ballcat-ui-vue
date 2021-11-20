<template>
  <div class="ant-pro-page-container-children-content">

    <pro-table
      ref="table"
      toolbar-title="文档表，用于演示数据权限，可切换不同用户并授予不同角色体验效果（需退出重新登录）"
      :row-key="rowKey"
      :request="tableRequest"
      :columns="columns"
    >

      <!-- 查询表单 -->
      <template #search-form="searchFormState">
        <a-row :gutter="16">
          <a-col :md="8" :sm="24">
            <a-form-item label="ID">
              <a-input v-model="searchFormState.queryParam.id" placeholder="" />
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="24">
            <a-form-item :wrapper-col="{flex: '1 1 0'}" class="search-actions-wrapper">
              <a-space>
                <a-button type="primary" :loading="searchFormState.loading" @click="searchFormState.reloadTable(true)">查询</a-button>
                <a-button @click="searchFormState.resetSearchForm">重置</a-button>
              </a-space>
            </a-form-item>
          </a-col>
        </a-row>
      </template>

      <!-- 操作按钮区域 -->
      <template #toolbar-action>
        <a-button
          v-has="'sample:document:add'"
          type="primary"
          icon="plus"
          @click="handleAdd()"
        >新建
        </a-button>
      </template>

      <!--数据表格区域-->
      <template #action-slot="text, record">
        <a-popconfirm
          v-has="'sample:document:del'"
          title="确认要删除吗？"
          @confirm="() => handleDel(record)"
        >
          <a href="javascript:" class="ballcat-text-danger">删除</a>
        </a-popconfirm>
      </template>
    </pro-table>

    <!--表单弹窗-->
    <document-modal-form ref="formModal" @reload-page-table="reloadPageTable" />
  </div>
</template>

<script>
import { getPage, delObj } from '@/api/sample/document'
import DocumentModalForm from '@/views/sample/document/DocumentModalForm'
import ProTable from '@/components/Table/ProTable'
import { doRequest } from '@/utils/request'

export default {
  name: 'DocumentPage',
  components: { ProTable, DocumentModalForm },
  data () {
    return {
      rowKey: 'id',
      tableRequest: getPage,
      columns: [
        {
          title: '#',
          dataIndex: 'id'
        },
        {
          title: '文档名称',
          dataIndex: 'name'
        },
        {
          title: '所属用户ID',
          dataIndex: 'userId'
        },
        {
          title: '所属用户',
          dataIndex: 'username'
        },
        {
          title: '所属组织ID',
          dataIndex: 'organizationId'
        },
        {
          title: '所属组织',
          dataIndex: 'organizationName'
        },
        {
          title: '创建时间',
          dataIndex: 'createTime',
          width: '150px',
          sorter: true
        },
        {
          title: '操作',
          align: 'center',
          width: '150px',
          scopedSlots: { customRender: 'action-slot' }
        }
      ]
    }
  },
  methods: {
    // 刷新表格
    reloadPageTable(withFirstPage = true) {
      this.$refs.table.reloadTable(withFirstPage)
    },
    // 新建文档表，用于演示数据权限
    handleAdd () {
      const attributes = { title: '新建用户文档' }
      this.$refs.formModal.add(attributes)
    },
    //  编辑文档表，用于演示数据权限
    handleEdit (record) {
      const attributes = { title: '编辑用户文档' }
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
  }
}
</script>
