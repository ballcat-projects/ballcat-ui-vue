<template>
  <span :style="{color: color}">{{ showText }}</span>
</template>
<script>
import DictDisplayMixin from '@/components/Dict/display/dictDisplayMixin'

export default {
  name: 'DictText',
  mixins: [DictDisplayMixin],
  computed: {
    color() {
      let color
      if(this.dictItem.attributes){
        color = this.dictItem.attributes['textColor']
      }
      return this.colors[this.value] || color || this.uniformColor
    }
  }
}
</script>
