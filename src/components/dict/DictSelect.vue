<template>
  <a-select
    :allowClear="true"
    :placeholder="placeholder"
    :disabled="disabled"
    :value="selectedValue"
    style="width: 100%;"
    @change="handleChange">
    <a-select-option v-if="placeholderOption" value="">{{ placeholder }}</a-select-option>
    <a-select-option v-for="dict in dictItems" :key="getValByItem(dict)">
      {{ dict.name }}
    </a-select-option>
  </a-select>
</template>
<script>
import DictMixin from '@/components/dict/dictMixin'

export default {
  name: 'DictSelect',
  mixins: [DictMixin],
  props: {
    placeholder: String,
    placeholderOption: {
      type: Boolean,
      default: false
    }
  }
}
</script>
