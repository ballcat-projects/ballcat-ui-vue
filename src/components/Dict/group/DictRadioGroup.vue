<template>
  <a-radio-group
    :disabled="disabled"
    :value="selectedValue"
    @change="handleChange"
  >
    <template v-if="type.toLowerCase() === 'radio'">
      <a-radio
        v-for="dictItem in dictItems"
        :key="dictItem.id"
        :value="dictItem.value"
        :disabled="dictItem.disabled"
      >
        {{ dictItem.name }}
      </a-radio>
    </template>
    <template v-if="type.toLowerCase() === 'button'">
      <a-radio-button
        v-for="dictItem in dictItems"
        :key="dictItem.id"
        :value="dictItem.value"
        :disabled="dictItem.disabled"
      >
        {{ dictItem.name }}
      </a-radio-button>
    </template>
  </a-radio-group>
</template>
<script>
import DictGroupMixin from '@/components/Dict/group/dictGroupMixin'

export default {
  name: 'DictRadioGroup',
  mixins: [DictGroupMixin],
  props: {
    type: {
      type: String,
      default: 'radio'
    }
  },
}
</script>
