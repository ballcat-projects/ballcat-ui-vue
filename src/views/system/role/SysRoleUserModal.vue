<template>
  <a-modal
    title="角色用户绑定"
    :visible="visible"
    :mask-closable="false"
    :body-style="{padding:'15px 18px'}"
    :confirm-loading="confirmLoading"
    :footer="null"
    :width="800"
    :centered="true"
    @ok="handleOk"
    @cancel="handleClose"
  >

    <pro-table
      ref="table"
      toolbar-title="角色管理"
      :row-key="rowKey"
      :request="tableRequest"
      :columns="columns"
      :lazy-load="true"
      :toolbar-enabled="false"
      search-form-class-name="ballcat-pro-table-search-unwrap"
    >

      <!-- 查询条件 -->
      <template #search-form="searchFormState">
        <a-row :gutter="16">
          <a-col :md="6" :sm="24">
            <a-form-item label="用户ID">
              <a-input-number
                v-model="searchFormState.queryParam.userId"
                type="number"
                placeholder="请输入"
                style="width: 100%"
              />
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="24">
            <a-form-item label="用户名">
              <a-input v-model="searchFormState.queryParam.username" placeholder="请输入" />
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="24">
            <a-form-item label="组织">
              <a-tree-select
                v-model="searchFormState.queryParam.organizationId"
                style="width: 100%"
                :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
                :tree-data="organizationTree"
                :allow-clear="true"
                :replace-fields="{
                  title: 'name',
                  key: 'id',
                  value: 'id'
                }"
              />
            </a-form-item>
          </a-col>
          <a-col :md="5" :sm="24">
            <a-form-item :wrapper-col="{flex: '1 1 0'}" class="search-actions-wrapper">
              <a-space>
                <a-button type="primary" :loading="searchFormState.loading" @click="searchFormState.reloadTable(true)">查询</a-button>
                <a-button style="margin-left: 8px" @click="searchFormState.resetSearchForm">重置</a-button>
              </a-space>
            </a-form-item>
          </a-col>
        </a-row>
      </template>

      <!--数据表格区域-->
      <template #action-slot="text, record">
        <a-popconfirm
          v-has="'system:user:grant'"
          title="确认要解绑吗？"
          @confirm="() => handleUnbind(record)"
        >
          <a href="javascript:" class="ballcat-text-danger">解绑</a>
        </a-popconfirm>
      </template>
    </pro-table>
  </a-modal>
</template>

<script>
import ProTable from '@/components/Table/ProTable'
import { getRoleUserPage, unbindRoleUser } from '@/api/system/role'
import { getTree } from '@/api/system/organization'

export default {
  name: 'RoleUserModal',
  components: { ProTable },
  data () {
    return {
      confirmLoading: false,
      visible: false,

      rowKey: 'userId',
      tableRequest: (queryParam) => {
        return getRoleUserPage(Object.assign({}, queryParam, {roleCode: this.roleCode}))
      },

      columns: [
        {
          title: '用户Id',
          dataIndex: 'userId',
          width: '45px'
        },
        {
          title: '用户名',
          dataIndex: 'username',
          width: '45px'
        },
        {
          title: '昵称',
          dataIndex: 'nickname',
          width: '45px'
        },
        {
          title: '组织机构',
          dataIndex: 'organizationName',
          width: '45px'
        },
        {
          title: '操作',
          align: 'center',
          width: 100,
          scopedSlots: { customRender: 'action-slot' }
        }
      ],

      // 搜索表单的布局
      searchFormLayout: {
        labelCol: {
          md: { span: 7 }
        },
        wrapperCol: {
          md: { span: 17 }
        }
      },

      // 角色标识
      roleCode: null,
      // 组织树
      organizationTree: []
    }
  },
  created () {
    getTree().then(res => {
      this.organizationTree = res.data
      // 默认展开一级组织
      this.organizationExpandedKeys = res.data.map(x => x.id)
    })
  },
  methods: {
    show (record) {
      this.visible = true
      this.roleCode = record.code
      // this.resetSearchForm()
      this.$refs.table.reloadTable()
    },
    handleOk (e) {
      this.confirmLoading = true
    },
    handleClose (e) {
      this.visible = false
      this.confirmLoading = false
    },
    handleUnbind (record) {
      unbindRoleUser(record.userId, this.roleCode).then(res => {
        if (res.code === 200) {
          this.$message.success(res.message)
          this.$refs.table.reloadTable()
        } else {
          this.$message.error(res.message)
        }
      })
    }

  }
}
</script>

<style scoped>

</style>
