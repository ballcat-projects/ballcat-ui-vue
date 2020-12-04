<template>
  <div>
    <a-input-group compact>
      <a-spin :spinning="loading" size="small">
        <a-input read-only style="width: calc(100% - 92px);" class="lov-data"
                 v-if="!multiple" :value="selectValue" />
        <a-select read-only style="width: calc(100% - 92px);" class="lov-data" mode="tags" v-if="multiple"
                  :value="selectValue" :open="false" @deselect="multipleDeselect" />

        <a-button :disabled="disabled" title="单击以选择数据"
                  @click="showModal">
          <a-icon type="select" />
        </a-button>
        <a-button :disabled="disabled" title="单击以清除选中内容" @click="cleanAll">
          <a-icon style="color: red;" type="close-circle" />
        </a-button>
      </a-spin>
    </a-input-group>

    <a-modal class="lov-model" width="800px" @cancel="cancel" @ok="selectData" :visible="visible"
             :confirmLoading="loading"
             :footer="ret?undefined:null" :bodyStyle="{paddingBottom:'0'}" :closable="title.length>0" :title="title">

      <a-spin :spinning="loading">
        <div v-if="search" class="table-page-search-wrapper" style="text-align: left">
          <a-form layout="inline">
            <a-row :gutter="12">
              <a-col :span="6" v-for="item in searchList" :key="item.id">
                <a-form-item :label="item.label">
                  <a-input v-if="item.tag==='INPUT_TEXT'" v-model="queryParam[item.field]"
                           :placeholder="item.placeholder" />
                  <a-input-number style="width: 100%" v-if="item.tag==='INPUT_NUMBER'" v-model="queryParam[item.field]"
                                  :placeholder="item.placeholder"
                                  :min="item.min" :max="item.max" />
                  <a-select allowClear v-if="item.tag==='SELECT'" v-model="queryParam[item.field]"
                            :placeholder="item.placeholder"
                            :options="item.options" />
                  <dict-select v-if="item.tag==='DICT_SELECT'" :placeholder="item.placeholder"
                               :dict-code="item.dictCode"
                               v-model="queryParam[item.field]" />
                </a-form-item>
              </a-col>
            </a-row>
          </a-form>
        </div>

        <!-- 搜索控制按钮 -->
        <div v-if="search" class="table-operator">
          <a-button @click="reloadTable" type="primary">查询</a-button>
          <a-button @click="resetSearchForm" style="margin-left: 8px">重置</a-button>
        </div>

        <div v-if="showSelectAll">
          <a-form>
            <a-form-item read-only label="已选中数据 ">
              <a-select v-if="multiple" :value="selectValue" @deselect="multipleDeselect" :open="false" read-only
                        mode="tags" />
              <a-select v-if="!multiple" :value="selectValue?[selectValue]:[]" @deselect="singleDeselect" :open="false"
                        read-only mode="tags" />
            </a-form-item>
          </a-form>
        </div>

        <a-table
          ref="table"
          size="middle"
          :rowKey="rowKey"
          :columns="columns"
          :dataSource="dataSource"
          :pagination="pagination"
          :loading="loading"
          :rowSelection="ret?{onSelect,onSelectAll,selectedRows,selectedRowKeys, type: multiple?'checkbox':'radio'}:undefined"
          :customRow="customRow"
          @change="handleTableChange"
        />
      </a-spin>
    </a-modal>
  </div>
</template>

<script>
import { TablePageMixin } from '@/mixins'
import Vue from 'vue'
import request from '@/utils/request'
import { getData } from '@/api/sys/lov'

export default {
  name: 'Lov',
  mixins: [TablePageMixin],
  props: {
    // lov 的 keyword
    keyword: String,
    showSelectAll: {
      type: Boolean,
      default: function() {
        return true
      }
    },
    value: {
      type: [String, Number, Array]
    },
    lazy: {
      type: Boolean,
      default: function() {
        return false
      }
    },
    disabled: {
      type: Boolean,
      default: function() {
        return false
      }
    },
    /**
     * 选中表格行处理
     */
    selectRow: {
      type: Function,
      default: function(record, selectedRows, nativeEvent) {
        if (!this.multiple) {
          // 单选处理
          this.selectedRowKeys = [].concat(record[this.rowKey])
          this.backVal = this.retHandlerBySelectRow(record)
          this.selectValue = this.showHandlerBySelectRow(record)
        } else {
          this.selectedRowKeys.push(record[this.rowKey])
          this.backVal.push(this.retHandlerBySelectRow(record))
          this.selectValue.push(this.showHandlerBySelectRow(record))
        }
        this.selectedRows = selectedRows
      }
    },
    /**
     * backVal中是否包含指定列数据
     */
    backValIndexOfRow: {
      type: Function,
      default: function(value, row) {
        return value.indexOf(this.retHandlerBySelectRow(row))
      }
    },
    /**
     * 取消选中行
     */
    unselectRow: {
      type: Function,
      default: function(record, selectedRows, nativeEvent) {
        // 移除key
        this.selectedRowKeys.splice(this.selectedRowKeys.indexOf(record[this.rowKey]), 1)
        // 移除行数据
        this.selectedRows = selectedRows
        // 多选
        if (this.multiple) {
          const index = this.backValIndexOfRow(this.backVal, record)
          if (index !== -1) {
            this.backVal.splice(index, 1)
            this.selectValue.splice(index, 1)
          }
        }
      }
    },
    /**
     * 选中数据展示处理, 返回展示内容
     */
    showHandlerBySelectRow: {
      type: Function,
      default: function(row) {
        return `${row[this.retField]}`
      }
    },
    /**
     * 传入数据展示处理, 返回展示内容
     */
    putValueShowHandler: {
      type: Function,
      default: function(data) {
        return `${data}`
      }
    },
    /**
     * 选中数据返回处理
     */
    retHandlerBySelectRow: {
      type: Function,
      default: function(row) {
        return row[this.retField]
      }
    }
  },
  watch: {
    value() {
      this.copyValue()
    }
  },
  data() {
    return {
      customRow: (record) => {
        return {
          on: {
            click: (event) => {
              // 是否已选中
              let index = this.selectedRowKeys.indexOf(record[this.rowKey])
              if (index === -1) {
                // 单击未选中的列, 插入数据
                this.multiple ? this.selectedRows.push(record) : this.selectedRows = [].concat(record)
                this.selectRow(record, this.selectedRows)
              } else {
                // 单击已选中的列, 删除选中数据
                this.selectedRows.splice(index, 1)
                this.unselectRow(record, this.selectedRows)
              }
            }
          }
        }
      },
      lazyLoad: true,
      visible: false,
      columns: [],
      position: '',
      fixedParams: {},
      multiple: false,
      search: false,
      ret: false,
      title: '',
      searchShowList: [],
      searchList: [],
      retField: '',
      // 已选中数据
      selectValue: undefined,
      emitting: false,
      // 备份值， 所有操作对该值修改，emit该值，选择时重置该值
      backVal: null
    }
  },
  created() {
    if (!this.lazy) {
      this.load()
    }
  },
  methods: {
    showModal() {
      this.multiple ? this.backVal = [...this.value] : this.backVal = this.value
      this.selectedRows = []
      this.selectedRowKeys = []
      this.reloadTable()
      this.visible = true
    },
    load() {
      this.loading = true

      // 获取到 keyword
      let cache_key = this.getCacheKey()

      this.initByKeyword(cache_key, this.keyword).then(json => {
        if (json.title && json.title.trim().length > 0) {
          this.title = json.title
        } else {
          this.title = ''
        }
        // 存储位置
        this.position = json.position.toLowerCase()
        // 主键
        this.rowKey = json.key
        // 返回字段
        this.retField = json.retField
        // 固定请求参数
        if (json.fixedParams) {
          this.fixedParams = JSON.parse(json.fixedParams)
        }
        // 是否需要多选
        let multiple = Boolean(json.multiple)
        if (multiple) {
          // 多选
          this.selectValue = []
        } else {
          this.selectValue = ''
        }
        this.multiple = multiple
        // 是否需要返回数据
        this.ret = Boolean(json.ret)

        // 设置获取数据方法
        this.getPage = (query) => {
          const req = {
            url: json.url,
            method: json.method
          }
          req[this.position] = { ...this.fixedParams, ...query }
          return request(req)
        }

        // 表格数据处理
        // 排序
        json.bodyList.sort((a, b) => {
          return a.index - b.index
        })

        this.columns = []
        // 设置字段
        json.bodyList.forEach(body => {
          this.columns = this.columns.concat({
            title: body.title,
            dataIndex: body.field,
            ...JSON.parse(body.property)
          })
        })

        // 搜索标签处理
        this.dictCodes = []
        json.searchList.forEach(item => {
          if (item.tag === 'DICT_SELECT') {
            this.dictCodes = this.dictCodes.concat(item.dictCode)
          }
        })
        this.searchList = json.searchList
        this.search = json.searchList.length > 0

        // 复制传入参数
        this.copyValue()
        this.loading = false
      })
    },
    getCacheKey() {
      return this.getCacheKeyByKeyword(this.keyword)
    },
    getCacheKeyByKeyword(keyword) {
      return `lov_${keyword}`
    },
    onSelectAll(selected, selectedRows, changeRows) {
      changeRows.forEach(row => {
        this.onSelect(row, selected, selectedRows)
      })
    },
    onSelect(record, selected, selectedRows, nativeEvent) {
      // 选中处理
      if (selected) {
        this.selectRow(record, selectedRows, nativeEvent)
      } else {
        this.unselectRow(record, selectedRows, nativeEvent)
      }
    },
    initByKeyword(cache_key, keyword) {
      const cache_data = Vue.ls.get(cache_key)
      if (!cache_data) {
        return getData(keyword).then((res => {
          Vue.ls.set(cache_key, JSON.stringify(res.data), 7 * 24 * 60 * 60 * 1000)
          return res.data
        }))
      } else {
        return Promise.resolve(JSON.parse(cache_data))
      }
    },
    selectData() {
      this.emit(this.backVal)
      this.visible = false
    },
    cancel() {
      this.copyValue()
      this.visible = false
    },
    loadData() {
      // 合并查询参数，分页参数，排序参数，过滤参数
      const params = Object.assign(this.queryParam, {
        current: this.pagination.current,
        size: this.pagination.pageSize
      }, {
        sortField: this.sortField,
        sortAsc: this.sortAsc
      }, { ...this.filters })

      this.loading = true
      this.getPage(params)
        .then(res => {
          if (res.code === 200) {
            const page = res.data
            // 为防止删除数据后导致页面当前页面数据长度为 0 ,自动翻页到上一页
            if (page.records.length === 0 && this.pagination.current > 1) {
              this.pagination.current--
              this.loadData()
              return
            }
            this.dataSource = page.records
            this.handlerData(page.records)
            this.pagination.total = page.total
          } else {
            this.$message.warning(res.message || 'error request')
          }
        }).catch((e) => {
        // 未被 axios拦截器处理过，则在这里继续处理
        !e.resolved && this.$message.error(e.message || 'error request')
      }).finally(() => {
        this.loading = false
      })
    },
    // 接收数据处理
    handlerData(rows) {
      for (let i = 0; i < rows.length; i++) {
        let row = rows[i]
        if (this.multiple) {
          // 多选时，加载了一个被选中的数据
          if (this.backValIndexOfRow(this.backVal, row) !== -1 && this.selectedRowKeys.indexOf(row[this.rowKey]) === -1) {
            this.selectedRows = this.selectedRows.concat(row)
            this.selectedRowKeys = this.selectedRowKeys.concat(row[this.rowKey])
          }
        } else {
          // 单选
          if (this.selectValue === this.retHandlerBySelectRow(row)) {
            this.selectedRows = [].concat(row)
            this.selectedRowKeys = [].concat(row[this.rowKey])
          }
        }
      }
      return rows
    },
    emit(val) {
      // v-decorator 方式的表单值联动
      this.$emit('change', val)
      // v-model 方式的表单值联动
      this.$emit('input', val)
    },
    copyValue() {
      this.loading = true
      if (this.multiple) {
        let selectValue = []
        let backVal = []
        if (this.value) {
          this.value.forEach(value => {
            selectValue.push(this.putValueShowHandler(value))
            backVal.push(value)
          })
        }
        this.selectValue = [...selectValue]
        this.backVal = [...backVal]
      } else {
        // 单选处理
        this.selectValue = this.value
        this.backVal = this.value
      }
      this.loading = false
    },
    // select 取消选中时
    multipleDeselect(value, option) {
      this.loading = true
      // 查询移除值在选中数据的位置
      const index = this.selectValue.indexOf(value)
      // 移除数据
      this.selectValue.splice(index, 1)
      // 获取被移除的返回值
      const bv = this.backVal[index]
      // 记录被移除的返回值所属数据在 selectedRows 中位置
      let si = -1
      // 记录被移除返回值的行数据
      let row
      // 遍历选中数据， 从中移除当前被删除数据
      for (let i = 0; i < this.selectedRows.length; i++) {
        row = this.selectedRows[i]
        // 寻找当前被删除数据所属行
        if (this.backValIndexOfRow(this.backVal, row) === index) {
          // 如果当前行在 backVal 中的索引值等于index 则找到被移除的返回值
          si = i
          break
        }
      }

      // 移除返回值
      this.backVal.splice(index, 1)
      // 移除数据
      if (si !== -1) {
        this.selectedRows.splice(si, 1)
        this.selectedRowKeys.splice(this.selectedRowKeys.indexOf(row[this.rowKey]), 1)
      }
      this.loading = false
    },
    singleDeselect() {
      this.loading = true
      this.selectedRows = []
      this.selectedRowKeys = []
      this.selectValue = undefined
      this.backVal = undefined
      this.loading = false
    },
    cleanAll() {
      this.emit(this.multiple ? [] : '')
      this.selectedRows = []
      this.selectedRowKeys = []
    }
  }
}
</script>

<style scoped lang="less">
.lov-data {
  width: 100%;
}

.ant-select-search__field__wrap {
  .ant-select-search__field input {

  }
}
</style>
