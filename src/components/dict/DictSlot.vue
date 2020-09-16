<template>
  <a-tag :color="color">{{ showText }}</a-tag>
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
    color() {
      let color
      if(this.dictItem.attributes){
        color = this.dictItem.attributes['tagColor']
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
  created () {},
  methods: {}
}
</script>
