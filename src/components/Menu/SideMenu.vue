<template>
  <!-- eslint-disable vue/no-mutating-props-->
  <a-layout-sider
    :class="['sider', isDesktop ? null : 'shadow', theme, fixSiderbar ? 'ant-fixed-sidemenu' : null ]"
    width="208px"
    :collapsed="sidebarCollapsed"
    :collapsible="true"
    :style="style"
    :trigger="null"
  >
    <!-- eslint-enable-->
    <project-logo />
    <s-menu
      :collapsed="sidebarCollapsed"
      :menu="menus"
      :theme="theme"
      :mode="mode"
      @select="onSelect"
    />
  </a-layout-sider>

</template>

<script>
import SMenu from './index'
import { mixin, mixinDevice } from '@/utils/mixin'
import { mapGetters } from 'vuex'
import ProjectLogo from '@/components/ProjectLogo'

export default {
  name: 'SideMenu',
  components: { ProjectLogo, SMenu },
  mixins: [mixin, mixinDevice],
  props: {
    mode: {
      type: String,
      required: false,
      default: 'inline'
    },
    theme: {
      type: String,
      required: false,
      default: 'dark'
    },
    menus: {
      type: Array,
      required: true
    }
  },
  computed: {
    ...mapGetters(['sidebarCollapsed']),
    style(){
      const width = this.sidebarCollapsed ?  '48px': '208px'
      return {
        overflow: 'hidden',
        flex: '0 0 ' + width,
        maxWidth: width,
        minWidth: width,
        width: width,
        height: '100%'
      }
    }
  },
  methods: {
    onSelect (obj) {
      this.$emit('menuSelect', obj)
    }
  }
}
</script>
