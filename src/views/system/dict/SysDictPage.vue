<template>
  <div class="ant-pro-page-container-children-content">

    <ProTable
      ref="table"
      toolbar-title="数据字典"
      :row-key="rowKey"
      :columns="columns"
      :request="tableRequest"
      :scroll="{ x: 800 }"
    >
      <!-- 查询表单 -->
      <template #search-form="searchFormState">
        <a-row :gutter="16">
          <a-col :md="8" :sm="24">
            <a-form-item label="字典标识">
              <a-input v-model="searchFormState.queryParam.code" placeholder="字典标识" />
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="24">
            <a-form-item label="字典标题">
              <a-input v-model="searchFormState.queryParam.title" placeholder="字典标题" />
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="24" class="table-page-search-wrapper">
            <a-form-item :wrapper-col="{flex: '1 1 0'}" class="search-actions-wrapper">
              <a-space>
                <a-button type="primary" :loading="searchFormState.loading" @click="searchFormState.reloadTable(true)">查询</a-button>
                <a-button @click="searchFormState.resetSearchForm">重置</a-button>
              </a-space>
            </a-form-item>
          </a-col>
        </a-row>
      </template>

      <!-- 操作按钮区域 -->
      <template #toolbar-action>
        <a-button
          v-has="'system:dict:add'"
          type="primary"
          icon="plus"
          @click="handleAdd()"
        >新建</a-button>
      </template>

      <!--数据表格区域-->
      <template #type-slot="text">
        <dict-tag dict-code="dict_property" :value="text" />
      </template>
      <template #action-slot="text, record">
        <a v-has="'system:dict:edit'" @click="handleEdit(record)">编辑</a>
        <a-divider type="vertical" />
        <a @click="handleShowItem(record)">字典项</a>
        <a-divider type="vertical" />
        <a-popconfirm v-has="'system:dict:del'" title="确认要删除吗？" @confirm="() => handleDel(record)">
          <a href="javascript:" class="ballcat-text-danger">删除</a>
        </a-popconfirm>
      </template>
    </ProTable>

    <!--表单弹窗-->
    <sys-dict-modal-form ref="formModal" @reload-page-table="reloadPageTable" />

    <!--字典项-->
    <dict-item-modal ref="dictItemModal" />
  </div>
</template>

<script>
import { getPage, delObj } from '@/api/system/dict'
import DictItemModal from './SysDictItemModal'
import SysDictModalForm from '@/views/system/dict/SysDictModalForm'
import ProTable from '@/components/Table/ProTable'

export default {
  name: 'SysDictPage',
  components: { ProTable, SysDictModalForm, DictItemModal },
  data() {
    return {
      rowKey: 'id',
      tableRequest: getPage,

      columns: [
        {
          title: '标识',
          dataIndex: 'code',
          width: 180,
          ellipsis: true
        },
        {
          title: '标题',
          dataIndex: 'title',
          width: 180,
          ellipsis: true
        },
        {
          title: '属性',
          dataIndex: 'editable',
          width: 60,
          scopedSlots: { customRender: 'type-slot' }
        },
        {
          title: '备注',
          dataIndex: 'remarks',
          width: 250,
          ellipsis: true
        },
        {
          title: '创建时间',
          dataIndex: 'createTime',
          width: 150,
          sorter: true
        },
        {
          title: '操作',
          align: 'center',
          width: 160,
          scopedSlots: { customRender: 'action-slot' }
        }
      ],

      itemModalInited: false,
      dictCodes: ['dict_property']
    }
  },
  methods: {
    // 刷新表格
    reloadPageTable(withFirstPage = true) {
      this.$refs.table.reloadTable(withFirstPage)
    },
    // 新建字典
    handleAdd() {
      this.$refs.formModal.add({ title: '新建字典' })
    },
    // 编辑字典
    handleEdit(record) {
      this.$refs.formModal.update(record, { title: '编辑字典' })
    },
    // 删除
    handleDel (record) {
      delObj(record[this.rowKey]).then(res => {
        if (res.code === 200) {
          this.$message.success(res.message)
          this.$refs.table.reloadTable(false)
        } else {
          this.$message.error(res.message)
        }
      }).catch((e) => {
        // 未被 axios拦截器处理过，则在这里继续处理
        !e.resolved && this.$message.error(e.message || 'error request')
      })
    },
    // 字典项表格弹窗
    handleShowItem(record) {
      this.$refs.dictItemModal.show(record)
    }
  }
}
</script>
