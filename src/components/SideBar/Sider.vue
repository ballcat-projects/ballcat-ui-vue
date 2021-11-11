<template>
  <a-layout-sider
    :class="['sider',
             isDesktop ? null : 'shadow',
             navTheme === 'light' ? 'sider-light': null,
             fixSiderbar ? 'sider-fixed' : null ]"
    width="208px"
    :collapsed="sidebarCollapsed"
    :collapsible="true"
    :style="style"
    :theme="navTheme"
    :trigger="null"
  >
    <project-logo />
    <div style="flex: 1; overflow-y: auto; overflow-x: hidden;">
      <side-menu
        mode="inline"
        :menus="menus"
        :collapsed="sidebarCollapsed"
        :collapsible="true"
      />
    </div>
  </a-layout-sider>
</template>

<script>
import ProjectLogo from '@/components/ProjectLogo'
import SideMenu from '@/components/Menu/SideMenu'
import { mapGetters } from 'vuex'
import { mixinDevice } from '@/utils/mixin'

export default {
  name: 'Sider',
  components: {ProjectLogo, SideMenu},
  mixins: [mixinDevice],
  props: {
    menus: {
      type: Array,
      required: true
    }
  },
  computed: {
    ...mapGetters([
      'sidebarCollapsed',
      'isSideMenu',
      'isMixMenu',
      'isDrawerMenu',
      'fixSiderbar',
      'navTheme'
    ]),
    style () {
      const width = this.sidebarCollapsed ? '48px' : '208px'
      return {
        overflow: 'hidden',
        flex: '0 0 ' + width,
        maxWidth: width,
        minWidth: width,
        width: width,
        height: '100%'
      }
    }
  }
}
</script>

<style scoped>

</style>
