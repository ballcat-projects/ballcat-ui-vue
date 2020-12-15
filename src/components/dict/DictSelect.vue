<template>
  <a-select
    :allowClear="allowClear"
    :placeholder="placeholder"
    :disabled="disabled"
    :value="selectedValue"
    style="width: 100%;"
    @change="handleChange">
    <a-select-option v-if="placeholderOption" value="">{{ placeholder }}</a-select-option>
    <a-select-option v-for="dict in dictItems" :key="dict.id" :value="getValByItem(dict)">
      {{dict.name}}
    </a-select-option>
  </a-select>
</template>
<script>
import DictMixin from '@/components/dict/dictMixin'
import dictItemMixin from '@/components/dict/dictItemMixin'

export default {
  name: 'DictSelect',
  mixins: [DictMixin, dictItemMixin],
  props: {
    allowClear: {
      type: Boolean,
      default: true
    },
    placeholder: {
      type: String,
      default: '请选择'
    },
    placeholderOption: {
      type: Boolean,
      default: false
    }
  }
}
</script>
