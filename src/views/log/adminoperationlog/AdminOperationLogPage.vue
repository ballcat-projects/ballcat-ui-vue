<template>
  <div>
    <a-card v-show="tableShow" :bordered="false">
      <!-- 查询条件 -->
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="48">
            <a-col :md="8" :sm="24">
              <a-form-item label="ID">
                <a-input v-model="queryParam.id" placeholder />
              </a-form-item>
            </a-col>

            <!-- <template v-if="advanced">
            </template>-->
            <a-col :md="!advanced && 8 || 24" :sm="24">
              <span
                class="table-page-search-submitButtons"
                :style="advanced && { float: 'right', overflow: 'hidden' } || {} "
              >
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

      <div class="table-wrapper">
        <!--数据表格-->
        <a-table
          ref="table"
          size="middle"
          :rowKey="rowKey"
          :columns="columns"
          :dataSource="dataSource"
          :pagination="pagination"
          :loading="loading"
          @change="handleTableChange"
        >
          <span slot="type-slot" slot-scope="text">
            <dict-slot dict-code="operation_type" :value="text">
            </dict-slot>
          </span>
          <span slot="status-slot" slot-scope="text">
            <dict-slot dict-code="log_status" :value="text"
                       :colors="{1: 'green', 0: 'red'}">
            </dict-slot>
          </span>
          <span slot="expandedRowRender" slot-scope="record" style="margin: 0">
            <p>params:</p>
            <pre><div class="wordwrap" v-html="record.params"></div></pre>
            <p>userAgent:</p>
            {{record.userAgent}}}
          </span>
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
  data() {
    return {
      getPage: getPage,

      columns: [
        {
          title: '#',
          dataIndex: 'id',
        },
        {
          title: '追踪ID',
          dataIndex: 'traceId',
        },
        {
          title: '日志消息',
          dataIndex: 'msg',
        },
        {
          title: '操作类型',
          dataIndex: 'type',
          scopedSlots: { customRender: 'type-slot' }
        },
        {
          title: '访问IP地址',
          dataIndex: 'ip',
        },
        {
          title: '请求URI',
          dataIndex: 'uri',
        },
        {
          title: '请求方式',
          dataIndex: 'method',
        },
        {
          title: '操作状态',
          dataIndex: 'status',
          scopedSlots: { customRender: 'status-slot' }
        },
        {
          title: '执行时长',
          dataIndex: 'time',
        },
        {
          title: '操作人',
          dataIndex: 'operator',
        },
        {
          title: '创建时间',
          dataIndex: 'createTime',
          width: '150px',
          sorter: true
        }
      ],

      dictCodes: ['log_status', 'operation_type']
    }
  },
  methods: {}
}
</script>

<style>
</style>
