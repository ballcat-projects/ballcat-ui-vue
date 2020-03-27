<template>
  <a-modal
    :title="dictName+'-数据字典项'"
    :visible="visible"
    @ok="handleOk"
    @cancel="handleClose"
    :confirmLoading="confirmLoading"
    :maskClosable="false"
    :footer="null"
    :bodyStyle="{padding:'12px 24px'}"
    width="75%"
    :centered="true"
  >
    <div v-show="tableShow">
      <!-- 操作按钮区域 -->
      <div style="padding-bottom: 10px">
        <a-button v-has="'sys:dict:add'" type="primary" icon="plus" @click="handleAdd(dictCode)">新建</a-button>
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
          <span slot="action-slot" slot-scope="text, record">
            <template>
              <a v-has="'sys:dict:edit'" @click="handleEdit(record)">编辑</a>
              <a-divider type="vertical"/>
              <a-popconfirm v-has="'sys:dict:del'"
                            title="确认要删除吗？"
                            @confirm="() => handleDel(record)">
                <a href="javascript:;">删除</a>
              </a-popconfirm>
            </template>
          </span>
        </a-table>
      </div>
    </div>

    <!--表单页面-->
    <div v-if="formInited">
      <form-page v-show="!tableShow" ref="formPage" @backToPage="backToPage"></form-page>
    </div>

  </a-modal>
</template>

<script>
import { getPage, delObj } from '@/api/sys/sysdictitem'
import FormPage from './SysDictItemForm'
import { PageMixin } from '@/mixins'

export default {
  name: 'DictItemModal',
  mixins: [PageMixin],
  components: { FormPage },
  data () {
    return {
      confirmLoading: false,
      visible: false,

      dictName: '',
      dictCode: '',
      queryParam: {},
      lazyLoad: true,

      getPage: getPage,
      delObj: delObj,

      columns: [
        {
          title: 'ID',
          dataIndex: 'id',
          width: '45px',
        },
        {
          title: '字典标识',
          dataIndex: 'dictCode'
        },
        {
          title: '标签',
          dataIndex: 'label'
        },
        {
          title: '数据值',
          dataIndex: 'value'
        },
        {
          title: '排序',
          dataIndex: 'sort',
          width: '45px',
          align: 'center'
        },
        {
          title: '备注',
          dataIndex: 'remarks',
          width: '250px',
          ellipsis: true
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
          width: '120px',
          scopedSlots: { customRender: 'action-slot' }
        }
      ]
    }
  },
  methods: {
    show (record) {
      this.visible = true
      this.dictName = record.name
      this.dictCode = record.code
      this.queryParam = {
        "dictCode": this.dictCode
      }
      this.loadData()
    },
    handleOk (e) {
      this.confirmLoading = true
    },
    handleClose (e) {
      this.visible = false
      this.confirmLoading = false
    }
  }
}
</script>
