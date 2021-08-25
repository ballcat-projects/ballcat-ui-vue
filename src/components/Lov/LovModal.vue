<template>
  <a-modal
    :mask-closable="false"
    class="lov-model"
    :confirm-loading="loading"
    :centered="true"
    :title="enableI18n? $t(modalTitle): modalTitle"
    :width="modalWidth"
    :visible="modalVisible"
    :body-style="modalStyle"
    :closable="modalTitle && modalTitle.length > 0"
    @ok="handleChoose"
    @cancel="handleCancel"
  >

    <!-- 搜索表单部分渲染 -->
    <div v-if="searchOptions && searchOptions.length > 0" class="lov-search-wrapper">
      <a-form-model>
        <a-row :gutter="8">
          <a-col
            v-for="(item) in searchComponents"
            :key="item.field"
            :md="8"
            :sm="16"
          >
            <a-form-model-item
              :label="item.label"
              :label-col="{ span: 7 }"
              :wrapper-col="{ span: 16 }"
              style="height:30px"
            >
              <a-input
                v-if="item.type==='input'"
                v-model="queryParam[item.field]"
                :placeholder="item.placeholder"
              />
              <a-input-number
                v-if="item.type==='number-input'"
                v-model="queryParam[item.field]"
                style="width: 100%"
                :placeholder="item.placeholder"
                :min="item.min || 1"
                :max="item.max"
              />
              <a-select
                v-if="item.type==='select'"
                v-model="queryParam[item.field]"
                allow-clear
                :placeholder="item.placeholder"
                :options="item.options"
              />
              <dict-select
                v-if="item.type==='dict-select'"
                v-model="queryParam[item.field]"
                :placeholder="item.placeholder"
                :dict-code="item.dictCode"
              />
            </a-form-model-item>
          </a-col>
          <!-- 搜索控制按钮 -->
          <a-col
            :xs="8"
            :sm="4"
            :md="8"
            style="margin-top: 2px"
          >
            <div style="display:flex;">
              <a-button type="primary" style="margin-left:5%" @click="reloadTable">
                {{ enableI18n? $t('action.query'): '查询' }}
              </a-button>
              <a-button style="margin-left:8px" @click="resetSearchForm">
                {{ enableI18n? $t('action.reset'): '重置' }}
              </a-button>
            </div>
          </a-col>
        </a-row>
      </a-form-model>
    </div>

    <!-- 已选数据展示 -->
    <div class="lov-selected-pool-wrapper">
      <a-select
        class="lov-select"
        style="width: 100%"
        :value="selectedRowKeys"
        :open="false"
        :mode="multiple? 'tags' : 'default'"
        :options="selectOptions"
        :placeholder="enableI18n? $t('lov.selectedData') :'已选数据'"
        :show-search="false"
        @change="handleDeselect"
      />
    </div>

    <a-table
      ref="table"
      style="margin-top:-10px;"
      :size="tableSize"
      :row-key="rowKey"
      :columns="tableColumns"
      :data-source="dataSource"
      :pagination="false"
      :loading="loading"
      :row-selection="{
        selectedRowKeys,
        type: multiple ? 'checkbox':'radio',
        onChange: onSelectChange
      }"
      :custom-row="multiple? onClickRowMulti: onClickRow"
      @change="handleTableChange"
    />

    <template slot="footer">
      <div class="lov-pagination-wrapper">
        <a-pagination
          v-model="pagination.current"
          :total="pagination.total"
          :page-size.sync="pagination.pageSize"
          :show-total="pagination.showTotal"
          show-size-changer
          size="small"
          style="margin-left: 3%"
          @change="loadData"
        />
      </div>

      <a-button @click="handleCancel">
        {{ enableI18n? $t('action.cancel'): '取消' }}
      </a-button>
      <a-button type="primary" :loading="loading" @click="handleChoose">
        {{ enableI18n? $t('action.choose'): '选择' }}
      </a-button>
    </template>
  </a-modal>
</template>

<script>
import tablePageMixin from '@/mixins/tablePageMixin'
import { enableI18n } from '@/config/projectConfig'
import { littleCamelToUnderline } from '@/utils/strUtil'

export default {
  name: 'LovModal',
  mixins: [tablePageMixin],
  props: {
    // 是否多选
    multiple: {
      type: Boolean,
      default: false
    },

    // 表格数据唯一值对应的属性名
    dataKey: {
      type: String,
      required: true
    },

    // 自定义选择项的展示标题
    customOptionTitle: {
      type: Function,
      default (record) {
        return record[this.dataKey]
      }
    },

    // 弹出框的标题
    modalTitle: {
      type: String,
      default: ''
    },

    // 弹出框的宽度
    modalWidth: {
      type: String,
      default: '600px'
    },

    // 搜索组件
    searchOptions: {
      type: Array,
      default () {
        return []
      }
    },

    // 表格分页查询条件
    getPageData: {
      type: Function,
      required: true
    },

    // 表格列配置
    tableColumns: {
      type: Array,
      required: true
    },

    // 表格大小
    tableSize: {
      type: String,
      default: 'middle'
    }

  },
  data () {
    return {
      // 是否开启国际化
      enableI18n: enableI18n,
      // 弹出框的展示控制标识
      modalVisible: false,
      // 表格行的唯一标识
      rowKey: '$' + this.dataKey,
      // 默认排序字段
      sortField: littleCamelToUnderline(this.dataKey),
      // 表格分页 load 方法
      getPage: this.getPageData
    }
  },
  computed: {
    dataField () {
      return '$' + this.dataKey
    },
    selectOptions () {
      return this.selectedRows.map(x => {
        return {
          key: x[this.dataField],
          title: this.customOptionTitle(x)
        }
      })
    },
    modalStyle () {
      let screenHeight = document.body.clientHeight * 0.75
      return { padding: '0', maxHeight: screenHeight + 'px', overflowY: 'scroll' }
    },
    selectedValue () {
      return this.multiple ? this.selectedRowKeys : this.selectedRowKeys[0]
    },
    columns() {
      let columns = this.tableColumns
      if(enableI18n){
        columns = this.tableColumns.map(x => {
          let column = { ...x }
          column.title = this.$t(x.title)
          return column
        })
      }
      return columns
    },
    searchComponents() {
      let searchComponents = this.searchOptions
      if(enableI18n){
        searchComponents = this.searchOptions.map(x => {
          let components = { ...x }
          components.label = this.$t(x.label)
          components.placeholder = this.$t(x.placeholder)
          return components
        })
      }
      return searchComponents
    }
  },
  mounted () {
    // 禁止 select 框输入
    let element = document.querySelector('.lov-select .ant-select-search__field')
    element && ( element.readOnly = true )
  },
  methods: {
    /**
     * 分页查询成功回调
     * @param page
     */
    onPageLoadSuccess (page) {
      for (const record of page.records) {
        record[this.dataField] = String(record[this.dataKey])
      }
    },
    // ============ 模态框使用方法 ===========
    show (data) {
      this.selectedRowKeys = data.selectedValue ? [...data.selectedValue] : []
      this.selectedRows = data.selectedRows ? [...data.selectedRows] : []
      this.modalVisible = true
    },
    handleChoose () {
      this.$emit('lov-choose', {
        selectedValue: this.selectedValue,
        selectedRows: this.selectedRows
      })
      this.modalVisible = false
    },
    handleCancel () {
      this.modalVisible = false
    },

    //  ===== 已选数据展示池 ======
    handleDeselect (value) {
      this.selectedRowKeys = value
    },

    // ======  表格使用方法 =============
    onClickRow (record) {
      return {
        on: {
          click: () => {
            this.selectedRowKeys = [record[this.dataField]]
            this.selectedRows = [record]
          }
        }
      }
    },
    onClickRowMulti (record) {
      return {
        on: {
          click: () => {
            // 当前记录的 rowKey
            let recordRowKey = record[this.dataField]
            let index = this.selectedRowKeys.indexOf(recordRowKey)
            // 是否已选中
            if (index === -1) {
              this.selectedRowKeys.push(recordRowKey)
              this.selectedRows.push(record)
            } else {
              this.selectedRowKeys.splice(index, 1)
              this.selectedRows.splice(index, 1)
            }
          }
        }
      }
    }
  }
}
</script>

<style>
.lov-search-wrapper {
  text-align: left;
  padding: 0 20px;
  margin-top: 15px
}

.lov-selected-pool-wrapper {
  padding: 0 20px;
  margin-bottom: 24px
}

.lov-pagination-wrapper {
  width: 100%;
  background: #fff;
  display: flex;
  justify-content: space-between;
  position: absolute;
  bottom: 0;
  left: 0;
  padding-bottom: 15px
}
</style>
