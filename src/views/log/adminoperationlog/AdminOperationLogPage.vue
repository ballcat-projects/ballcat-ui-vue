<template>
  <div class="ant-pro-page-container-children-content">
    <!-- 查询条件 -->
    <div class="ant-pro-table-search">
      <a-form v-bind="searchFormLayout">
        <a-row :gutter="16">
          <a-col :md="8" :sm="24">
            <a-form-item label="ID">
              <a-input v-model="queryParam.id" placeholder />
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

    <a-card :bordered="false" :body-style="{paddingTop: 0, paddingBottom: 0}">
      <!-- 操作按钮区域 -->
      <div class="ant-pro-table-toolbar">
        <div class="ant-pro-table-toolbar-title">操作日志</div>
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
            <dict-slot dict-code="operation_type" :value="text" />
          </template>
          <template #status-slot="text">
            <dict-text dict-code="log_status" :value="text" />
          </template>
          <template #expandedRowRender="record">
            <p>params:</p>
            <pre><div class="wordwrap" v-html="record.params" /></pre>
            <p>userAgent:</p>
            {{ record.userAgent }}}
          </template>
        </a-table>
      </div>
    </a-card>
  </div>
</template>

<script>
import { getPage } from '@/api/log/adminoperationlog'
import { TablePageMixin } from '@/mixins'

export default {
  name: 'AdminOperationLogPage',
  mixins: [TablePageMixin],
  data () {
    return {
      getPage: getPage,

      columns: [
        {
          title: '追踪ID',
          dataIndex: 'traceId',
          width: '205px',
        },
        {
          title: '日志消息',
          dataIndex: 'msg',
          ellipsis: true,
          width: '120px',
        },
        {
          title: '类型',
          dataIndex: 'type',
          align: 'center',
          scopedSlots: { customRender: 'type-slot' }
        },
        {
          title: '请求IP',
          dataIndex: 'ip',
          width: '120px'
        },
        {
          title: '请求URI',
          dataIndex: 'uri',
          ellipsis: true
        },
        {
          title: '方法',
          dataIndex: 'method'
        },
        {
          title: '耗时',
          dataIndex: 'time',
          customRender: function (text) {
            return text + ' ms'
          }
        },
        {
          title: '操作人',
          dataIndex: 'operator'
        },
        {
          title: '状态',
          dataIndex: 'status',
          scopedSlots: { customRender: 'status-slot' }
        },
        {
          title: '创建时间',
          dataIndex: 'createTime',
          width: '150px',
          sorter: true
        }
      ]
    }
  },
  methods: {
    onTimeChange (dates, dateStrings) {
      this.queryParam.startTime = dateStrings[0]
      this.queryParam.endTime = dateStrings[1]
    }
  }
}
</script>

<style>
</style>
