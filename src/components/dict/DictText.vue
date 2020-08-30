<template>
  <span>{{ showText }}</span>
</template>
<script>
import dictItemMixin from '@/components/dict/dictItemMixin'

export default {
  name: 'DictText',
  mixins: [dictItemMixin],
  props: {
    value: [Number, String],
    dictCode: String,
    color: String
  },
  data () {
    return {
      dictItem: null
    }
  },
  watch: {},
  computed: {
    showText() {
      if (this.dictItems.length === 0) {
        return this.value;
      }
      const item = this.dictItems.find(dictItem => this.getValByItem(dictItem) === this.value);
      return (item && item.name) || this.value;
    }
  },
  created () {},
  methods: {}
}
</script>
