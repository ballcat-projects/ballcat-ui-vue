<template>
  <a-badge :status="status" :color="color" :text="showText" />
</template>
<script>
import DictDisplayMixin from '@/components/Dict/display/dictDisplayMixin'

export default {
  name: 'DictBadge',
  mixins: [DictDisplayMixin],
  computed: {
    color() {
      let color
      if (this.dictItem.attributes) {
        color = this.dictItem.attributes['badgeColor']
      }
      return this.colors[this.value] || color || this.uniformColor
    },
    status() {
      let status

      if (this.dictItem.attributes) {
        status = this.dictItem.attributes['badgeStatus']
      }
      return status
    }
  }
}
</script>
<style scoped>
</style>
