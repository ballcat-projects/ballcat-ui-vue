<template>
  <div>
    <a-input-group compact>
      <a-button :disabled="disabled" title="单击以选择数据" @click="visible=true;reloadTable()">
        <a-icon type="select"/>
      </a-button>
      <a-button :disabled="disabled" title="单击以清除选中内容" @click="cleanAll">
        <a-icon style="color: red;" type="close-circle"/>
      </a-button>

      <a-input :disabled="disabled" style="width: calc(100% - 92px);" class="lov-data" v-if="!multiple && retFieldDataType===1" v-model="selectValue"
               @change="changeValue"/>
      <a-input-number :disabled="disabled" style="width: calc(100% - 92px);" class="lov-data" v-if="!multiple && retFieldDataType===2"
                      v-model="selectValue"
                      @change="changeValue"/>
      <a-select :disabled="disabled" style="width: calc(100% - 92px);" class="lov-data" mode="tags" v-if="multiple" v-model="selectValue"
                @deselect="deselect"
                @change="changeValue"/>
    </a-input-group>
    <a-modal class="lov-model" width="800px" @cancel="visible=false" @ok="selectData" :visible="visible" :confirmLoading="loading"
             :footer="ret?undefined:null" :bodyStyle="{paddingBottom:'0'}">
      <div v-if="search" class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="12">
            <a-col :md="8" :sm="24" v-for="item in searchList" :key="item.id">
              <a-form-item :label="item.label">
                <a-input v-if="item.tag==='INPUT_TEXT'" v-model="queryParam[item.field]" :placeholder="item.placeholder"/>
                <a-input-number style="width: 100%" v-if="item.tag==='INPUT_NUMBER'" v-model="queryParam[item.field]"
                                :placeholder="item.placeholder"
                                :min="item.min" :max="item.max"/>
                <a-select allowClear v-if="item.tag==='SELECT'" v-model="queryParam[item.field]" :placeholder="item.placeholder"
                          :options="item.options"/>
                <dict-select v-if="item.tag==='DICT_SELECT'" :placeholder="item.placeholder" :dict-code="item.dictCode"
                             v-model="queryParam[item.field]"/>
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
    </a-modal>
  </div>
</template>

<script>
import { TablePageMixin } from '@/mixins'
import Vue from 'vue'
import { axios } from '@/utils/request'
import { getData } from '@/api/sys/lov'

export default {
  name: 'Lov',
  mixins: [TablePageMixin],
  props: {
    // lov 的 keyword
    keyword: String,
    value: {
      type: [String, Number, Array]
    },
    lazy: {
      type: Boolean,
      default: function () {
        return false
      }
    },
    disabled: {
      type: Boolean,
      default: function () {
        return false
      }
    }
  },
  watch: {
    value () {
      this.copyValue()
    }
  },
  data () {
    return {
      customRow: (record) => {
        return {
          on: {
            click: (event) => {
              // 是否已选中
              const index = this.selectedRowKeys.indexOf(record[this.rowKey])
              if (index === -1) {
                // 单击未选中的列, 插入数据
                if (this.multiple){
                  // 多选
                  this.selectedRowKeys.push(record[this.rowKey])
                  this.selectedRows.push(record)
                }else {
                  // 单选
                  this.selectedRowKeys = [].concat(record[this.rowKey])
                  this.selectedRows = [].concat(record)
                }
              } else {
                // 单击已选中的列, 删除选中数据
                this.selectedRowKeys.splice(index, 1)
                this.selectedRows.splice(index, 1)
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
      searchShowList: [],
      searchList: [],
      retField: '',
      retFieldDataType: undefined,
      // 已选中数据
      selectValue: [],
      emitting: false
    }
  },
  created () {
    if (!this.lazy) {
      this.load()
    }
  },
  methods: {
    changeValue (e) {
      // input 标签手动修改了值
      if (!this.emitting) {
        this.emitting = true
        setTimeout(() => {
          this.emit(this.selectValue)
          this.emitting = false
          // 300 毫秒后更新
        }, 300)
      }
    },
    load () {
      this.loading = true

      // 获取到 keyword
      let cache_key = this.getCacheKey()

      this.initByKeyword(cache_key, this.keyword).then(json => {
        // 存储位置
        this.position = json.position.toLowerCase()
        // 主键
        this.rowKey = json.key
        // 返回字段
        this.retField = json.retField
        // 返回字段数据类型
        this.retFieldDataType = json.retFieldDataType
        // 固定请求参数
        if (json.fixedParams) {
          this.fixedParams = JSON.parse(json.fixedParams)
        }
        // 是否需要多选
        if (Boolean(json.multiple)) {
          this.multiple = true
        }
        // 是否需要搜索框
        if (Boolean(json.search)) {
          this.search = true
        }
        // 是否需要返回数据
        if (Boolean(json.ret)) {
          this.ret = true
        }

        // 设置获取数据方法
        this.getPage = (query) => {
          const req = {
            url: json.url,
            method: json.method
          }
          req[this.position] = { ...this.fixedParams, ...query }
          return axios(req)
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

        // 复制传入参数
        this.copyValue()
      })
    },
    getCacheKey () {
      return this.getCacheKeyByKeyword(this.keyword)
    },
    getCacheKeyByKeyword (keyword) {
      return `lov_${keyword}`
    },
    onSelectAll (selected, selectedRows, changeRows) {
      changeRows.forEach(row => {
        this.onSelect(row, selected, selectedRows)
      })
    },
    onSelect (record, selected, selectedRows, nativeEvent) {
      // 选中处理
      if (selected) {
        if (!this.multiple) {
          // 单选处理
          this.selectedRowKeys = [].concat(record[this.rowKey])
        } else {
          this.selectedRowKeys = this.selectedRowKeys.concat(record[this.rowKey])
        }
      } else {
        this.selectedRowKeys.splice(this.selectedRowKeys.indexOf(record[this.rowKey]), 1)
        const index = this.selectValue.indexOf(this.getDataByType(record))
        if (index !== -1) {
          this.selectValue.splice(index, 1)
        }
      }
      this.selectedRows = selectedRows
    },
    initByKeyword (cache_key, keyword) {
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
    selectData () {
      // 所有已选中值
      let val = this.selectValue
      if (this.multiple) {
        this.selectedRows.forEach(row => {
          let data = this.getDataByType(row)

          // 如果值是未选中的
          if (val.indexOf(data) === -1) {
            val.push(data)
          }
        })
      } else {
        // 单选处理
        val = this.getDataByType(this.selectedRows[0])
      }

      this.emit(val)
      this.visible = false
    },
    emit (val) {
      // v-decorator 方式的表单值联动
      this.$emit('change', val)
      // v-model 方式的表单值联动
      this.$emit('input', val)
    },
    getDataByType (row) {
      if (!row) {
        return null
      }
      let data = row[this.retField]
      if (this.retFieldDataType === 1) {
        data = String(data)
      } else if (this.retFieldDataType === 2) {
        data = Number(data)
      }
      return data
    },
    copyValue () {
      if (this.multiple) {
        this.selectValue = this.value ? [].concat(this.value) : []
      } else {
        // 单选处理
        if (this.retFieldDataType === 1) {
          this.selectValue = this.value ? `${this.value}` : null
        } else if (this.retFieldDataType === 2) {
          this.selectValue = this.value ? Number(this.value) : null
        }
      }
    },
    // 接收数据处理
    handlerData (rows) {
      for (let i = 0; i < rows.length; i++) {
        let row = rows[i]
        if (this.multiple) {
          // 多选时，加载了一个被选中的数据
          if (this.selectValue.indexOf(row[this.retField]) !== -1 && this.selectedRowKeys.indexOf(row[this.rowKey]) === -1) {
            this.selectedRows = this.selectedRows.concat(row)
            this.selectedRowKeys = this.selectedRowKeys.concat(row[this.rowKey])
          }
        } else {
          // 单选
          if (this.selectValue === row[this.retField]) {
            this.selectedRows = [].concat(row)
            this.selectedRowKeys = [].concat(row[this.rowKey])
          }
        }
      }
      return rows
    },
    // select 取消选中时
    deselect (value, option) {
      for (let i = 0; i < this.selectedRows.length; i++) {
        let item = this.selectedRows[i]
        if (item[this.retField] === value) {
          this.selectedRows.splice(i, 1)
          this.selectedRowKeys.splice(i, 1)
        }
      }
    },
    cleanAll () {
      if (this.multiple) {
        this.emit([])
      } else {
        this.emit(null)
      }
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
</style>
