<template>
  <a-modal
    :title="'字典项：'+dictName"
    :visible="visible"
    :mask-closable="false"
    :body-style="{padding:'12px 18px'}"
    :confirm-loading="confirmLoading"
    :footer="null"
    :width="800"
    :centered="true"
    @ok="handleOk"
    @cancel="handleClose"
  >
    <div v-show="tableShow">
      <!-- 操作按钮区域 -->
      <div style="padding-bottom: 10px">
        <a-button
          v-has="'system:dict:add'"
          type="primary"
          icon="plus"
          @click="handleAdd(dictCode)"
        >新建</a-button>
      </div>

      <!--数据表格区域-->
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
        <template #action-slot="text, record">
          <a v-has="'system:dict:edit'" @click="handleEdit(record)">编辑</a>
          <a-divider type="vertical" />
          <a-popconfirm
            v-has="'system:dict:del'"
            title="确认要删除吗？"
            @confirm="() => handleDel(record)"
          >
            <a href="javascript:" class="ballcat-text-danger">删除</a>
          </a-popconfirm>
        </template>
      </a-table>
    </div>

    <!--表单页面-->
    <sys-dict-item-page-form
      v-show="!tableShow"
      ref="pageForm"
      @back-to-page="backToPage"
    />
  </a-modal>
</template>

<script>
import { getPage, delObj } from '@/api/system/dict-item'
import SysDictItemPageForm from '@/views/system/dict/SysDictItemPageForm'
import { TablePageMixin } from '@/mixins'

export default {
  name: 'DictItemModal',
  components: { SysDictItemPageForm },
  mixins: [TablePageMixin],
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
          align: 'center',
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
    },
    // 新增
    handleAdd () {
      this.switchPage()
      const attributes = { title: '新建字典项：' + this.dictName, dictCode: this.dictCode }
      this.$refs.pageForm.add(attributes)
    },
    // 编辑
    handleEdit (record) {
      this.switchPage()
      this.$refs.pageForm.update(record, { title: '编辑字典项：' + this.dictName })
    }
  }
}
</script>

<style scoped>
/** 保证切换时的高度不要相差太多 */
/deep/ .ant-table-content {
  height: 400px;
}
</style>
