<template>
  <a-radio-group
    :disabled="disabled"
    :value="selectedValue"
    @change="handleChange">
    <a-radio v-for="dict in dictList" :value="Number(dict.value)">
      {{ dict.name }}
    </a-radio>
  </a-radio-group>
</template>
<script>
  import DictMixin from '@/components/dict/dictMixin'
  export default {
    name: 'DictOption',
    mixins: [DictMixin],
  }
</script>
