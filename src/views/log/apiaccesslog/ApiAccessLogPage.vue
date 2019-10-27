<template>
  <div>
    <a-card v-show="tableShow" :bordered="false">
      <!-- 查询条件 -->
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="48">
            <a-col :md="8" :sm="24">
              <a-form-item label="ID">
                <a-input v-model="queryParam.id" placeholder=""/>
              </a-form-item>
            </a-col>

            <!-- <template v-if="advanced">
             </template>-->
            <a-col :md="!advanced && 8 || 24" :sm="24">
              <span class="table-page-search-submitButtons"
                    :style="advanced && { float: 'right', overflow: 'hidden' } || {} ">
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
          :loading ="loading"
          :bordered="true"
          @change="handleTableChange"
        >
          <span slot="expandedRowRender" slot-scope="record" style="margin: 0">
            <p>reqParams:</p><pre v-html="record.params"></pre>
            <p>reqBody:</p><pre v-html="record.reqBody"></pre>
            <p>userAgent:</p>{{record.userAgent}}}
          </span>
        </a-table>
      </div>
    </a-card>

  </div>
</template>

<script>
import { getPage } from '@/api/log/apiaccesslog'
import { PageMixin } from '@/mixins'

export default {
  name: 'ApiAccessLogPage',
  mixins: [PageMixin],
  data () {
    return {
      getPage: getPage,

      columns: [
        {
          title: '编号',
          dataIndex: 'id',
          align: 'center'
        },
        {
          title: '用户ID',
          dataIndex: 'userId',
          align: 'center'
        },
        {
          title: '用户名',
          dataIndex: 'username',
          align: 'center'
        },
        {
          title: '访问IP地址',
          dataIndex: 'ip',
          align: 'center'
        },

        {
          title: '请求URI',
          dataIndex: 'uri',
          align: 'center'
        },
        {
          title: '操作方式',
          dataIndex: 'method',
          align: 'center'
        },

        {
          title: '响应状态码',
          dataIndex: 'httpStatus',
          align: 'center'
        },
        {
          title: '错误消息',
          dataIndex: 'errorMsg',
          align: 'center'
        },
        {
          title: '执行时长',
          dataIndex: 'time',
          align: 'center'
        },
        {
          title: '创建时间',
          dataIndex: 'createTime',
          align: 'center',
          width: '180px',
          sorter: true
        }
      ]
    }
  },
  methods: {}
}
</script>
