<template>
  <a-modal
    :title="'字典项：'+dictName"
    :visible="visible"
    :mask-closable="false"
    :body-style="{padding:'15px 18px'}"
    :confirm-loading="confirmLoading"
    :footer="null"
    :width="800"
    :centered="true"
    @ok="handleOk"
    @cancel="handleClose"
  >
    <div v-show="tableShow">
      <pro-table
        ref="table"
        :row-key="rowKey"
        :request="tableRequest"
        :columns="columns"
        default-sort-field="sort"
        default-sort-order="asc"
        :card-props="{bodyStyle : {padding: 0}}"
        :lazy-load="true"
      >
        <!-- 操作按钮区域 -->
        <template #toolbar-title>
          <a-button
            v-has="'system:dict:add'"
            type="primary"
            icon="plus"
            @click="handleAdd(dictCode)"
          >新建
          </a-button>
        </template>

        <!--数据表格区域-->
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

        <!-- 状态 slot -->
        <template #status-slot="text, record">
          <a-switch
            :checked="record.status === 1"
            :disabled="!$has('system:dict:edit')"
            @change="(checked) => handleUpdateStatus(record, checked)"
          >
            <a-icon slot="checkedChildren" type="check" />
            <a-icon slot="unCheckedChildren" type="close" />
          </a-switch>
        </template>
      </pro-table>
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
import { getPage, delObj, updateStatus } from '@/api/system/dict-item'
import SysDictItemPageForm from '@/views/system/dict/SysDictItemPageForm'
import ProTable from '@/components/Table/ProTable'
import { doRequest } from '@/utils/request'

export default {
  name: 'DictItemModal',
  components: { ProTable, SysDictItemPageForm },
  data () {
    return {
      confirmLoading: false,
      visible: false,

      dictName: '',
      dictCode: '',
      tableShow: true,

      rowKey: 'id',
      tableRequest: (requestParam) => {
        return getPage(Object.assign({}, requestParam, { dictCode: this.dictCode }))
      },

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
          title: '状态',
          dataIndex: 'status',
          width: 80,
          scopedSlots: { customRender: 'status-slot' },
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
          width: 150,
          sorter: true
        },
        {
          key: 'operate',
          title: '操作',
          align: 'center',
          width: 100,
          scopedSlots: { customRender: 'action-slot' }
        }
      ],

      sortField: 'sort',
      sortOrder: 'asc'
    }
  },
  methods: {
    // 刷新表格
    reloadPageTable (withFirstPage = true) {
      this.$refs.table.reloadTable(withFirstPage)
    },
    show (record) {
      this.tableShow = true
      this.visible = true
      this.dictName = record.title
      this.dictCode = record.code
      this.$nextTick(() => {
        this.reloadPageTable()
      })
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
    },
    // 删除
    handleDel (record) {
      doRequest(delObj(record[this.rowKey]), {
        onSuccess: () => {
          this.reloadPageTable(false)
        }
      })
    },
    // 更新状态
    handleUpdateStatus(record, checked) {
      let status = checked ? 1 : 0
      doRequest(updateStatus(record[this.rowKey], status), {
        onSuccess: () => {
          record.status = status
        }
      })
    },
    // 切换表格/表单
    switchPage () {
      window.scrollTo(0, 0)
      this.tableShow = !this.tableShow
    },
    // 返回表格
    backToPage (needRefresh) {
      this.switchPage()
      needRefresh && this.reloadPageTable(false)
    }
  }
}
</script>

<style scoped>
/** 保证切换时的高度不要相差太多 */
:deep(.ant-table-content) {
  height: 400px;
  overflow: auto;
}
</style>
