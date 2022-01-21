<template>
  <div class="ant-pro-page-container-children-content">
    <pro-table
      ref="table"
      toolbar-title="操作日志"
      :row-key="rowKey"
      :request="tableRequest"
      :columns="columns"
      :scroll="{ x: 1100 }"
    >
      <!-- 查询表单 -->
      <template #search-form="searchFormState">
        <a-row :gutter="16">
          <a-col :xl="8" :md="12" :sm="24">
            <a-form-item label="追踪ID">
              <a-input v-model="searchFormState.queryParam.traceId" placeholder="请输入" />
            </a-form-item>
          </a-col>
          <a-col :xl="8" :md="12" :sm="24">
            <a-form-item label="请求IP">
              <a-input v-model="searchFormState.queryParam.ip" placeholder="请输入" />
            </a-form-item>
          </a-col>
          <template v-if="!searchFormState.collapsed">
            <a-col :xl="8" :md="12" :sm="24">
              <a-form-item label="请求URI">
                <a-input v-model="searchFormState.queryParam.uri" placeholder="请输入" />
              </a-form-item>
            </a-col>
            <a-col :xl="8" :md="12" :sm="24">
              <a-form-item label="日志消息">
                <a-input v-model="searchFormState.queryParam.msg" placeholder="请输入" />
              </a-form-item>
            </a-col>
            <a-col :xl="8" :md="12" :sm="24">
              <a-form-item label="访问时间">
                <a-range-picker
                  v-model="searchTimeValue"
                  show-time
                  :placeholder="['Start Time', 'End Time']"
                  format="YYYY-MM-DD HH:mm:ss"
                  style="width: 100%"
                  @change="onTimeChange"
                />
              </a-form-item>
            </a-col>
          </template>

          <a-col :xl="8" :md="12" :sm="24">
            <a-form-item :wrapper-col="{flex: '1 1 0'}" class="search-actions-wrapper">
              <a-space size="middle">
                <a-space>
                  <a-button type="primary" :loading="searchFormState.loading" @click="searchFormState.reloadTable(true)">查询</a-button>
                  <a-button @click="searchFormState.resetSearchForm() && resetSearchTime()">重置</a-button>
                </a-space>
                <a @click="searchFormState.toggleSearchCollapsed">
                  {{ searchFormState.collapsed ? '展开': '收起' }}
                  <a-icon :type="searchFormState.collapsed ? 'down': 'up'" />
                </a>
              </a-space>
            </a-form-item>
          </a-col>
        </a-row>
      </template>

      <!-- 数据表格区域 -->
      <template #type-slot="text">
        <dict-tag dict-code="operation_type" :value="text" />
      </template>
      <template #status-slot="text">
        <dict-text dict-code="log_status" :value="text" />
      </template>
      <template #expandedRowRender="record">
        <p>params:</p>
        <pre><span class="wordwrap">{{ record.params }}</span></pre>
        <p>userAgent:</p>
        <pre><span class="wordwrap">{{ record.params }}</span></pre>
        {{ record.userAgent }}
      </template>
    </pro-table>
  </div>
</template>

<script>
import { getPage } from '@/api/log/operation-log'
import ProTable from '@/components/Table/ProTable'

export default {
  name: 'OperationLogPage',
  components: { ProTable },
  data() {
    return {
      rowKey: 'id',
      tableRequest: (requestParam) => {
        if (this.searchTimeValue && this.searchTimeValue.length === 2){
          requestParam = Object.assign({}, requestParam, {
            startTime: this.searchTimeValue[0],
            endTime: this.searchTimeValue[1]
          })
        }
        return getPage(requestParam)
      },

      columns: [
        {
          title: '追踪ID',
          dataIndex: 'traceId',
          width: '205px'
        },
        {
          title: '日志消息',
          dataIndex: 'msg',
          ellipsis: true,
          width: '120px'
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
          customRender: function(text) {
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
      ],

      // 查询时间
      searchTimeValue: []
    }
  },
  methods: {
    onTimeChange(dates, dateStrings) {
      this.searchTimeValue = dateStrings
    },
    resetSearchTime(){
      this.searchTimeValue = []
    }
  }
}
</script>

<style></style>
