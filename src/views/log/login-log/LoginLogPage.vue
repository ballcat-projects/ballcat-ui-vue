<template>
  <div class="ant-pro-page-container-children-content">

    <pro-table
      ref="table"
      toolbar-title="登陆日志"
      :row-key="rowKey"
      :request="tableRequest"
      :columns="columns"
      :scroll="{ x: 1000 }"
    >
      <!-- 查询表单 -->
      <template #search-form="searchFormState">
        <a-row :gutter="16">
          <a-col :xl="8" :md="12" :sm="24">
            <a-form-item label="用户名">
              <a-input v-model="searchFormState.queryParam.username" placeholder="请输入" />
            </a-form-item>
          </a-col>
          <a-col :xl="8" :md="12" :sm="24">
            <a-form-item label="登陆IP">
              <a-input v-model="searchFormState.queryParam.ip" placeholder="请输入" />
            </a-form-item>
          </a-col>
          <template v-if="!searchFormState.collapsed">
            <a-col :xl="8" :md="12" :sm="24">
              <a-form-item label="事件类型">
                <dict-select v-model="searchFormState.queryParam.eventType" dict-code="login_event_type" />
              </a-form-item>
            </a-col>
            <a-col :xl="8" :md="12" :sm="24">
              <a-form-item label="事件状态">
                <dict-select v-model="searchFormState.queryParam.status" dict-code="log_status" />
              </a-form-item>
            </a-col>
            <a-col :xl="8" :md="12" :sm="24">
              <a-form-item label="登陆时间">
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
      <template #status-slot="text">
        <dict-text dict-code="log_status" :value="text" />
      </template>
      <template #event-type-slot="text">
        <dict-tag dict-code="login_event_type" :value="text" />
      </template>
    </pro-table>


  </div>
</template>

<script>
import { getPage } from '@/api/log/login-log'
import ProTable from '@/components/Table/ProTable'

export default {
  name: 'LoginLogPage',
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
          width: 205
        },
        {
          title: '用户名',
          dataIndex: 'username',
          width: 100,
          ellipsis: true
        },
        {
          title: '事件',
          dataIndex: 'eventType',
          align: 'center',
          width: 60,
          scopedSlots: { customRender: 'event-type-slot' }
        },
        {
          title: '登陆IP',
          dataIndex: 'ip',
          width: 120
        },
        {
          title: '浏览器',
          dataIndex: 'browser',
          width: 100,
          ellipsis: true
        },
        {
          title: '操作系统',
          dataIndex: 'os',
          width: 110,
          ellipsis: true
        },
        {
          title: '操作信息',
          dataIndex: 'msg',
          width: 180,
          ellipsis: true
        },
        {
          title: '状态',
          dataIndex: 'status',
          width: 50,
          scopedSlots: { customRender: 'status-slot' }
        },
        {
          title: '登录/登出时间',
          dataIndex: 'loginTime',
          width: 150,
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
