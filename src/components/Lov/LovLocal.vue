<template>
  <div>
    <a-input-group compact>
      <a-spin :spinning="loading" size="small" style="width: 100%;">
        <div v-if="!extendParms.multiple" style="display:flex;position:relative">
          <a-input
            v-if="!extendParms.multiple"
            class="lov-data"
            :value="selectValue"
            :disabled="disabled"
            :placeholder="extendParms.placeholder"
            read-only
          >
            <a-icon slot="addonAfter" type="ellipsis" @click="showModal" />
          </a-input>
          <div
            v-show="selectValue"
            style="position:absolute;right:46px;top:6px;z-index:1;cursor:pointer;width:18px;height:18px"
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
        <div v-else style="display:flex;position:relative;margin-top:-5px">
          <a-select
            style="width: calc(100% - 37px);position:absolute;left:0;top:0;margin:auto;z-index:1;"
            class="lov-data"
            mode="tags"
            :max-tag-text-length="15"
            :max-tag-count="1"
            :value="selectValue"
            :placeholder="extendParms.placeholder"
            :open="false"
            :disabled="disabled"
            read-only
            @deselect="multipleDeselect"
          />
          <div
            class="ballcat-select-btn"
            :title="langPlugin[extendParms.lang].clickData || '单击选择数据'"
            @click="showModal"
          ><a-icon type="ellipsis" /></div>
          <div
            v-show="selectValue.length"
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
      :mask-closable="false"
      :title="extendParms.modelTitle"
      class="lov-model"
      :width="extendParms.modelWidth"
      :visible="visible"
      :centered="true"
      :confirm-loading="loading"
      :body-style="computedStyle"
      :closable="extendParms.modelTitle.length>0"
      :cancel-text="langPlugin[extendParms.lang].cancel"
      :ok-text="langPlugin[extendParms.lang].ok"
      @cancel="cancel"
      @ok="selectData"
    >
      <!-- <a-spin :spinning="loading"> -->
      <div v-if="search" style="text-align: left;padding:0 20px;margin-top:15px">
        <a-form>
          <a-row :gutter="8">
            <a-col
              v-for="(item,index) in searchList"
              :key="index+'parent'"
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
                  v-if="item.tag==='input'"
                  v-model="queryParam[item.field]"
                  :placeholder="item.placeholder"
                />
                <a-input-number
                  v-if="item.tag==='number-input'"
                  v-model="queryParam[item.field]"
                  style="width: 100%"
                  :placeholder="item.placeholder"
                  :min="item.min || 1"
                  :max="item.max"
                />
                <a-select
                  v-if="item.tag==='select'"
                  v-model="queryParam[item.field]"
                  allow-clear
                  :placeholder="item.placeholder"
                  :options="item.options"
                />
                <dict-select
                  v-if="item.tag==='dict-select'"
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
              style="margin-top:2px"
            >
              <div style="display:flex;">
                <a-button type="primary" style="margin-left:5%" @click="reloadTable">{{ langPlugin[extendParms.lang].search || '查询' }}</a-button>
                <a-button style="margin-left:8px" @click="resetSearchForm">{{ langPlugin[extendParms.lang].reset || '重置' }}</a-button>
              </div>
            </a-col>
          </a-row>
        </a-form>
      </div> 
      <div v-if="extendParms.showSelectAll" style="padding:0 20px;">
        <a-form>
          <a-form-item read-only>
            <a-select
              v-if="extendParms.multiple"
              :value="selectValue"
              :open="false"
              read-only
              mode="tags"
              :placeholder="langPlugin[extendParms.lang].haveSelect || '已选数据'"
              @deselect="multipleDeselect"
            />
            <a-input
              v-if="!extendParms.multiple"
              :value="selectValue"
              :open="false"
              read-only
              mode="tags"
              :placeholder="langPlugin[extendParms.lang].haveSelect || '已选数据'"
            >
              <a-icon slot="addonAfter" type="close" @click="singleDeselect" />
            </a-input>
          </a-form-item>
        </a-form>
      </div>
      <a-table
        ref="table"
        style="margin-top:-10px;"
        :size="extendParms.tableSize"
        :row-key="rowKey"
        :columns="columns"
        :data-source="dataSource"
        :pagination="false"
        :loading="loading"
        :row-selection="extendParms.onlyShow?{onSelect,onSelectAll,selectedRows,selectedRowKeys, type: extendParms.multiple?'checkbox':'radio'}:undefined"
        :custom-row="customRow"
        @change="handleTableChange"
      />
      <!-- </a-spin> -->
      <div class="ballcat-model-bottom">
        <a-pagination
          v-model="pagination.current"
          :total="pagination.total" 
          :page-size="pagination.pageSize"
          :show-total="pagination.showTotal"
          show-size-changer
          size="small"
          style="margin-left:3%"
          @change="loadData"
        />
      </div>
    </a-modal>
  </div>
</template>

<script>
import { TablePageMixin } from '@/mixins'
export default {
  name: 'Lov',
  mixins: [TablePageMixin],
  props: {
    keyword: {
      type: Object,
      required: true
    },
    value: {
      type: [String, Number, Array],
      default: function(){
        return []
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
      default: function(record, selectedRows) {
        if (!this.extendParms.multiple) {
          // 单选处理
          this.selectedRowKeys = [].concat(record[this.rowKey])
          this.backVal = this.retHandlerBySelectRow(record)
          this.selectValue = this.showHandlerBySelectRow(record)
        } else {
          this.selectedRowKeys.push(record[this.rowKey]);
          this.backVal.push(this.retHandlerBySelectRow(record))
          this.selectValue.push(this.showHandlerBySelectRow(record))

        }
        this.selectedRows = selectedRows
      }
    },
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
        if (this.extendParms.multiple) {
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
        return `${row[this.extendParms.retField] || row[this.rowKey]}`
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
        return row[this.rowKey]
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
                this.extendParms.multiple ? this.selectedRows.push(record) : this.selectedRows = [].concat(record)
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
      search: false,
      searchList: [],
      selectValue:null,
      backVal: null,
      checkFlag:false,
      errMsg:"配置数据错误",
      midValue:[],
      extendParms:{
         modelTitle:"",
         modelWidth:"800px",
         placeholder:"",
         multiple: 0,
         tableSize:"middle",
         fixedParams:{},
         retField:"",
         onlyShow:1,
         showSelectAll:1,
         lang:"cn"
      },
      langPlugin:{
        "cn":{
          "search":"查询",
          "reset":"重置",
          "haveSelect":"已选数据",
          "clickData":"单击选择数据",
          "cancel":"取消",
          "ok":"确定"
        },
        "en":{
          "search":"Search",
          "reset":"Reset",
          "haveSelect":"Selected data",
          "clickData":"Click Select data",
          "cancel":"Cancel",
          "ok":"Ok"
        }
      }
    }
  },
  computed: {
    computedStyle() {
        let screenHeight = document.body.clientHeight * 0.75;
        return {padding:'0', maxHeight: screenHeight + 'px',overflowY: 'scroll' }
    },
  },
  watch: {
    value() {
      this.copyValue()
    }
  },
  created(){
    this.load()
  },
  methods: {
    showModal() {
      if(!this.checkFlag){
        return this.$message.error(this.errMsg);
      }
      if(this.disabled){return}
      if(this.extendParms.multiple){
        this.midValue=[...this.value];
        //this.backVal=this.value.length ? [...this.value] : [...this.selectValue]
        this.backVal=[...this.value];
      }else{
         this.backVal=this.value;
         this.midValue=this.value;
      } 
      if(!this.lazyLoad){return this.visible=true;}
      this.selectedRows = []
      this.selectedRowKeys = []
      this.sortField && (this.sortField=this.rowKey);
      this.reloadTable()
      this.visible=true;
      this.lazyLoad=false
    },
    load() {
        const lovObj=this.keyword;
        this.checkFlag=this.handlerInitData(lovObj) && this.handlerInitSearch(lovObj);
        if(!this.checkFlag){return}
        this.loading = true
        this.copyValue()
        this.loading = false
    },
    checkDataType(data,type=1){
       let dataType={1:"[object Object]",2:"[object Array]",3:"[object String]"}
       return Object.prototype.toString.call(data)===dataType[type];
    },
    handlerInitData(lovObj){
      let initData=lovObj.lovOption;
      if(!this.checkDataType(initData)){
          this.errMsg="lovOption数据必须是对象"
          return false
      };
      if(!initData.rowKey || !initData.getPage){this.errMsg="lovOption中必填字段不能为空";return false}
      for(let key in initData){
         if(key=="rowKey" || key=="getPage"){
           this[key]=initData[key]
         }else{
           this.extendParms[key]=initData[key];     
         }
      }
      this.extendParms.retField=this.extendParms.retField || this.rowKey;
      this.selectValue = this.extendParms.multiple ? [] : '';
      this.columns=lovObj.columnsOption;
      this.checkDataType(this.extendParms.fixedParams) && Object.assign(this.queryParam,this.extendParms.fixedParams);
      return true;
    },
    handlerInitSearch(lovObj){
        let initSearchData=lovObj.searchOption;
        initSearchData.forEach(item => {
          if(!item.field || !item.tag){
            this.errMsg="搜索field 和tag 必填";return false;
          };
          if (item.tag === 'DICT_SELECT') {
             if(!item.dictCode){this.errMsg="字典选项必填";return false;}
             item.dictCode=item.dictCode.toString()
          }else if(item.tag === 'SELECT'){
            if(Object.prototype.toString.call(item.options) !== '[object Array]'){
               this.errMsg="搜索options 数据格式不对";return false;
            }
          }
        })
        this.searchList = initSearchData;
        this.search =  initSearchData.length > 0;
        return true  
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
      this.cancelValue()
      this.lazyLoad=true;
      this.visible = false;
    },
    cancelSourceData(){
      // 取消处理数据
      if(this.extendParms.multiple){
          this.selectValue=[];
          this.dataSource.forEach(item=>{
            if(this.backVal.indexOf(item[this.rowKey]) !=-1){
              this.selectValue.push(item[this.extendParms.retField])
            }
         })
      }else{
          this.dataSource.forEach(item=>{
            item[this.rowKey]==this.backVal && (this.selectValue=item[this.extendParms.retField])
         })
      }
    },
    // 接收数据处理
    onPageLoadSuccess({records: rows}) {
      for (let i = 0; i < rows.length; i++) {
        let row = rows[i]
        if (this.extendParms.multiple) {  
          // 多选时，加载了一个被选中的数据
          if (this.backValIndexOfRow(this.backVal, row) !== -1 && this.selectedRowKeys.indexOf(row[this.rowKey]) === -1) {
            this.selectedRows = this.selectedRows.concat(row)
            this.selectedRowKeys = this.selectedRowKeys.concat(row[this.rowKey])
          }
        } else {
          // 单选
          if (this.backVal === this.retHandlerBySelectRow(row)) {
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
    cancelValue(){
      if (this.extendParms.multiple) { 
        let selectValue = []
        let backVal = [] 
        if (this.midValue.length) {
             this.midValue.forEach(value => {
                selectValue.push(this.putValueShowHandler(value))
                backVal.push(value);
             })
        }else{
          this.selectValue=[];
        }
        this.backVal = [...backVal]
      } else {
        // 单选处理
        let inputVal=''
        if(this.checkDataType(this.midValue,2)){
           inputVal=this.midValue.length ? this.midValue[0] : ''
        }else{
           inputVal=this.midValue;
        }
        this.backVal = inputVal
      } 
      this.cancelSourceData()
    },
    copyValue() {
      this.loading = true
      if (this.extendParms.multiple) { 
        let selectValue = []
        let backVal = []
        let flag=this.checkDataType(this.value,2);
        let value=flag ? this.value : [this.value];
        if (this.value) {
             value.forEach(value => {
                selectValue.push(this.putValueShowHandler(value))
                backVal.push(value);
             })
        }
        if(this.extendParms.retField ==this.rowKey || (!this.selectedRowKeys.length && this.value) || !this.value.length){
           this.selectValue = [...selectValue] 
        }
        this.backVal = [...backVal]
      } else {
        // 单选处理
        let inputVal=''
        if(this.checkDataType(this.value,2)){
           inputVal=this.value.length ? this.value[0] : ''
        }else{
           inputVal=this.value;
        }
        if(this.extendParms.retField==this.rowKey || (!this.selectedRowKeys[0] && this.value) || !this.value||!inputVal){
           this.selectValue = inputVal 
        }
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
      if(this.disabled){return}
      this.midValue=[];
      this.emit(this.extendParms.multiple ? [] : '')
      this.selectValue=this.extendParms.multiple ? [] : null
      this.selectedRows = []
      this.selectedRowKeys = []
      this.backVal=null;
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
  width:100%;
  background:#fff;
  display:flex;justify-content:space-between;
  position:absolute;bottom:0;left:0;padding-bottom:15px
}
</style>
