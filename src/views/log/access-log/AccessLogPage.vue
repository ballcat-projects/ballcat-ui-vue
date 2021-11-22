<template>
  <div class="ant-pro-page-container-children-content">

    <pro-table
      ref="table"
      toolbar-title="访问日志"
      :row-key="rowKey"
      :request="tableRequest"
      :columns="columns"
      :scroll="{ x: 1000 }"
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
              <a-form-item label="状态码">
                <a-input-number v-model="searchFormState.queryParam.httpStatus" style="width: 100%" placeholder="请输入" />
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
                  <a-button @click="searchFormState.resetSearchForm && resetSearchTime()">重置</a-button>
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
      <template #expandedRowRender="record">
        <p>reqParams:</p>
        <pre><span class="wordwrap">{{ record.reqParams }}</span></pre>
        <p>reqBody:</p>
        <pre><span class="wordwrap">{{ record.reqBody }}</span></pre>
        <p>result:</p>
        <pre><span class="wordwrap">{{ record.result }}</span></pre>
        <p>userAgent:</p>
        {{ record.userAgent }}}
      </template>
    </pro-table>
  </div>
</template>

<script>
import { getPage } from '@/api/log/access-log'
import ProTable from '@/components/Table/ProTable'

export default {
  name: 'AccessLogPage',
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
          title: '用户名',
          dataIndex: 'username'
        },
        {
          title: '请求IP',
          dataIndex: 'ip',
          width: '120px'
        },
        {
          title: '请求URI',
          dataIndex: 'uri',
          width: 200,
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
          title: '状态码',
          dataIndex: 'httpStatus'
        },
        {
          title: '错误消息',
          dataIndex: 'errorMsg',
          ellipsis: true
        },
        {
          title: '访问时间',
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
