<template>
  <a-select
    :value="roleCodes"
    style="width: 100%"
    :mode="mode"
    :placeholder="placeholder"
    :allow-clear="allowClear"
    @change="handleChange"
  >
    <a-select-option
      v-for="selectData in roleSelectData"
      :key="selectData.value"
    >
      {{ selectData.name }}
    </a-select-option>
  </a-select>
</template>
<script>
import { getSelectData } from '@/api/system/role'

export default {
  name: 'SysRoleSelect',
  props: {
    value: {
      type: Array,
      default: () => []
    },
    mode: {
      type: String,
      default: 'multiple'
    },
    allowClear: {
      type: Boolean,
      default: true
    },
    placeholder: {
      type: String,
      default: ''
    },
    placeholderOption: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      // 角色选择框
      roleSelectData: [],
      // 已选择的角色标识
      roleCodes: []
    }
  },
  watch: {
    value (newVal) {
      this.roleCodes = newVal
    }
  },
  created () {
    getSelectData({}).then(res => {
      this.roleSelectData = res.data
    })
  },
  methods: {
    handleChange (val) {
      if (val && val.target) {
        this.roleCodes = val.target.value
      } else {
        this.roleCodes = val
      }
      // v-decorator 方式的表单值联动
      this.$emit('change', this.roleCodes)
      // v-model 方式的表单值联动
      this.$emit('input', this.roleCodes)
    }
  }
}
</script>

<style scoped>

</style>
