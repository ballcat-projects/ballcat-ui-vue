<template>
  <div>
    <a-card v-show="tableShow" :bordered="false">
      <!-- 查询条件 -->
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="48">
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
            <a-col :md="!advanced && 8 || 24" :sm="24">
              <span class="table-page-search-submitButtons"
                    :style="advanced && { float: 'right', overflow: 'hidden' } || {} ">
                <a-button type="primary" @click="reloadTable">查询</a-button>
                <a-button style="margin-left: 8px" @click="resetSearchForm">重置</a-button>
                <!--<a @click="toggleAdvanced" style="margin-left: 8px">
                  {{ advanced ? '收起' : '展开' }}
                  <a-icon :type="advanced ? 'up' : 'down'"/>
                </a>-->
              </span>
            </a-col>
          </a-row>
        </a-form>
      </div>

      <!-- 操作按钮区域 -->
      <div class="table-operator">
        <a-button v-has="'sys:sysrole:add'" type="primary" icon="plus" @click="handleAdd()">新建</a-button>
      </div>

      <div class="table-wrapper">
        <!--数据表格-->
        <a-table
          ref="table"
          size="middle"
          :rowKey="rowKey"
          :columns="columns"
          :dataSource="dataSource"
          :pagination="pagination"
          :loading ="loading"
          @change="handleTableChange"
        >
           <span slot="type-slot" slot-scope="text">
            <dict-slot dict-code="role_type"  :colors="{1:'orange', 2: 'green'}" :value="text"/>
          </span>
          <span slot="action-slot" slot-scope="text, record">
            <template>
              <a v-has="'sys:sysrole:edit'" @click="handleEdit(record)">编辑</a>
              <a-divider type="vertical"/>
              <a v-has="'sys:sysrole:grant'" @click="handleGrant(record)">授权</a>
              <a-divider type="vertical"/>
              <a-popconfirm v-has="'sys:sysrole:del'"
                title="确认要删除吗？"
                @confirm="() => handleDel(record)">
                <a href="javascript:;">删除</a>
              </a-popconfirm>
            </template>
          </span>
        </a-table>
      </div>
    </a-card>

    <!--表单页面-->
    <a-card v-if="formInited" :bordered="false" :title="cardTitle" v-show="!tableShow">
      <form-page  ref="formPage" @backToPage="backToPage"></form-page>
    </a-card>

    <role-grant-drawer ref="roleGrantDrawer" ></role-grant-drawer>

  </div>
</template>

<script>
import { getPage, delObj } from '@/api/sys/role'
import FormPage from './RoleForm'
import RoleGrantDrawer from './RoleGrantDrawer'
import { TablePageMixin } from '@/mixins'

export default {
  name: 'RolePage',
  mixins: [TablePageMixin],
  components: {
    FormPage,
    RoleGrantDrawer
  },
  data () {
    return {
      getPage: getPage,
      delObj: delObj,

      columns: [
        {
          title: '#',
          dataIndex: 'id',
        },
        {
          title: '角色',
          dataIndex: 'name',
        },
        {
          title: '标识',
          dataIndex: 'code',
        },
        {
          title: '角色类型',
          dataIndex: 'type',
          scopedSlots: { customRender: 'type-slot' }
        },
        {
          title: '备注',
          dataIndex: 'note',
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
          dataIndex: 'action',
          width: '150px',
          scopedSlots: { customRender: 'action-slot' }
        }
      ],
      dictCodes: ['role_type']
    }
  },
  methods: {
    handleGrant (record) {
      this.$refs.roleGrantDrawer.showDrawer(record)
    }

  }
}
</script>
