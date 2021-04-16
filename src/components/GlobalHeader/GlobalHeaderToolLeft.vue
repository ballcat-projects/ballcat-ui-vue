<template>
  <div class="ballcat-global-header-tool-left">
    <span class="ballcat-global-header-tool-action" @click="toggle">
      <a-icon :type="collapsedButtonIconType" style="transform: scale(1.15);" />
    </span>
    <span class="ballcat-global-header-tool-action" @click="refreshContent">
      <a-icon type="reload" />
    </span>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
import { APP_MUTATIONS } from '@/store/mutation-types'

export default {
  name: 'GlobalHeaderToolLeft',
  computed: {
    ...mapGetters(['sidebarCollapsed', 'device']),
    collapsedButtonIconType () {
      if (this.sidebarCollapsed) {
        return 'menu-unfold'
      } else {
        return 'menu-fold'
      }
    }
  },
  methods: {
    ...mapMutations([APP_MUTATIONS.TOGGLE_SIDE_BAR_COLLAPSED]),
    toggle(){
      this[APP_MUTATIONS.TOGGLE_SIDE_BAR_COLLAPSED](!this.sidebarCollapsed)
    },
    refreshContent () {
      this.$bus.$emit('refresh-content')
    }
  }
}
</script>

<style scoped>

</style>
