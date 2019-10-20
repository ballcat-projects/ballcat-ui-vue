<template>
  <div>
    <a-modal
      :closable="false"
      width="900px"
      v-model="visible"
      @ok="handleOk"
    >
      <icon-selector @change="handleIconChange" v-model="icon"/>
    </a-modal>
  </div>
</template>

<script>
import IconSelector from '@/components/IconSelector'

export default {
  name: 'IconSelectModal',
  components: {IconSelector},
  data() {
    return {
      visible: false,
      icon: ''
    }
  },
  methods: {
    show() {
      this.visible = true
    },
    handleOk(e) {
      this.$emit('choose', this.icon)
      this.visible = false
    },
    handleIconChange (icon){
      this.icon = icon
    }
  }
}
</script>

<style scoped>

</style>