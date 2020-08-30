<template>
  <a-tag :color="colors[value] || uniformColor">{{ showText }}</a-tag>
</template>
<script>
import dictItemMixin from '@/components/dict/dictItemMixin'

export default {
  name: 'DictSlot',
  mixins: [dictItemMixin],
  props: {
    value: [Number, String, Boolean],
    dictCode: String,
    colors: {
      type: Object,
      default: function () {
        return {}
      }
    },
    uniformColor: String
  },
  data () {
    return {}
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
