<template>
   <span>
       <a-select
         :placeholder="placeholder"
         :disabled="disabled"
         :value="selectedValue"
         @change="handleChange">
        <a-select-option v-if="placeholderOption" value="">{{placeholder}}</a-select-option>
        <a-select-option v-for="dict in dictList" :key="Number(dict.value)">
            {{ dict.name }}
        </a-select-option>
      </a-select>
    </span>
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
