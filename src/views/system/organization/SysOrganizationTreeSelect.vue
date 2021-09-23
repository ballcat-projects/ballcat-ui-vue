<template>
  <a-tree-select
    :value="selectedValue"
    :multiple="multiple"
    :placeholder="placeholder"
    style="width: 100%"
    :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
    :tree-data="treeData"
    :tree-default-expand-all="treeDefaultExpandAll"
    :allow-clear="allowClear"
    :replace-fields="{
      title: 'name',
      key: 'id',
      value: 'id'
    }"
    @change="handleChange"
  />
</template>

<script>
import { getTree } from '@/api/system/organization'

export default {
  name: 'SysOrganizationTreeSelect',
  props: {
    value: {
      type: [Array, Number],
      default: () => []
    },
    organizationTree: {
      type: [Array],
      default: () => null
    },
    multiple: {
      type: Boolean,
      default: false
    },
    allowClear: {
      type: Boolean,
      default: true
    },
    placeholder: {
      type: String,
      default: ''
    },
    treeDefaultExpandAll: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      selectedValue: [],
      treeData: []
    }
  },
  watch: {
    value (newVal) {
      this.selectedValue = newVal
    }
  },
  created () {
    if (this.organizationTree) {
      this.treeData = this.organizationTree
    } else {
      getTree().then(res => {
        this.treeData = res.data
      })
    }
  },
  methods: {
    handleChange (val) {
      if (val && val.target) {
        this.selectedValue = val.target.value
      } else {
        this.selectedValue = val
      }
      // v-decorator 方式的表单值联动
      this.$emit('change', this.selectedValue)
      // v-model 方式的表单值联动
      this.$emit('input', this.selectedValue)
    }
  }
}
</script>

<style scoped>

</style>
