<template>
  <a-modal
    title="角色用户绑定"
    :visible="visible"
    :mask-closable="false"
    :body-style="{padding:'12px 18px'}"
    :confirm-loading="confirmLoading"
    :footer="null"
    :width="800"
    :centered="true"
    @ok="handleOk"
    @cancel="handleClose"
  >
    <!-- 查询条件 -->
    <div>
      <a-form v-bind="searchFormLayout">
        <a-row :gutter="16">
          <a-col :md="6" :sm="24">
            <a-form-item label="用户ID">
              <a-input-number v-model="queryParam.userId" type="number" placeholder="" />
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="24">
            <a-form-item label="用户名">
              <a-input v-model="queryParam.username" placeholder="" />
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="24">
            <a-form-item label="组织">
              <a-tree-select
                v-model="queryParam.organizationId"
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
          <a-col :md="5" :sm="24" class="table-page-search-wrapper">
            <div class="table-page-search-submitButtons">
              <a-button type="primary" @click="reloadTable">查询</a-button>
              <a-button style="margin-left: 8px" @click="resetSearchForm">重置</a-button>
            </div>
          </a-col>
        </a-row>
      </a-form>
    </div>
    <!--数据表格区域-->
    <a-table
      ref="table"
      size="middle"
      :row-key="rowKey"
      :columns="columns"
      :data-source="dataSource"
      :pagination="pagination"
      :loading="loading"
      @change="handleTableChange"
    >
      <template #action-slot="text, record">
        <a-popconfirm
          v-has="'sys:sysuser:grant'"
          title="确认要解绑吗？"
          @confirm="() => handleUnbind(record)"
        >
          <a href="javascript:" class="ballcat-text-danger">解绑</a>
        </a-popconfirm>
      </template>
    </a-table>
  </a-modal>
</template>

<script>
import { getRoleUserPage, unbindRoleUser } from '@/api/sys/role'
import { TablePageMixin } from '@/mixins'
import { getTree } from '@/api/sys/organization'


export default {
  name: 'RoleUserModal',
  mixins: [TablePageMixin],
  data () {
    return {
      confirmLoading: false,
      visible: false,

      queryParam: {},
      lazyLoad: true,
      rowKey: 'userId',

      getPage: getRoleUserPage,

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
          width: '100px',
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
        },
      },

      // 角色标识
      roleCode: null,
      // 组织树
      organizationTree: [],
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
    // 由于服务端不支持排序，这里重写此方法，便于取消 Mixin 的初始化排序字段设置
    initDefaultSort(){
    },
    // 重置搜索条件
    resetSearchForm () {
      this.queryParam = {
        roleCode: this.roleCode
      }
    },
    show (record) {
      this.visible = true
      this.roleCode = record.code
      this.resetSearchForm()
      this.loadData()
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
          this.reloadTable()
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
