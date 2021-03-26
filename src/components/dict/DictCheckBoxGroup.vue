<template>
  <a-checkbox-group
    :name="dictCode"
    :disabled="disabled"
    :value="selectedValue"
    @change="handleChange"
  >
    <a-checkbox v-for="dict in dictItems" :key="dict.id" :value="getValByItem(dict)">
      {{ dict.name }}
    </a-checkbox>
  </a-checkbox-group>
</template>
<script>
import DictMixin from '@/components/dict/dictMixin'
import dictItemMixin from '@/components/dict/dictItemMixin'

export default {
  name: 'DictCheckBoxGroup',
  mixins: [DictMixin, dictItemMixin]
}
</script>
