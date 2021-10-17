<template>
  <div class="ant-pro-page-container-children-content">
    <!-- 查询条件 -->
    <div class="ant-pro-table-search">
      <a-form v-bind="searchFormLayout">
        <a-row :gutter="16">
          <a-col :md="8" :sm="24">
            <a-form-item label="组织名称">
              <a-input v-model="queryParam.name" placeholder="请输入" />
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

    <a-card :bordered="false" :body-style="{ paddingTop: 0, paddingBottom: 0 }">
      <!-- 操作按钮区域 -->
      <div class="ant-pro-table-toolbar">
        <div class="ant-pro-table-toolbar-title">组织架构</div>
        <div class="ant-pro-table-toolbar-option">
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
          :loading="loading"
          :expand-icon="expandIconRender"
          :scroll="{ x: 800 }"
          @change="handleTableChange"
        >
          <template slot="expandIcon">
            <a-icon type="caret-down" />
          </template>

          <template slot="action-slot" slot-scope="text, record">
            <a v-has="'system:organization:edit'" @click="handleEdit(record)">编辑</a>
            <a-divider type="vertical" />
            <a-popconfirm v-has="'system:organization:del'" title="确认要删除吗？" @confirm="() => handleDel(record)">
              <a href="javascript:" class="ballcat-text-danger">删除</a>
            </a-popconfirm>
          </template>
        </a-table>
      </div>
    </a-card>

    <!--表单页面-->
    <organization-modal-form ref="formModal" :organization-tree="organizationTree" @reload-page-table="reloadTable" />
  </div>
</template>

<script>
import { getTree, delObj, revised } from '@/api/system/organization'
import OrganizationModalForm from './SysOrganizationModalForm'
import { TablePageMixin } from '@/mixins'

export default {
  name: 'SysOrganizationPage',
  components: { OrganizationModalForm },
  mixins: [TablePageMixin],
  data() {
    return {
      delObj: delObj,

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
          title: '描述信息',
          dataIndex: 'description',
          width: 200,
          ellipsis: true
        },
        {
          title: '创建时间',
          dataIndex: 'createTime',
          width: 150
        },
        {
          title: '操作',
          align: 'center',
          width: 120,
          scopedSlots: { customRender: 'action-slot' }
        }
      ]
    }
  },
  computed: {
    organizationTree() {
      return [{ id: 0, name: '根目录', children: this.dataSource }]
    }
  },
  methods: {
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
     * 表格数据加载方法
     */
    loadData() {
      this.loading = true
      getTree(this.queryParam)
        .then(res => {
          if (res.code === 200) {
            this.dataSource = res.data
          } else {
            this.$message.warning(res.message || 'error request')
          }
        })
        .catch(e => {
          this.$message.error(e.message || 'error request')
        })
        .finally(() => {
          this.loading = false
        })
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
    /**
     * 校正层级深度
     */
    handleRevised() {
      revised().then(res => {
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

<style scoped lang="less">
.expandIcon {
  margin-right: 8px;
}

.leafNode {
  padding-left: 14px;
}
</style>
