<template>
  <div>
    <a-spin :spinning="loading" size="small" style="width: 100%;">
      <div @click="showModal">
        <a-select
          ref="select"
          v-model="selectedValue"
          class="lov-select"
          style="width: 100%"
          :open="false"
          :allow-clear="true"
          :show-arrow="true"
          :mode="multiple? 'tags' : 'default'"
          :disabled="disabled"
          :placeholder="placeholder"
          :options="selectOptions"
          :filter-option="false"
          :show-search="false"
          @change="handleChange"
        >
          <a-icon slot="suffixIcon" type="ellipsis" />
        </a-select>
      </div>
    </a-spin>

    <lov-modal
      ref="lovModal"
      :multiple="multiple"
      :custom-option-title="customOptionTitle"
      :modal-title="modalTitle"
      :modal-width="modalWidth"
      :search-options="searchOptions"
      :data-key="dataKey"
      :get-page-data="getPageData"
      :table-columns="tableColumns"
      :table-size="tableSize"
      @lov-choose="handleLovChoose"
    />

  </div>
</template>

<script>
import LovModal from '@/components/Lov/LovModal'

export default {
  name: 'LovLocal',
  components: { LovModal },
  props: {
    // eslint-disable-next-line vue/require-default-prop
    value: {
      type: [String, Number, Array]
    },

    // 是否多选
    multiple: {
      type: Boolean,
      default: false
    },

    // 是否禁用
    disabled: {
      type: Boolean,
      default: false
    },

    // 提示占位符
    placeholder: {
      type: String,
      default: ''
    },

    // 表格数据唯一值对应的属性名
    dataKey: {
      type: String,
      required: true
    },

    // 自定义选择项的展示标题
    customOptionTitle: {
      type: Function,
      default(record) {
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
      // 加载控制
      loading: false,
      // 选中的值
      selectedValue: this.value,
      selectedRows: []
    }
  },
  computed: {
    selectOptions () {
      return this.selectedRows.map(x => {
        return {
          key: x[this.dataKey],
          value: x[this.dataKey],
          title: this.customOptionTitle(x)
        }
      })
    }
  },
  watch: {
    value () {
      this.selectedValue = this.value
    }
  },
  mounted () {
    // 禁止 select 框输入
    document.querySelector('.lov-select .ant-select-search__field').readOnly = true
  },
  methods: {
    emitValue (val) {
      // v-decorator 方式的表单值联动
      this.$emit('change', val)
      // v-model 方式的表单值联动
      this.$emit('input', val)
    },
    showModal () {
      this.$refs.lovModal.show({
        selectedValue: this.selectedValue,
        selectedRows: this.selectedRows
      })
    },
    /**
     * select 框删除 tag，clear 都会触发
     */
    handleChange (selectedValue) {
      let newSelectedRows = []
      let newSelectedValue = undefined
      if (this.multiple) {
        // 只保留包含的
        newSelectedRows = this.selectedRows.filter(row => selectedValue.includes(row[this.dataKey]))
      } else {
        newSelectedRows = this.selectedRows.filter(row => selectedValue === row[this.dataKey])
      }

      // 剔除掉无效的输入值
      if(newSelectedRows.length > 0){
        newSelectedValue = selectedValue.filter(value => newSelectedRows.findIndex(row => row[this.dataKey] === value) !== -1)
      }

      // 更新
      this.handleLovChoose({
        selectedValue: newSelectedValue,
        selectedRows: newSelectedRows
      })

    },
    /**
     * modal 确认选择时，或者 select 框属性变更时
     * @param data
     */
    handleLovChoose (data) {
      this.selectedValue = data.selectedValue
      this.selectedRows = data.selectedRows
      this.emitValue(data.selectedValue)
    }
  }
}
</script>


