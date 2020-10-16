<template>
  <div>
    <a-card v-show="tableShow" :bordered="false">
      <!-- 查询条件 -->
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="48">
            <a-col :md="8" :sm="24">
              <a-form-item label="用户名">
                <a-input v-model="queryParam.username" placeholder="用户名"/>
              </a-form-item>
            </a-col>
            <template v-if="advanced">
              <a-col :md="8" :sm="24">
                <a-form-item label="事件类型">
                  <dict-select dict-code="login_event_type" v-model="queryParam.eventType"></dict-select>
                </a-form-item>
              </a-col>
              <a-col :md="8" :sm="24">
                <a-form-item label="事件状态">
                  <dict-select dict-code="log_status" v-model="queryParam.status"></dict-select>
                </a-form-item>
              </a-col>
              <a-col :md="8" :sm="24">
                <a-form-item label="登陆IP">
                  <a-input v-model="queryParam.ip" placeholder="登陆IP"/>
                </a-form-item>
              </a-col>
            </template>

            <a-col :md="10" :sm="24">
              <a-form-item label="登陆时间">
                <a-range-picker
                  show-time
                  :placeholder="['Start Time', 'End Time']"
                  format="YYYY-MM-DD HH:mm:ss"
                  @change="onTimeChange"
                />
              </a-form-item>
            </a-col>

            <a-col :md="!advanced && 3 || 24" :sm="24">
              <span class="table-page-search-submitButtons"
                    :style="advanced && { float: 'right', overflow: 'hidden' } || {} ">
                <a-button type="primary" @click="reloadTable">查询</a-button>
                <a-button style="margin-left: 8px" @click="resetSearchForm">重置</a-button>
                <a @click="toggleAdvanced" style="margin-left: 8px">
                  {{ advanced ? '收起' : '展开' }}
                  <a-icon :type="advanced ? 'up' : 'down'"/>
                </a>
              </span>
            </a-col>
          </a-row>
        </a-form>
      </div>

      <!-- 操作按钮区域 -->
      <div class="table-operator">
        <a-button v-has="'log:loginlog:add'" type="primary" icon="plus" @click="handleAdd()">新建</a-button>
      </div>

      <!--数据表格区域-->
      <div class="table-wrapper">
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
          <template #status-slot="text">
            <dict-text dict-code="log_status" :value="text"/>
          </template>
          <template #event-type-slot="text">
            <dict-slot dict-code="login_event_type" :value="text"/>
          </template>

          <template slot="action-slot" slot-scope="text, record">
            <a v-has="'log:loginlog:edit'" @click="handleEdit(record)">编辑</a>
            <a-divider type="vertical"/>
            <a-popconfirm v-has="'log:loginlog:del'"
                          title="确认要删除吗？"
                          @confirm="() => handleDel(record)">
              <a href="javascript:">删除</a>
            </a-popconfirm>
          </template>
        </a-table>
      </div>
    </a-card>
  </div>
</template>

<script>
import { getPage, delObj } from '@/api/log/adminloginlog'
import { TablePageMixin } from '@/mixins'

export default {
  name: 'AdminLoginLogPage',
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
          title: '追踪ID',
          dataIndex: 'traceId'
        },
        {
          title: '用户名',
          dataIndex: 'username'
        },
        {
          title: '事件类型',
          dataIndex: 'eventType',
          scopedSlots: { customRender: 'event-type-slot' },
          width: '80px'
        },
        {
          title: '登陆IP',
          dataIndex: 'ip'
        },
        {
          title: '浏览器',
          dataIndex: 'browser'
        },
        {
          title: '操作系统',
          dataIndex: 'os'
        },
        {
          title: '操作信息',
          dataIndex: 'msg'
        },
        {
          title: '状态',
          dataIndex: 'status',
          width: '50px',
          scopedSlots: { customRender: 'status-slot' }
        },
        {
          title: '登录/登出时间',
          dataIndex: 'loginTime',
          width: '150px',
          sorter: true
        }
      ]
    }
  },
  methods: {
    onTimeChange(dates, dateStrings) {
      console.log(dates)
      this.queryParam.startTime = dateStrings[0]
      this.queryParam.endTime = dateStrings[1]
    }
  }
}
</script>
