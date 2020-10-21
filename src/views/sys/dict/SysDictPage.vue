<template>
  <div class="ant-pro-page-container-children-content">
    <div v-show="tableShow">
      <!-- 查询条件 -->
      <div class="ant-pro-table-search">
        <a-form v-bind="searchFormLayout">
          <a-row :gutter="16">
            <a-col :md="8" :sm="24">
              <a-form-item label="ID">
                <a-input v-model="queryParam.id" placeholder=""/>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item label="字典属性">
                <dict-select dict-code="dict_property"
                             placeholder="字典属性"
                             v-model="queryParam.editable">
                </dict-select>
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
          <div class="ant-pro-table-toolbar-title">数据字典</div>
          <div class="ant-pro-table-toolbar-option">
            <a-button v-has="'sys:dict:add'" type="primary" icon="plus" @click="handleAdd()">新建</a-button>
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
            <template #type-slot="text">
              <dict-slot dict-code="dict_property" :value="text"/>
            </template>

            <template #action-slot="text, record">
              <a v-has="'sys:dict:edit'" @click="handleEdit(record)">编辑</a>
              <a-divider type="vertical"/>
              <a-popconfirm v-has="'sys:dict:del'"
                            title="确认要删除吗？"
                            @confirm="() => handleDel(record)">
                <a href="javascript:;">删除</a>
              </a-popconfirm>
              <a-divider type="vertical"/>
              <a @click="handleShowItem(record)">字典项</a>
            </template>
          </a-table>
        </div>
      </a-card>
    </div>

    <!--表单页面-->
    <a-card v-if="formInited" :bordered="false" :title="cardTitle" v-show="!tableShow">
      <form-page ref="formPage" @backToPage="backToPage"></form-page>
    </a-card>


    <!--字典项-->
    <div v-if="itemModalInited">
      <dict-item-modal ref="dictItemModal"></dict-item-modal>
    </div>

  </div>
</template>

<script>
import { getPage, delObj } from '@/api/sys/sysdict'
import FormPage from './SysDictForm'
import { TablePageMixin } from '@/mixins'
import DictItemModal from './SysDictItemModal'

export default {
  name: 'SysDictPage',
  mixins: [TablePageMixin],
  components: { DictItemModal, FormPage },
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
          title: '标识',
          dataIndex: 'code'
        },
        {
          title: '名称',
          dataIndex: 'title'
        },
        {
          title: '属性',
          dataIndex: 'editable',
          scopedSlots: { customRender: 'type-slot' }
        },
        {
          title: '备注',
          dataIndex: 'remarks'
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
          width: '165px',
          scopedSlots: { customRender: 'action-slot' }
        }
      ],

      itemModalInited: false,
      dictCodes: ['dict_property']
    }
  },
  methods: {
    handleShowItem (record) {
      if (!this.itemModalInited) {
        this.itemModalInited = true
      }
      this.$nextTick(function () {
        this.$refs.dictItemModal.show(record)
      })
    }
  }
}
</script>
