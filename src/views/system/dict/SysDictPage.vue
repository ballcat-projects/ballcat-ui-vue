<template>
  <div class="ant-pro-page-container-children-content">
    <!-- 查询条件 -->
    <div class="ant-pro-table-search">
      <a-form v-bind="searchFormLayout">
        <a-row :gutter="16">
          <a-col :md="8" :sm="24">
            <a-form-item label="字典标识">
              <a-input v-model="queryParam.code" placeholder="字典标识" />
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="24">
            <a-form-item label="字典标题">
              <a-input v-model="queryParam.title" placeholder="字典标题" />
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


    <a-card :bordered="false" :body-style="{paddingTop: 0, paddingBottom: 0}">
      <!-- 操作按钮区域 -->
      <div class="ant-pro-table-toolbar">
        <div class="ant-pro-table-toolbar-title">数据字典</div>
        <div class="ant-pro-table-toolbar-option">
          <a-button
            v-has="'system:dict:add'"
            type="primary"
            icon="plus"
            @click="handleAdd()"
          >新建</a-button>
        </div>
      </div>

      <!--数据表格区域-->
      <div class="ant-pro-table-wrapper">
        <a-table
          ref="table"
          size="middle"
          :row-key="rowKey"
          :columns="columns"
          :data-source="dataSource"
          :pagination="pagination"
          :loading="loading"
          :scroll="{x : 800}"
          @change="handleTableChange"
        >
          <template #type-slot="text">
            <dict-slot dict-code="dict_property" :value="text" />
          </template>

          <template #action-slot="text, record">
            <a v-has="'system:dict:edit'" @click="handleEdit(record)">编辑</a>
            <a-divider type="vertical" />
            <a @click="handleShowItem(record)">字典项</a>
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
    </a-card>

    <!--表单弹窗-->
    <sys-dict-modal-form
      ref="formModal"
      @reload-page-table="reloadTable"
    />

    <!--字典项-->
    <dict-item-modal ref="dictItemModal" />
  </div>
</template>

<script>
import { getPage, delObj } from '@/api/system/dict'
import { TablePageMixin } from '@/mixins'
import DictItemModal from './SysDictItemModal'
import SysDictModalForm from '@/views/system/dict/SysDictModalForm'

export default {
  name: 'SysDictPage',
  components: { SysDictModalForm, DictItemModal },
  mixins: [TablePageMixin],
  data () {
    return {
      getPage: getPage,
      delObj: delObj,

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
    /**
     * 新建字典
     */
    handleAdd () {
      this.$refs.formModal.add({ title: '新建字典' })
    },
    /**
     * 编辑字典
     * @param record 当前组织属性
     */
    handleEdit (record) {
      this.$refs.formModal.update(record, { title: '编辑字典' })
    },
    /**
     * 字典项表格弹窗
     * @param record
     */
    handleShowItem (record) {
      this.$refs.dictItemModal.show(record)
    }
  }
}
</script>
