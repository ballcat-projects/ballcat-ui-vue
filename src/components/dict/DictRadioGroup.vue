<template>
  <a-radio-group
    :disabled="disabled"
    :value="selectedValue"
    @change="handleChange">
    <a-radio v-for="dict in dictItems" :value="getValByItem(dict)" :key="dict.id">
      {{ dict.name }}
    </a-radio>
  </a-radio-group>
</template>
<script>
import DictMixin from '@/components/dict/dictMixin'
import dictItemMixin from '@/components/dict/dictItemMixin'

export default {
  name: 'DictOption',
  mixins: [DictMixin, dictItemMixin]
}
</script>
