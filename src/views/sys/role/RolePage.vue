<template>
  <div class="ant-pro-page-container-children-content">
    <div v-show="tableShow">
      <!-- 查询条件 -->
      <div class="ant-pro-table-search">
        <a-form v-bind="searchFormLayout">
          <a-row :gutter="16">
            <a-col :md="8" :sm="24">
              <a-form-item label="角色">
                <a-input v-model="queryParam.name" placeholder=""/>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item label="标识">
                <a-input v-model="queryParam.code" placeholder=""/>
              </a-form-item>
            </a-col>
            <!-- <template v-if="advanced">
             </template>-->
            <a-col :md="8" :sm="24" class="table-page-search-wrapper">
              <div class="table-page-search-submitButtons">
                <a-button type="primary" @click="reloadTable">查询</a-button>
                <a-button style="margin-left: 8px" @click="resetSearchForm">重置</a-button>
                <!--              <a @click="toggleAdvanced" style="margin-left: 8px">-->
                <!--                {{ advanced ? '收起' : '展开' }}-->
                <!--                <a-icon :type="advanced ? 'up' : 'down'"/>-->
                <!--              </a>-->
              </div>
            </a-col>
          </a-row>
        </a-form>
      </div>


      <a-card :bordered="false" :body-style="{padding: 0}">
        <!-- 操作按钮区域 -->
        <div class="ant-pro-table-toolbar">
          <div class="ant-pro-table-toolbar-title">角色管理</div>
          <div class="ant-pro-table-toolbar-option">
            <a-button v-has="'sys:sysrole:add'" type="primary" icon="plus" @click="handleAdd()">新建</a-button>
          </div>
        </div>

        <div class="ant-pro-table-wrapper">
          <!--数据表格-->
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
            <template #type-slot="text">
              <dict-slot dict-code="role_type" :value="text"/>
            </template>
            <template #action-slot="text, record">
              <a v-has="'sys:sysrole:edit'" @click="handleEdit(record)">编辑</a>
              <a-divider type="vertical"/>
              <a v-has="'sys:sysrole:grant'" @click="handleGrant(record)">授权</a>
              <a-divider type="vertical"/>
              <a-popconfirm v-has="'sys:sysrole:del'"
                            title="确认要删除吗？"
                            @confirm="() => handleDel(record)">
                <a href="javascript:" style="color: #ff4d4f">删除</a>
              </a-popconfirm>
            </template>
          </a-table>
        </div>
      </a-card>
    </div>

    <role-grant-drawer ref="roleGrantDrawer" />

    <role-modal-form
      ref="formModal"
      @reload-page-table="reloadTable"
    />
  </div>
</template>

<script>
import { getPage, delObj } from '@/api/sys/role'
import RoleModalForm from './RoleModalForm'
import RoleGrantDrawer from './RoleGrantDrawer'
import { TablePageMixin } from '@/mixins'

export default {
  name: 'RolePage',
  components: {
    RoleGrantDrawer,
    RoleModalForm
  },
  mixins: [TablePageMixin],
  data () {
    return {
      getPage: getPage,
      delObj: delObj,

      columns: [
        {
          title: '#',
          dataIndex: 'id'
        },
        {
          title: '角色名称',
          dataIndex: 'name'
        },
        {
          title: '角色标识',
          dataIndex: 'code'
        },
        {
          title: '角色类型',
          dataIndex: 'type',
          scopedSlots: { customRender: 'type-slot' }
        },
        {
          title: '备注',
          dataIndex: 'note'
        },
        {
          title: '创建时间',
          dataIndex: 'createTime',
          width: '180px',
          sorter: true
        },
        {
          title: '更新时间',
          dataIndex: 'updateTime',
          width: '180px',
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
    // 新建角色
    handleAdd () {
      this.$refs.formModal.add({title: '新建角色'})
    },
    // 编辑角色
    handleEdit (record) {
      this.$refs.formModal.update(record, {title: '编辑角色'})
    },
    // 授权
    handleGrant (record) {
      this.$refs.roleGrantDrawer.showDrawer(record)
    }
  }
}
</script>
