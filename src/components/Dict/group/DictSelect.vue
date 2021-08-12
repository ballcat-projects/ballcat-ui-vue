<template>
  <a-select
    :allow-clear="allowClear"
    :placeholder="placeholder"
    :disabled="disabled"
    :value="selectedValue"
    style="width: 100%;"
    :mode="mode"
    @change="handleChange"
  >
    <a-select-option v-if="placeholderOption" value="">{{ placeholder }}</a-select-option>
    <a-select-option v-for="dictItem in dictItems" :key="dictItem.id" :value="dictItem.value">
      {{ dictItem.name }}
    </a-select-option>
  </a-select>
</template>
<script>
import DictGroupMixin from '@/components/Dict/group/dictGroupMixin'

export default {
  name: 'DictSelect',
  mixins: [DictGroupMixin],
  props: {
    mode: {
      type: String,
      default: 'default'
    },
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
