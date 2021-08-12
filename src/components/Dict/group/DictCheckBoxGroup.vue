<template>
  <a-checkbox-group
    :name="dictCode"
    :disabled="disabled"
    :value="selectedValue"
    @change="handleChange"
  >
    <a-checkbox
      v-for="dictItem in dictItems"
      :key="dictItem.id"
      :value="dictItem.value"
      :disabled="dictItem.disabled"
    >
      {{ dictItem.name }}
    </a-checkbox>
  </a-checkbox-group>
</template>
<script>
import DictGroupMixin from '@/components/Dict/group/dictGroupMixin'

export default {
  name: 'DictCheckBoxGroup',
  mixins: [DictGroupMixin]
}
</script>
