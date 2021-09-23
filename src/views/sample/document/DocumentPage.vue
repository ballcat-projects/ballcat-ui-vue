<template>
  <div class="ant-pro-page-container-children-content">
    <!-- 查询条件 -->
    <div class="ant-pro-table-search">
      <a-form v-bind="searchFormLayout">
        <a-row :gutter="16">
          <a-col :md="8" :sm="24">
            <a-form-item label="ID">
              <a-input v-model="queryParam.id" placeholder="" />
            </a-form-item>
          </a-col>

          <!-- <template v-if="advanced">
           </template>-->
          <a-col :md="8" :sm="24" class="table-page-search-wrapper">
            <div class="table-page-search-submitButtons">
              <a-button type="primary" @click="reloadTable">查询</a-button>
              <a-button style="margin-left: 8px" @click="resetSearchForm">重置</a-button>
              <!--<a @click="toggleAdvanced" style="margin-left: 8px">
                {{ advanced ? '收起' : '展开' }}
                <a-icon :type="advanced ? 'up' : 'down'"/>
              </a>-->
            </div>
          </a-col>
        </a-row>
      </a-form>
    </div>

    <a-card :bordered="false" :body-style="{paddingTop: 0, paddingBottom: 0}">
      <!-- 操作按钮区域 -->
      <div class="ant-pro-table-toolbar">
        <div class="ant-pro-table-toolbar-title">文档表，用于演示数据权限，可切换不同用户并授予不同角色体验效果（需退出重新登录）</div>
        <div class="ant-pro-table-toolbar-option">
          <a-button
            v-has="'sample:document:add'"
            type="primary"
            icon="plus"
            @click="handleAdd()"
          >新建
          </a-button>
        </div>
      </div>

      <!--数据表格区域-->
      <div class="ant-pro-table-wrapper">
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
              v-has="'sample:document:del'"
              title="确认要删除吗？"
              @confirm="() => handleDel(record)"
            >
              <a href="javascript:" class="ballcat-text-danger">删除</a>
            </a-popconfirm>
          </template>
        </a-table>
      </div>
    </a-card>

    <!--表单弹窗-->
    <document-modal-form ref="formModal" @reload-page-table="reloadTable" />
  </div>
</template>

<script>
import { getPage, delObj } from '@/api/sample/document'
import { TablePageMixin } from '@/mixins'
import DocumentModalForm from '@/views/sample/document/DocumentModalForm'

export default {
  name: 'DocumentPage',
  components: { DocumentModalForm },
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
    /**
     * 新建文档表，用于演示数据权限
     */
    handleAdd () {
      const attributes = { title: '新建用户文档' }
      this.$refs.formModal.add(attributes)
    },
    /**
     * 编辑文档表，用于演示数据权限
     * @param record 当前文档表，用于演示数据权限属性
     */
    handleEdit (record) {
      const attributes = { title: '编辑用户文档' }
      this.$refs.formModal.update(record, attributes)
    }
  }
}
</script>
