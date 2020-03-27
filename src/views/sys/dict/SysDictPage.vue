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
            <a-col :md="8" :sm="24">
              <a-form-item lable="字典类型">
                <a-select placeholder="字典类型">
                  <a-select-option v-for="item in dictTypeSelectData" :key="item.value"
                  >{{item.name}}
                  </a-select-option
                  >
                </a-select>
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

      <!-- 操作按钮区域 -->
      <div class="table-operator">
        <a-button v-has="'sys:dict:add'" type="primary" icon="plus" @click="handleAdd()">新建</a-button>
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
          <span slot="type-slot" slot-scope="text">
            <a-tag :color="text|typeColorFilter">{{text|typeTextFilter}}</a-tag>
          </span>

          <span slot="action-slot" slot-scope="text, record">
            <template>
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
          </span>
        </a-table>
      </div>
    </a-card>

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
import { getPage, delObj, getDictSelectData } from '@/api/sys/sysdict'
import FormPage from './SysDictForm'
import { PageMixin } from '@/mixins'
import DictItemModal from './SysDictItemModal'

const typeMap = {
  1: {
    color: 'orange',
    text: '系统类'
  },
  2: {
    color: 'green',
    text: '业务类'
  }
}

export default {
  name: 'SysDictPage',
  mixins: [PageMixin],
  components: { DictItemModal, FormPage },
  data () {
    return {
      getPage: getPage,
      delObj: delObj,

      columns: [
        {
          title: '编号',
          dataIndex: 'id'
        },
        {
          title: '标识',
          dataIndex: 'code'
        },
        {
          title: '名称',
          dataIndex: 'name'
        },
        {
          title: '字典类型',
          dataIndex: 'type',
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
          width: '150px',
          scopedSlots: { customRender: 'action-slot' }
        }
      ],

      itemModalInited: false,
      dictTypeSelectData: []
    }
  },
  filters: {
    typeTextFilter (type) {
      return typeMap[type].text
    },
    typeColorFilter (type) {
      return typeMap[type].color
    }
  },
  created () {
    this.loadData()
    this.initDictTypeSelectData();
  },
  methods: {
    initDictTypeSelectData(){
      getDictSelectData("dict_type").then(res => {
        if(res.code === 200){
          this.dictTypeSelectData = res.data
        }else{
          this.$message.warning(e.message)
        }
      });
    },
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
