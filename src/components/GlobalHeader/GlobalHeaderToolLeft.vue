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
import { mapActions, mapGetters, mapMutations } from 'vuex'
import { triggerWindowResizeEvent } from '@/utils/util'

export default {
  name: 'GlobalHeaderToolLeft',
  computed: {
    ...mapGetters(['sideMenuCollapsed', 'device']),
    collapsedButtonIconType () {
      const isMobile = this.device === 'mobile'
      const collapsed = this.sideMenuCollapsed
      if ((collapsed && isMobile) || (!collapsed && !isMobile)) {
        return 'menu-fold'
      } else {
        return 'menu-unfold'
      }
    }
  },
  methods: {
    ...mapActions(['setSidebar']),
    ...mapMutations(['TOGGLE_SIDE_MENU_COLLAPSED']),
    toggle(){
      this.TOGGLE_SIDE_MENU_COLLAPSED()
      this.setSidebar(!this.sideMenuCollapsed)
      triggerWindowResizeEvent()
    },
    refreshContent () {
      this.$bus.$emit('refresh-content')
    }
  }
}
</script>

<style scoped>

</style>
