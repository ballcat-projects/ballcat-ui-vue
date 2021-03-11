<template>
  <div class="ant-pro-page-container-children-content">
    <!-- 查询条件 -->
    <div class="ant-pro-table-search">
      <a-form v-bind="searchFormLayout">
        <a-row :gutter="16">
          <a-col :md="8" :sm="24">
            <a-form-item label="ID">
              <a-input v-model="queryParam.id" placeholder=""/>
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
        <div class="ant-pro-table-toolbar-title">配置信息</div>
        <div class="ant-pro-table-toolbar-option">
          <a-button v-has="'sys:config:edit'" type="primary" icon="plus" @click="handleAdd()">新建</a-button>
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
          <template #action-slot="text, record">
            <a v-has="'sys:config:edit'" @click="handleEdit(record)">编辑</a>
            <a-divider type="vertical"/>
            <a-popconfirm v-has="'sys:config:del'"
                          title="确认要删除吗？"
                          @confirm="() => handleDel(record)">
              <a href="javascript:" style="color: #ff4d4f">删除</a>
            </a-popconfirm>
          </template>
        </a-table>
      </div>
    </a-card>

    <!--表单弹窗-->
    <sys-config-form-modal
      ref="formModal"
      @reload-page-table="reloadTable"
    />
  </div>
</template>

<script>
import { getPage, delObj } from '@/api/sys/sysconfig'
import { TablePageMixin } from '@/mixins'
import SysConfigFormModal from '@/views/sys/config/SysConfigFormModal'

export default {
  name: 'SysConfigPage',
  components: { SysConfigFormModal },
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
          title: '配置名称',
          dataIndex: 'name'
        },
        {
          title: '缓存Key',
          dataIndex: 'confKey'
        },
        {
          title: '配置值',
          dataIndex: 'confValue'
        },
        {
          title: '分类',
          dataIndex: 'category'
        },
        {
          title: '备注',
          dataIndex: 'description',
          width: '150px',
          ellipsis: true
        },
        {
          title: '创建时间',
          dataIndex: 'createTime',
          width: '150px',
          sorter: true
        },
        {
          title: '更新时间',
          dataIndex: 'updateTime',
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
     * 新建配置
     */
    handleAdd () {
      this.$refs.formModal.add({ title: '新建配置' })
    },
    /**
     * 编辑配置
     * @param record 当前配置属性
     */
    handleEdit (record) {
      this.$refs.formModal.update(record, { title: '编辑配置' })
    }
  }
}
</script>
