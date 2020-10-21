<template>
  <div class="ant-pro-page-container-children-content">
    <div v-show="tableShow">
      <!-- 查询条件 -->
      <div class="ant-pro-table-search">
        <a-form v-bind="searchFormLayout">
          <a-row :gutter="16">
            <a-col :md="8" :sm="24">
              <a-form-item label="关键字">
                <a-input v-model="queryParam.keyword" placeholder=""/>
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

      <a-card :bordered="false" :bodyStyle="{padding: 0}">
        <!-- 操作按钮区域 -->
        <div class="ant-pro-table-toolbar">
          <div class="ant-pro-table-toolbar-title">LOV</div>
          <div class="ant-pro-table-toolbar-option">
            <a-button v-has="'sys:lov:add'" type="primary" icon="plus" @click="handleAdd()">新建</a-button>
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
            :pagination="pagination"
            :loading="loading"
            @change="handleTableChange"
          >
            <template #action-slot="text, record">
              <a v-has="'sys:lov:edit'" @click="handleEdit(record)">编辑</a>
              <a-divider type="vertical"/>
              <a-popconfirm v-has="'sys:lov:del'"
                            title="确认要删除吗？"
                            @confirm="() => handleDel(record)">
                <a href="javascript:;">删除</a>
              </a-popconfirm>
            </template>
          </a-table>
        </div>
      </a-card>
    </div>

    <!--表单页面-->
    <a-card v-if="formInited" :bordered="false" :title="cardTitle" v-show="!tableShow">
      <form-page ref="formPage" @backToPage="backToPage"></form-page>
    </a-card>
  </div>
</template>

<script>
import { delObj, getPage } from '@/api/sys/lov'
import FormPage from './LovForm'
import { TablePageMixin } from '@/mixins'

export default {
  name: 'SysLovPage',
  components: { FormPage },
  mixins: [TablePageMixin],
  data () {
    return {
      getPage: getPage,
      delObj: delObj,
      columns: [
        {
          title: '关键字',
          dataIndex: 'keyword'
        },
        {
          title: '请求路径',
          dataIndex: 'url'
        },
        {
          title: '请求方式',
          dataIndex: 'method'
        },
        {
          title: '多选',
          dataIndex: 'multiple',
          customRender: (text, record, index) => {
            return text ? '是' : '否'
          }
        },
        {
          title: '搜索框',
          dataIndex: 'search',
          customRender: (text, record, index) => {
            return text ? '是' : '否'
          }
        },
        {
          title: '返回数据',
          dataIndex: 'ret',
          customRender: (text, record, index) => {
            return text ? '是' : '否'
          }
        },
        {
          title: '更新时间',
          dataIndex: 'updateTime',
          width: '150px',
          sorter: true
        },
        {
          title: '创建时间',
          dataIndex: 'createTime',
          width: '150px',
          sorter: true
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
  methods: {}
}
</script>
