<template>
  <div>
    <a-input-group compact>
      <a-spin :spinning="loading" size="small" style="width: 100%">
        <div v-if="!multiple" style="display:flex;position:relative">
          <a-input
            v-if="!multiple"
            class="lov-data"
            :value="selectValue"
            :placeholder="placeholder"
            read-only
          >
            <a-icon slot="addonAfter" type="select" @click="showModal" />
          </a-input>
          <div
            v-show="selectValue"
            style="position:absolute;right:46px;top:6px;z-index:1;cursor:pointer;width:18px;height:18px"
            class="aa"
            @click="cleanAll"
          >
            <svg
              t="1619765878911"
              class="icon"
              viewBox="0 0 1024 1024"
              version="1.1"
              style="color:red"
              xmlns="http://www.w3.org/2000/svg"
              p-id="2618"
              width="14"
              height="14"
            ><path d="M512 85.333333C276.48 85.333333 85.333333 276.48 85.333333 512S276.48 938.666667 512 938.666667 938.666667 747.52 938.666667 512 747.52 85.333333 512 85.333333z m136.533333 531.342223c11.377778 11.377778 11.377778 29.582222 0 39.822222-5.688889 5.688889-12.515556 7.964444-20.48 7.964444s-14.791111-2.275556-20.48-7.964444L512 559.786667l-96.711111 96.711111c-5.688889 5.688889-12.515556 7.964444-20.48 7.964444s-14.791111-2.275556-20.48-7.964444c-11.377778-11.377778-11.377778-29.582222 0-39.822222l96.711111-96.711112-104.675556-104.675555c-11.377778-11.377778-11.377778-29.582222 0-39.822222 11.377778-11.377778 29.582222-11.377778 39.822223 0l104.675555 104.675555 104.675556-104.675555c11.377778-11.377778 29.582222-11.377778 39.822222 0 11.377778 11.377778 11.377778 29.582222 0 39.822222l-104.675556 104.675555 97.848889 96.711112z" p-id="2619" fill="#bfbfbf" /></svg>
          </div>
        </div>
        <div v-else style="display:flex;position:relative">
          <a-select
            read-only
            style="width: calc(100% - 37px);position:absolute;left:0;top:0;z-index:1"
            class="lov-data"
            mode="tags"
            :value="selectValue"
            :placeholder="placeholder"
            :open="false"
            @deselect="multipleDeselect"
          />
          <div class="ballcat-select-btn"
            title="单击以选择数据"
            @click="showModal"><a-icon type="select" /></div>
          <div
            v-show="selectValue"
            class="ballcat-select-clear"
            @click="cleanAll"
          >
            <svg
              t="1619765878911"
              class="icon"
              viewBox="0 0 1024 1024"
              version="1.1"
              style="color:red"
              xmlns="http://www.w3.org/2000/svg"
              p-id="2618"
              width="14"
              height="14"
            ><path d="M512 85.333333C276.48 85.333333 85.333333 276.48 85.333333 512S276.48 938.666667 512 938.666667 938.666667 747.52 938.666667 512 747.52 85.333333 512 85.333333z m136.533333 531.342223c11.377778 11.377778 11.377778 29.582222 0 39.822222-5.688889 5.688889-12.515556 7.964444-20.48 7.964444s-14.791111-2.275556-20.48-7.964444L512 559.786667l-96.711111 96.711111c-5.688889 5.688889-12.515556 7.964444-20.48 7.964444s-14.791111-2.275556-20.48-7.964444c-11.377778-11.377778-11.377778-29.582222 0-39.822222l96.711111-96.711112-104.675556-104.675555c-11.377778-11.377778-11.377778-29.582222 0-39.822222 11.377778-11.377778 29.582222-11.377778 39.822223 0l104.675555 104.675555 104.675556-104.675555c11.377778-11.377778 29.582222-11.377778 39.822222 0 11.377778 11.377778 11.377778 29.582222 0 39.822222l-104.675556 104.675555 97.848889 96.711112z" p-id="2619" fill="#bfbfbf" /></svg>
          </div>
        </div>
      </a-spin>
    </a-input-group>

    <a-modal
      :title="title"
      class="lov-model"
      :width="width"
      :visible="visible"
      :centered="true"
      :confirm-loading="loading"
      :footer="null"
      :body-style="{padding:'0 0 65px 0'}"
      :closable="title.length>0"
      @cancel="cancel"
      @ok="selectData"
    >

      <!-- <a-spin :spinning="loading"> -->
        <div v-if="search" class="table-page-search-wrapper" style="text-align: left">
          <a-form layout="inline">
            <a-row :gutter="12">
              <a-col
                v-for="item in searchList"
                :key="item.id"
                :span="6"
                :md="8"
                :sm="24"
              >
                <a-form-item :label="item.label">
                  <a-input
                    v-if="item.tag==='INPUT_TEXT'"
                    v-model="queryParam[item.field]"
                    :placeholder="item.placeholder"
                  />
                  <a-input-number
                    v-if="item.tag==='INPUT_NUMBER'"
                    v-model="queryParam[item.field]"
                    style="width: 100%"
                    :placeholder="item.placeholder"
                    :min="item.min"
                    :max="item.max"
                  />
                  <a-select
                    v-if="item.tag==='SELECT'"
                    v-model="queryParam[item.field]"
                    allow-clear
                    :placeholder="item.placeholder"
                    :options="item.options"
                  />
                  <dict-select
                    v-if="item.tag==='DICT_SELECT'"
                    v-model="queryParam[item.field]"
                    :placeholder="item.placeholder"
                    :dict-code="item.dictCode"
                  />
                </a-form-item>
              </a-col>
            </a-row>
          </a-form>
        </div>

        <!-- 搜索控制按钮 -->
        <div v-if="search" class="table-operator">
          <div style="margin-top:3px;padding-bottom:5%">
              <a-button type="primary" @click="reloadTable">查询</a-button>
              <a-button style="margin-left: 8px" @click="resetSearchForm">重置</a-button>
          </div>
        </div>

        <div v-if="showSelectAll" style="padding:0 20px;">
          <a-form>
            <a-form-item read-only style="margin-top:10px;">
              <a-select
                v-if="multiple"
                :value="selectValue"
                :open="false"
                read-only
                mode="tags"
                placeholder="已选数据"
                @deselect="multipleDeselect"
              />
              <a-input
                v-if="!multiple"
                :value="selectValue"
                :open="false"
                read-only
                mode="tags"
                placeholder="已选数据"
              >
                <a-icon slot="addonAfter" type="close"  @click="singleDeselect"/>
              </a-input>
            </a-form-item>
          </a-form>
        </div>

        <a-table style="margin-top:-10px"
          ref="table"
          :size="tableSize"
          :row-key="rowKey"
          :columns="columns"
          :data-source="dataSource"
          :pagination="false"
          :loading="loading"
          :scroll="{ y: 300 }"
          :row-selection="ret?{onSelect,onSelectAll,selectedRows,selectedRowKeys, type: multiple?'checkbox':'radio'}:undefined"
          :custom-row="customRow"
          @change="handleTableChange"
        />
    
      <!-- </a-spin> -->
          <div class="ballcat-model-bottom">
         <a-pagination v-model="pagination.current" :total="pagination.total" 
         :pageSize='pagination.pageSize' :showTotal="pagination.showTotal"  showSizeChanger size="small" @change="loadData" 
         />
         <div>
          <a-button key="back" @click="cancel"> 取消</a-button>
          <a-button key="submit" type="primary" :loading="loading" @click="selectData" style="margin-left:8px">确定</a-button>
         </div>
      </div>
    </a-modal>
  </div>
</template>

<script>
import { TablePageMixin } from '@/mixins'
import request from '@/utils/request'
import { mapActions } from 'vuex'

export default {
  name: 'Lov',
  mixins: [TablePageMixin],
  props: {
    // lov 的 keyword
    keyword: {
      type: String,
      required: true
    },
    width: {
      type: String,
      default: function(){
        return '800px'
      }
    },
    tableSize: {
      type: String,
      default: function(){
        return 'middle'
      }
    },
    showSelectAll: {
      type: Boolean,
      default: function() {
        return true
      }
    },
    value: {
      type: [String, Number, Array],
      default: null
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
    placeholder:{
      type: String,
      default: ''
    },
    sourceLov:{
      type: Number,
      default: 0
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
  watch: {
    value() {
      this.copyValue()
    }
  },
  created() {
    if (!this.lazy) {
      this.load()
    }
  },
  methods: {
    ...mapActions(['getLovInfoByKeyword']),
    showModal() {
      this.multiple ? this.backVal = [...this.value] : this.backVal = this.value
      this.selectedRows = []
      this.selectedRowKeys = []
      if(this.sourceLov==1){
           this.$emit('preview')
      }else{
           this.reloadTable()
           this.visible=true;
      } 
    },
    load() {
      this.loading = true
      // 获取数据
      this.getLovInfoByKeyword(this.keyword).then(json => {
        if (!json) {
          this.$message.error(`加载lov异常!keyword: ${this.keyword}`)
          console.error(`加载lov异常!keyword: ${this.keyword}`)
          return
        }

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
    selectData() {
      this.emit(this.backVal)
      this.visible = false
    },
    cancel() {
      this.copyValue()
      this.visible = false
    },
    // 接收数据处理
    onPageLoadSuccess({records: rows}) {
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
        let inputVal=''
        if(Object.prototype.toString.call(this.value) === '[object Array]'){
           inputVal=this.value.length ? this.value[0] : ''
        }else{
           inputVal=this.value;
        }
        this.selectValue = inputVal
        this.backVal = inputVal
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
        !this.visible && this.emit(this.backVal)
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
      this.dataSource=[];
      this.emit(this.multiple ? [] : '')
      this.multiple || this.$emit('clear', this.multiple ? [] : '')
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
.ballcat-select-btn{
  position:absolute;right:0;top:0;
  padding: 4px 11px;
  color: rgba(0,0,0,.65);
  font-weight: 400;
  font-size: 15px;
  text-align: center;
  background-color: #fafafa;
  border: 1px solid #d9d9d9;
  border-radius: 1px;
  transition: all .3s;
}
.ballcat-select-clear{
 position:absolute;right:45px;top:7px;z-index:1;cursor:pointer;width:18px;height:18px
}
.ballcat-model-bottom{
  width:94%;
  display:flex;justify-content:space-between;
  position:absolute;bottom:15px;left:20px
}
</style>
