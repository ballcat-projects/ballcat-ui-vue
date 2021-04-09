<template>
  <div>
    <a-modal
      v-model="visible"
      :closable="false"
      width="900px"
      @ok="handleOk"
    >
      <icon-selector v-model="icon" @change="handleIconChange" />
    </a-modal>
  </div>
</template>

<script>
import { IconSelector } from '@/components/IconSelector'

export default {
  name: 'IconSelectorModal',
  components: { IconSelector },
  data () {
    return {
      visible: false,
      icon: ''
    }
  },
  methods: {
    show () {
      this.visible = true
    },
    handleOk (e) {
      this.$emit('choose', this.icon)
      this.visible = false
    },
    handleIconChange (icon) {
      this.icon = icon
    }
  }
}
</script>

<style scoped>

</style>
