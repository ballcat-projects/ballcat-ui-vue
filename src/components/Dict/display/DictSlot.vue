<template>
  <a-tag :color="color">{{ showText }}</a-tag>
</template>
<script>
import DictDisplayMixin from '@/components/Dict/display/dictDisplayMixin'

export default {
  name: 'DictSlot',
  mixins: [DictDisplayMixin],
  computed: {
    color() {
      let color
      if(this.dictItem.attributes){
        color = this.dictItem.attributes['tagColor']
      }
      return this.colors[this.value] || color || this.uniformColor
    }
  }
}
</script>
<style scoped>
.ant-tag {
  margin-right: 0;
}
</style>
