<template>
  <div class="ant-pro-page-container-children-content">

    <pro-table
      ref="table"
      toolbar-title="配置信息"
      :row-key="rowKey"
      :request="tableRequest"
      :columns="columns"
      :scroll="{ x: 1000 }"
    >
      <!-- 查询表单 -->
      <template #search-form="searchFormState">
        <a-row :gutter="16">
          <a-col :xl="6" :md="12" :sm="24">
            <a-form-item label="名称">
              <a-input v-model="searchFormState.queryParam.name" placeholder="请输入" />
            </a-form-item>
          </a-col>
          <a-col :xl="6" :md="12" :sm="24">
            <a-form-item label="Key">
              <a-input v-model="searchFormState.queryParam.confKey" placeholder="请输入" />
            </a-form-item>
          </a-col>
          <a-col :xl="6" :md="12" :sm="24">
            <a-form-item label="分类">
              <a-input v-model="searchFormState.queryParam.category" placeholder="请输入" />
            </a-form-item>
          </a-col>
          <a-col :xl="6" :md="12" :sm="24">
            <a-form-item :wrapper-col="{flex: '1 1 0'}" class="search-actions-wrapper">
              <a-space>
                <a-button type="primary" :loading="searchFormState.loading" @click="searchFormState.reloadTable">查询</a-button>
                <a-button @click="searchFormState.resetSearchForm">重置</a-button>
              </a-space>
            </a-form-item>
          </a-col>
        </a-row>
      </template>

      <!-- 操作按钮区域 -->
      <template #toolbar-action>
        <a-button
          v-has="'system:config:edit'"
          type="primary"
          icon="plus"
          @click="handleAdd()"
        >新建 </a-button>
      </template>

      <!-- 数据表格区域 -->
      <template #action-slot="text, record">
        <a v-has="'system:config:edit'" @click="handleEdit(record)">编辑</a>
        <a-divider type="vertical" />
        <a-popconfirm v-has="'system:config:del'" title="确认要删除吗？" @confirm="() => handleDel(record)">
          <a href="javascript:" class="ballcat-text-danger">删除</a>
        </a-popconfirm>
      </template>
    </pro-table>

    <!--表单弹窗-->
    <sys-config-modal-form ref="formModal" @reload-page-table="reloadPageTable" />
  </div>
</template>

<script>
import { getPage, delObj } from '@/api/system/config'
import SysConfigModalForm from '@/views/system/config/SysConfigModalForm'
import ProTable from '@/components/Table/ProTable'
import { doRequest } from '@/utils/request'

export default {
  name: 'SysConfigPage',
  components: { ProTable, SysConfigModalForm },
  data() {
    return {
      rowKey: 'confKey',
      tableRequest: getPage,

      columns: [
        {
          title: '配置名称',
          dataIndex: 'name',
          width: 100,
          ellipsis: true
        },
        {
          title: 'Key',
          dataIndex: 'confKey',
          width: 100,
          ellipsis: true
        },
        {
          title: 'Value',
          dataIndex: 'confValue',
          width: 100,
          ellipsis: true
        },
        {
          title: '分类',
          dataIndex: 'category',
          width: 100
        },
        {
          title: '备注信息',
          dataIndex: 'remarks',
          width: 200,
          ellipsis: true
        },
        {
          title: '创建时间',
          dataIndex: 'createTime',
          width: 150,
          sorter: true
        },
        {
          title: '更新时间',
          dataIndex: 'updateTime',
          width: 150,
          sorter: true
        },
        {
          key: 'operate',
          title: '操作',
          dataIndex: 'action',
          align: 'center',
          width: 100,
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
    // 新建配置
    handleAdd() {
      this.$refs.formModal.add({ title: '新建配置' })
    },
    // 编辑配置
    handleEdit(record) {
      this.$refs.formModal.update(record, { title: '编辑配置' })
    },
    // 删除配置
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
