<template>
  <div class="ant-pro-page-container-children-content">
    <!-- 查询条件 -->
    <div class="ant-pro-table-search">
      <a-form v-bind="searchFormLayout">
        <a-row :gutter="16">
          <a-col :md="8" :sm="24">
            <a-form-item label="组织名称">
              <a-input v-model="queryParam.name" placeholder="查询操作维护中(就是懒得写)"/>
            </a-form-item>
          </a-col>
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

    <a-card :bordered="false" :bodyStyle="{padding: 0}">
      <!-- 操作按钮区域 -->
      <div class="ant-pro-table-toolbar">
        <div class="ant-pro-table-toolbar-title">组织架构</div>
        <div class="ant-pro-table-toolbar-option">
          <a-button v-has="'sys:organization:add'" type="primary" icon="plus" @click="handleAdd()">新建</a-button>
        </div>
      </div>

      <!--数据表格区域-->
      <div class="ant-pro-table-wrapper">
        <a-table
          ref="table"
          size="middle"
          :rowKey="rowKey"
          :columns="columns"
          :dataSource="dataSource"
          :loading="loading"
          @change="handleTableChange"
          :expandIcon="expandIconRender"
        >
          <template slot="expandIcon">
            <a-icon type="caret-down"/>
          </template>

          <template slot="action-slot" slot-scope="text, record">
            <a v-has="'sys:organization:edit'" @click="handleEdit(record)">编辑</a>
            <a-divider type="vertical"/>
            <a-popconfirm v-has="'sys:organization:del'"
                          title="确认要删除吗？"
                          @confirm="() => handleDel(record)">
              <a href="javascript:">删除</a>
            </a-popconfirm>
          </template>
        </a-table>
      </div>
    </a-card>

    <!--表单页面-->
    <form-modal ref="formModal" @reloadPageTable="reloadTable" :organizationTree="organizationTree"></form-modal>
  </div>
</template>

<script>
import { getTree, delObj } from '@/api/sys/organization'
import FormModal from './OrganizationModal'
import { TablePageMixin } from '@/mixins'

export default {
  name: 'OrganizationPage',
  mixins: [TablePageMixin],
  components: { FormModal },
  data () {
    return {
      delObj: delObj,

      columns: [
        {
          title: '组织机构层级',
          dataIndex: 'name'
        },
        {
          title: '排序',
          dataIndex: 'sort'
        },
        {
          title: '描述信息',
          dataIndex: 'description'
        },
        {
          title: '创建时间',
          dataIndex: 'createTime',
          width: '150px'
        },
        {
          title: '操作',
          dataIndex: 'action',
          width: '150px',
          scopedSlots: { customRender: 'action-slot' }
        }
      ]
    }
  },
  computed: {
    organizationTree () {
      return [{ id: 0, name: '根目录', children: this.dataSource }]
    }
  },
  methods: {
    expandIconRender (props) {
      if (props.record.children.length > 0) {
        if (props.expanded) {
          return (<span class="expandIcon" onClick={e => {
            props.onExpand(props.record, e)
          }}>
            <a-icon type="caret-down"/>
          </span>)
        } else {
          return (<span class="expandIcon" onClick={e => {
            props.onExpand(props.record, e)
          }}>
            <a-icon type="caret-right"/>
          </span>)
        }
      } else {
        return (<span class="expandIcon leafNode"></span>)
      }
    },
    /**
     * 表格数据加载方法
     */
    loadData () {
      this.loading = true
      getTree()
        .then(res => {
          if (res.code === 200) {
            this.dataSource = res.data
          } else {
            this.$message.warning(res.message || 'error request')
          }
        })
        .catch((e) => {
          this.$message.error(e.message || 'error request')
        })
        .finally(() => {
          this.loading = false
        })
    },
    handleEdit (record) {
      this.$refs.formModal.update(record)
    },
    handleAdd () {
      this.$refs.formModal.add()
    }
  }
}
</script>

<style scoped lang="less">
.expandIcon {
  margin-right: 8px
}

.leafNode {
  padding-left: 14px;
}
</style>
