<template>
  <div class="ant-pro-page-container-children-content">

    <pro-table
      ref="table"
      toolbar-title="组织架构"
      :row-key="rowKey"
      :request="tableRequest"
      :response-data-process="responseDataProcess"
      :columns="columns"
      :pagination="false"
      :expand-icon="expandIconRender"
      :scroll="{ x: 800 }"
    >
      <!-- 查询条件 -->
      <template #search-form="searchFormState">
        <a-row :gutter="16">
          <a-col :md="8" :sm="24">
            <a-form-item label="组织名称">
              <a-input v-model="searchFormState.queryParam.name" placeholder="请输入" />
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="24">
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
        <a-popconfirm
          v-has="'system:organization:revised'"
          title="是否确认进行校正操作?"
          ok-text="Yes"
          cancel-text="No"
          @confirm="handleRevised"
        >
          <a-button type="danger" icon="interaction">校正层级深度</a-button>
        </a-popconfirm>
        <a-button
          v-has="'system:organization:add'"
          type="primary"
          icon="plus"
          @click="handleAdd()"
        >新建 </a-button>
      </template>

      <!--数据表格区域-->
      <template slot="action-slot" slot-scope="text, record">
        <a v-has="'system:organization:edit'" @click="handleEdit(record)">编辑</a>
        <a-divider type="vertical" />
        <a-popconfirm v-has="'system:organization:del'" title="确认要删除吗？" @confirm="() => handleDel(record)">
          <a href="javascript:" class="ballcat-text-danger">删除</a>
        </a-popconfirm>
      </template>
    </pro-table>

    <!--表单页面-->
    <organization-modal-form ref="formModal" :organization-tree="organizationTree" @reload-page-table="reloadPageTable" />
  </div>
</template>

<script>
import { getTree, delObj, revised } from '@/api/system/organization'
import OrganizationModalForm from './SysOrganizationModalForm'
import ProTable from '@/components/Table/ProTable'
import { doRequest } from '@/utils/request'

export default {
  name: 'SysOrganizationPage',
  components: { ProTable, OrganizationModalForm },
  data() {
    return {
      rowKey: 'id',
      tableRequest: getTree,

      columns: [
        {
          title: '组织机构层级',
          width: 250,
          dataIndex: 'name'
        },
        {
          title: '排序',
          width: 80,
          dataIndex: 'sort'
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
          width: 150
        },
        {
          key: 'operate',
          title: '操作',
          align: 'center',
          width: 120,
          scopedSlots: { customRender: 'action-slot' }
        }
      ],

      organizationTree: []
    }
  },
  methods: {
    // 刷新表格
    reloadPageTable(withFirstPage = true) {
      this.$refs.table.reloadTable(withFirstPage)
    },
    // 自定义表格响应的数据处理
    responseDataProcess(data) {
      this.organizationTree = [{ id: 0, name: '根目录', children: data }]
      return { records: data }
    },
    // 折叠 icon 自定义渲染
    expandIconRender(props) {
      if (props.record.children.length > 0) {
        if (props.expanded) {
          return (
            <span
              class="expandIcon"
              onClick={e => {
                props.onExpand(props.record, e)
              }}
            >
              <a-icon type="caret-down" />
            </span>
          )
        } else {
          return (
            <span
              class="expandIcon"
              onClick={e => {
                props.onExpand(props.record, e)
              }}
            >
              <a-icon type="caret-right" />
            </span>
          )
        }
      } else {
        return <span class="expandIcon leafNode"></span>
      }
    },

    /**
     * 新建组织
     */
    handleAdd() {
      this.$refs.formModal.add({ title: '新建组织' })
    },
    /**
     * 编辑组织
     * @param record 当前组织属性
     */
    handleEdit(record) {
      this.$refs.formModal.update(record, { title: '编辑组织' })
    },
    // 删除
    handleDel (record) {
      doRequest(delObj(record[this.rowKey]), {
        onSuccess: () => {
          this.reloadPageTable(false)
        }
      })
    },
    /**
     * 校正层级深度
     */
    handleRevised() {
      doRequest(revised(), {
        onSuccess: () => {
          this.reloadPageTable(false)
        }
      })
    }
  }
}
</script>

<style scoped lang="less">
.expandIcon {
  margin-right: 8px;
}

.leafNode {
  padding-left: 14px;
}
</style>
