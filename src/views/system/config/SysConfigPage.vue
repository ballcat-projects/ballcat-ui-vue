<template>
  <div class="ant-pro-page-container-children-content">
    <!-- 查询条件 -->
    <div class="ant-pro-table-search">
      <a-form v-bind="searchFormLayout">
        <a-row :gutter="16">
          <a-col :xl="6" :md="12" :sm="24">
            <a-form-item label="名称">
              <a-input v-model="queryParam.name" placeholder="请输入" />
            </a-form-item>
          </a-col>

          <a-col :xl="6" :md="12" :sm="24">
            <a-form-item label="Key">
              <a-input v-model="queryParam.confKey" placeholder="请输入" />
            </a-form-item>
          </a-col>

          <a-col :xl="6" :md="12" :sm="24">
            <a-form-item label="分类">
              <a-input v-model="queryParam.category" placeholder="请输入" />
            </a-form-item>
          </a-col>

          <!-- <template v-if="advanced">
           </template>-->
          <a-col
            :xl="6"
            :md="12"
            :sm="24"
            class="table-page-search-wrapper"
          >
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

    <a-card :bordered="false" :body-style="{ paddingTop: 0, paddingBottom: 0 }">
      <!-- 操作按钮区域 -->
      <div class="ant-pro-table-toolbar">
        <div class="ant-pro-table-toolbar-title">配置信息</div>
        <div class="ant-pro-table-toolbar-option">
          <a-button
            v-has="'system:config:edit'"
            type="primary"
            icon="plus"
            @click="handleAdd()"
          >新建 </a-button>
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
          :scroll="{ x: 1000 }"
          @change="handleTableChange"
        >
          <template #action-slot="text, record">
            <a v-has="'system:config:edit'" @click="handleEdit(record)">编辑</a>
            <a-divider type="vertical" />
            <a-popconfirm v-has="'system:config:del'" title="确认要删除吗？" @confirm="() => handleDel(record)">
              <a href="javascript:" class="ballcat-text-danger">删除</a>
            </a-popconfirm>
          </template>
        </a-table>
      </div>
    </a-card>

    <!--表单弹窗-->
    <sys-config-modal-form ref="formModal" @reload-page-table="reloadTable" />
  </div>
</template>

<script>
import { getPage, delObj } from '@/api/system/config'
import { TablePageMixin } from '@/mixins'
import SysConfigModalForm from '@/views/system/config/SysConfigModalForm'

export default {
  name: 'SysConfigPage',
  components: { SysConfigModalForm },
  mixins: [TablePageMixin],
  data() {
    return {
      getPage: getPage,
      delObj: delObj,
      rowKey: 'confKey',

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
          dataIndex: 'description',
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
          title: '操作',
          align: 'center',
          width: 100,
          scopedSlots: { customRender: 'action-slot' }
        }
      ]
    }
  },
  methods: {
    /**
     * 新建配置
     */
    handleAdd() {
      this.$refs.formModal.add({ title: '新建配置' })
    },
    /**
     * 编辑配置
     * @param record 当前配置属性
     */
    handleEdit(record) {
      this.$refs.formModal.update(record, { title: '编辑配置' })
    }
  }
}
</script>
