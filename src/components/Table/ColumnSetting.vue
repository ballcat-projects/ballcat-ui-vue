<template>
  <a-popover
    trigger="click"
    placement="bottomRight"
    overlay-class-name="ballcat-pro-table-column-setting"
  >
    <template slot="content">
      <div class="ballcat-pro-table-column-setting-list">
        <a-checkbox-group v-model="checkedKeys" @change="onCheckedChange">
          <draggable
            v-model="sortedKeys"
            class="list-group"
            animation="250"
            @start="drag = true"
            @end="onDragEnd"
          >
            <transition-group type="transition" :name="!drag ? 'flip-list' : null">
              <div v-for="data in localColumns" :key="data.columnKey" class="ballcat-pro-table-column-setting-list-item">
                <span class="ballcat-pro-table-column-setting-draggable-icon">
                  <a-icon :component="draggableIcon" />
                </span>
                <a-checkbox :value="data.columnKey">{{ data.title }}</a-checkbox>
              </div>
            </transition-group>
          </draggable>
        </a-checkbox-group>
      </div>
    </template>
    <template slot="title">
      <div class="ballcat-pro-table-column-setting-title">
        <a-checkbox :indeterminate="indeterminate" :checked="checkAll" @change="onCheckAllChange">
          列展示
        </a-checkbox>
        <a @click="reset">重置</a>
      </div>
    </template>
    <a-tooltip title="列设置">
      <a-icon type="setting" />
    </a-tooltip>
  </a-popover>
</template>

<script>
import draggable from 'vuedraggable'
import { draggableIcon } from '@/core/icons'

export default {
  name: 'TableColumnSetting',
  components: {draggable},
  props: {
    columns: {
      type: Array,
      default: () => []
    },
    value: {
      type: Object,
      default: function (){
        return {}
      }
    },
    defaultColumnState: {
      type: Object,
      default: function (){
        return {}
      }
    }
  },
  data() {
    return {
      draggableIcon,
      drag: false,

      localColumns: [],
      checkedKeys: [],
      sortedKeys: [],
    };
  },
  computed: {
    allKeys() {
      return this.localColumns.map(x => x.columnKey);
    },
    checkAll() {
      return  this.checkedKeys.length === this.allKeys.length;
    },
    indeterminate () {
      return !!this.checkedKeys.length && this.checkedKeys.length < this.allKeys.length;
    },
    tableColumns() {
      return  this.localColumns
        .filter(column => this.checkedKeys.includes(this.getColumnKey(column)))
    }
  },
  watch: {
    columns () {
      this.reset()
    },
    tableColumns () {
      this.$emit('change', this.tableColumns)
    },
  },
  created () {
    this.reset()
  },
  methods: {
    getColumnKey(column) {
     return column.dataIndex ? column.dataIndex: column.key
    },
    reset() {
      const localColumns = []
      const sortedKeys = []
      const checkedKeys = []
      for (let column of this.columns) {
        const columnKey = this.getColumnKey(column)
        const data = Object.assign({}, column, {columnKey: columnKey})
        localColumns.push(data)
        sortedKeys.push(columnKey)
        if(columnKey in this.defaultColumnState ? this.defaultColumnState[columnKey] !== false : true){
          checkedKeys.push(columnKey)
        }
      }
      this.localColumns = localColumns
      this.sortedKeys = sortedKeys
      this.checkedKeys = checkedKeys
    },
    onDragEnd(e){
      this.drag = false
      this.localColumns.sort((a, b) => {
        return this.sortedKeys.indexOf(this.getColumnKey(a)) - this.sortedKeys.indexOf(this.getColumnKey(b))
      })
    },
    onCheckedChange(checkedKeys){
      this.checkedKeys = checkedKeys
    },
    onCheckAllChange(e) {
      const checkedAll = e.target.checked
      this.checkedKeys =  checkedAll ? this.allKeys : []
    },
  }
}
</script>

<style lang="less">

.ballcat-pro-table-column-setting {
  min-height: 20px;

  .ant-popover-inner-content{
    padding: 0 0 8px;
  }

  .sortable-ghost {
    opacity: 0.75;
    background-color: #e8e8e8;
  }

  &-title {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 32px;
  }

  &-list {
    display: flex;
    flex-direction: column;
    width: 100%;
    padding-top: 8px;

    &-item {
      display: flex;
      align-items: flex-start;
      padding: 0 0 4px;
      outline: none;
    }
  }

  &-draggable-icon {
    width: 24px;
    line-height: 24px;
    text-align: center;
    opacity: .5;
    transition: opacity .3s;
    cursor: move;
  }
}
</style>
