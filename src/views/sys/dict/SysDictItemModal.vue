<template>
  <a-modal
    :title="dictName+'-数据字典项'"
    :visible="visible"
    @ok="handleOk"
    @cancel="handleClose"
    :confirmLoading="confirmLoading"
    :maskClosable="false"
    :footer="null"
    :bodyStyle="{padding:'12px 18px'}"
    width="75%"
    :centered="true"
  >
    <div v-show="tableShow">
      <!-- 操作按钮区域 -->
      <div style="padding-bottom: 10px">
        <a-button v-has="'sys:dict:add'" type="primary" icon="plus" @click="handleAdd(dictCode)">新建</a-button>
      </div>

      <!--数据表格区域-->
      <a-table
        ref="table"
        size="small"
        :rowKey="rowKey"
        :columns="columns"
        :dataSource="dataSource"
        :pagination="pagination"
        :loading="loading"
        @change="handleTableChange"
      >
        <template #action-slot="text, record">
          <a v-has="'sys:dict:edit'" @click="handleEdit(record)">编辑</a>
          <a-divider type="vertical"/>
          <a-popconfirm v-has="'sys:dict:del'"
                        title="确认要删除吗？"
                        @confirm="() => handleDel(record)">
            <a href="javascript:;">删除</a>
          </a-popconfirm>
        </template>
      </a-table>
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
import { TablePageMixin } from '@/mixins'

export default {
  name: 'DictItemModal',
  mixins: [TablePageMixin],
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
          title: '#',
          dataIndex: 'id',
          width: '45px'
        },
        {
          title: '字典标识',
          dataIndex: 'dictCode'
        },
        {
          title: '文本值',
          dataIndex: 'name'
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
          width: '100px',
          scopedSlots: { customRender: 'action-slot' }
        }
      ]
    }
  },
  methods: {
    show (record) {
      this.tableShow = true
      this.visible = true
      this.dictName = record.title
      this.dictCode = record.code
      this.queryParam = {
        'dictCode': this.dictCode
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
