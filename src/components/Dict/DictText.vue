<template>
  <span :style="{color: color}">{{ showText }}</span>
</template>
<script>
import dictItemMixin from '@/components/Dict/dictItemMixin'

export default {
  name: 'DictText',
  mixins: [dictItemMixin],
  props: {
    value: {
      type: [String, Number, Boolean],
      default: null
    },
    colors: {
      type: Object,
      default: function () {
        return {}
      }
    }
  },
  data () {
    return {}
  },
  computed: {
    color() {
      let color
      if(this.dictItem.attributes){
        color = this.dictItem.attributes['textColor']
      }
      return this.colors[this.value] || color || this.uniformColor
    },
    dictItem() {
      return  this.dictItems.find(dictItem => this.getValByItem(dictItem) === this.value) || {};
    },
    showText() {
      return (this.dictItem && this.dictItem.name) || this.value;
    }
  },
  watch: {},
  created () {},
  methods: {}
}
</script>
